#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# run.sh — local dev: start Hugo server + HTTPS proxy via Caddy
# =============================================================================
# Usage:
#   ./run.sh              # start all services
#   ./run.sh --stop       # stop all services
#   ./run.sh --status     # show process status
#   ./run.sh --logs       # tail logs
# =============================================================================

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONF="$ROOT_DIR/.dev/supervisord.conf"
LOG_DIR="$ROOT_DIR/.dev/logs"
CERT_DIR="$ROOT_DIR/.dev-certs"
CERT_KEY="$CERT_DIR/key.pem"
CERT_CRT="$CERT_DIR/cert.pem"
HUGO_PORT=1314
HTTPS_PORT=8443
LAN_IP="$(ip route get 1 | awk '{print $7; exit}')"

# --- Stop mode ---------------------------------------------------------------
if [ "${1:-}" = "--stop" ]; then
    if [ -f /tmp/supervisord-fried-rice.pid ] && supervisorctl -c "$CONF" pid 2>/dev/null; then
        echo "==> Stopping all services..."
        supervisorctl -c "$CONF" shutdown
        echo "==> Done."
    else
        echo "supervisord is not running."
    fi
    exit 0
fi

# --- Status mode -------------------------------------------------------------
if [ "${1:-}" = "--status" ]; then
    exec supervisorctl -c "$CONF" status
fi

# --- Logs mode ---------------------------------------------------------------
if [ "${1:-}" = "--logs" ]; then
    exec supervisorctl -c "$CONF" tail -f "${2:-}" ""
fi

# --- Free ports --------------------------------------------------------------
free_port() {
    local port="$1" name="$2"
    local killed
    killed=$(fuser -k "$port/tcp" 2>/dev/null) || true
    if [ -n "$killed" ]; then
        sleep 1
    fi
}

free_port "$HUGO_PORT" "Hugo"
free_port "$HTTPS_PORT" "HTTPS proxy"

# --- Self-signed TLS cert (for LAN HTTPS) ------------------------------------
mkdir -p "$CERT_DIR"
if [ ! -f "$CERT_KEY" ] || [ ! -f "$CERT_CRT" ]; then
    echo "==> Generating self-signed TLS cert ..."
    openssl req -x509 -newkey rsa:2048 -nodes \
        -keyout "$CERT_KEY" -out "$CERT_CRT" \
        -days 365 -subj "/CN=localhost" \
        -addext "subjectAltName=DNS:localhost,DNS:${LAN_IP},IP:${LAN_IP}" \
        2>/dev/null
fi

# --- Generate Caddyfile dynamically ------------------------------------------
cat > "$ROOT_DIR/.dev/Caddyfile" << CADDYFILE
{
    auto_https off
    servers :${HTTPS_PORT} {
        protocols h1 h2
    }
}

:${HTTPS_PORT} {
    bind 0.0.0.0
    reverse_proxy localhost:${HUGO_PORT}
    tls ${CERT_CRT} ${CERT_KEY}
}
CADDYFILE

mkdir -p "$LOG_DIR"

# --- Start supervisord -------------------------------------------------------
echo "==> Starting services via supervisord..."
supervisord -c "$CONF"

echo "==> Waiting for services..."
for i in $(seq 1 30); do
    if ss -tlnp 2>/dev/null | grep -q ":${HUGO_PORT} "; then
        break
    fi
    sleep 0.5
done

echo ""
echo "==> Ready!"
echo "    HTTP:  http://localhost:${HUGO_PORT}  |  http://${LAN_IP}:${HUGO_PORT}"
echo "    HTTPS: https://localhost:${HTTPS_PORT}  |  https://${LAN_IP}:${HTTPS_PORT}"
echo ""
echo "    Status:  ./run.sh --status"
echo "    Logs:    ./run.sh --logs [hugo|proxy]"
echo "    Stop:    ./run.sh --stop"
