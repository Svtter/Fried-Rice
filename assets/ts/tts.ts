/**
 * TTS player module — plays pre-generated MP3 audio via <audio> element.
 */

function setupTTS() {
    const player = document.querySelector('.tts-player') as HTMLElement;
    if (!player) return;

    const audioUrl = player.getAttribute('data-audio-url');
    if (!audioUrl) {
        player.style.display = 'none';
        return;
    }

    const playBtn = player.querySelector('.tts-play') as HTMLElement;
    const stopBtn = player.querySelector('.tts-stop') as HTMLElement;
    const rateSelect = player.querySelector('.tts-rate') as HTMLSelectElement;
    const progressEl = player.querySelector('.tts-progress') as HTMLElement;

    if (!playBtn || !stopBtn || !rateSelect || !progressEl) return;

    const audio = new Audio();
    audio.preload = 'none';

    // Check if the audio file exists via HEAD request
    fetch(audioUrl, { method: 'HEAD' }).then(resp => {
        if (!resp.ok) {
            player.style.display = 'none';
        } else {
            audio.src = audioUrl;
        }
    }).catch(() => {
        player.style.display = 'none';
    });

    function formatTime(seconds: number): string {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    audio.addEventListener('timeupdate', () => {
        if (audio.duration && isFinite(audio.duration)) {
            progressEl.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        }
    });

    audio.addEventListener('ended', () => {
        playBtn.textContent = '▶ 听文章';
        progressEl.textContent = '';
    });

    audio.addEventListener('error', () => {
        player.style.display = 'none';
    });

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playBtn.textContent = '⏸ 暂停';
        } else {
            audio.pause();
            playBtn.textContent = '▶ 继续';
        }
    });

    stopBtn.addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
        playBtn.textContent = '▶ 听文章';
        progressEl.textContent = '';
    });

    rateSelect.addEventListener('change', () => {
        audio.playbackRate = parseFloat(rateSelect.value);
    });
}

export { setupTTS };
