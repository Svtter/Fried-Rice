/**
 * Text-to-Speech module for article reading using Web Speech API.
 */

interface TTSState {
    utterances: SpeechSynthesisUtterance[];
    currentIndex: number;
    isPlaying: boolean;
    isPaused: boolean;
}

const state: TTSState = {
    utterances: [],
    currentIndex: 0,
    isPlaying: false,
    isPaused: false,
};

function getArticleTexts(): string[] {
    const content = document.querySelector('.article-content');
    if (!content) return [];

    const clone = content.cloneNode(true) as HTMLElement;

    // Remove the TTS player itself
    clone.querySelectorAll('.tts-player').forEach(el => el.remove());
    // Remove code blocks
    clone.querySelectorAll('div.highlight, pre, code').forEach(el => el.remove());
    // Remove script/style
    clone.querySelectorAll('script, style').forEach(el => el.remove());

    const paragraphs: string[] = [];
    const blocks = clone.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, td, th, figcaption');

    blocks.forEach(block => {
        const text = (block.textContent || '').trim();
        if (text.length > 0) {
            paragraphs.push(text);
        }
    });

    // Fallback: if no block-level elements found, split by newlines
    if (paragraphs.length === 0) {
        const fullText = (clone.textContent || '').trim();
        if (fullText) {
            return fullText.split(/\n+/).map(s => s.trim()).filter(s => s.length > 0);
        }
    }

    return paragraphs;
}

function pickChineseVoice(): SpeechSynthesisVoice | null {
    const voices = speechSynthesis.getVoices();
    const zhVoice = voices.find(v => v.lang.startsWith('zh-CN'))
        || voices.find(v => v.lang.startsWith('zh'));
    return zhVoice || null;
}

function updateProgress(progressEl: HTMLElement) {
    const total = state.utterances.length;
    const current = state.currentIndex + 1;
    progressEl.textContent = total > 0 ? `${current}/${total}` : '';
}

function stop(elements: { playBtn: HTMLElement; progressEl: HTMLElement }) {
    speechSynthesis.cancel();
    state.isPlaying = false;
    state.isPaused = false;
    state.currentIndex = 0;
    elements.playBtn.textContent = '▶ 听文章';
    elements.progressEl.textContent = '';
}

function speakFrom(
    index: number,
    rate: number,
    elements: { playBtn: HTMLElement; progressEl: HTMLElement }
) {
    if (index >= state.utterances.length) {
        stop(elements);
        return;
    }

    state.currentIndex = index;
    updateProgress(elements.progressEl);

    const utt = state.utterances[index];
    utt.rate = rate;

    const voice = pickChineseVoice();
    if (voice) utt.voice = voice;

    utt.onend = () => {
        if (state.isPlaying && !state.isPaused) {
            speakFrom(index + 1, rate, elements);
        }
    };

    utt.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
            console.warn('TTS error on paragraph', index, e.error);
        }
        if (state.isPlaying && e.error !== 'canceled') {
            speakFrom(index + 1, rate, elements);
        }
    };

    speechSynthesis.speak(utt);
}

function setupTTS() {
    if (!('speechSynthesis' in window)) return;

    const player = document.querySelector('.tts-player') as HTMLElement;
    if (!player) return;

    const playBtn = player.querySelector('.tts-play') as HTMLElement;
    const stopBtn = player.querySelector('.tts-stop') as HTMLElement;
    const rateSelect = player.querySelector('.tts-rate') as HTMLSelectElement;
    const progressEl = player.querySelector('.tts-progress') as HTMLElement;

    if (!playBtn || !stopBtn || !rateSelect || !progressEl) return;

    const elements = { playBtn, progressEl };

    // Preload voices (some browsers load them asynchronously)
    speechSynthesis.getVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    }

    // Build utterances from article text
    const texts = getArticleTexts();
    if (texts.length === 0) {
        player.style.display = 'none';
        return;
    }

    state.utterances = texts.map(text => new SpeechSynthesisUtterance(text));

    playBtn.addEventListener('click', () => {
        if (state.isPlaying && !state.isPaused) {
            speechSynthesis.pause();
            state.isPaused = true;
            playBtn.textContent = '▶ 继续';
            return;
        }

        if (state.isPaused) {
            speechSynthesis.resume();
            state.isPaused = false;
            playBtn.textContent = '⏸ 暂停';
            return;
        }

        const rate = parseFloat(rateSelect.value);
        state.isPlaying = true;
        state.isPaused = false;
        playBtn.textContent = '⏸ 暂停';
        speakFrom(0, rate, elements);
    });

    stopBtn.addEventListener('click', () => {
        stop(elements);
    });

    rateSelect.addEventListener('change', () => {
        if (state.isPlaying) {
            const rate = parseFloat(rateSelect.value);
            const idx = state.currentIndex;
            speechSynthesis.cancel();
            state.isPaused = false;
            playBtn.textContent = '⏸ 暂停';
            speakFrom(idx, rate, elements);
        }
    });

    window.addEventListener('beforeunload', () => {
        speechSynthesis.cancel();
    });

    window.addEventListener('pagehide', () => {
        speechSynthesis.cancel();
    });
}

export { setupTTS };
