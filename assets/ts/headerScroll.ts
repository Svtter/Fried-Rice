/*!
*   Header scroll state
*
*   Toggles a `.scrolled` class on the fixed site header once the page is
*   scrolled past a small threshold. The class enables a drop shadow + a more
*   opaque background so the header visually lifts above the content as the
*   reader scrolls — the layered glassmorphism stays subtle while at rest.
*/
const SCROLL_THRESHOLD = 8;

export function setupHeaderScroll(): void {
    const header = document.querySelector<HTMLElement>('.site-header');
    if (!header) return;

    let ticking = false;

    const update = () => {
        const scrolled = window.scrollY > SCROLL_THRESHOLD;
        header.classList.toggle('scrolled', scrolled);
        ticking = false;
    };

    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
}
