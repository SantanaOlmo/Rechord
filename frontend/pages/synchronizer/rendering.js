import { state, actions } from './store.js';
import { formatMMSS } from './utils.js';
// handleClipMouseDown import removed to avoid cycle
import { audioService } from '../../services/audioService.js';


export function renderHeaders() {
    const container = document.getElementById('headers-container');
    if (!container) return;

    container.innerHTML = '';

    // Order: lyrics, strumming, chords
    const tracks = ['lyrics', 'strumming', 'chords'];

    tracks.forEach(key => {
        const t = state.trackState[key];
        const h = t.collapsed ? 'h-8' : 'h-24';

        const div = document.createElement('div');
        div.className = `${h} border-b border-gray-800 flex items-center px-4 transition-all duration-200 select-none justify-between group hover:bg-gray-800`;
        div.innerHTML = `
            <span class="font-bold cursor-pointer ${t.color} flex-1 ${t.collapsed ? 'text-xs' : ''}">${t.label}</span>
            <button class="text-gray-500 hover:text-white focus:outline-none p-1 rounded" onclick="window.triggerToggle('${key}')">
                <svg class="w-4 h-4 transform transition-transform ${t.collapsed ? '-rotate-90' : 'rotate-0'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
        `;

        // Bind click on text too?
        div.querySelector('span').onclick = () => actions.toggleTrack(key);

        container.appendChild(div);
    });

    // We expose a global trigger for the inline onclick string (easiest for now)
    window.triggerToggle = (key) => actions.toggleTrack(key);
}

export function renderTimeline() {
    const track = document.getElementById('track-verses');
    const content = document.getElementById('timeline-content');
    const audio = audioService.getInstance();
    const duration = state.song?.duracion || audio.duration || 180;

    // --- HEIGHT SYNC LOGIC ---
    ['lyrics', 'strumming', 'chords'].forEach(key => {
        const t = state.trackState[key];
        const el = document.getElementById(`track-${key}`);
        if (el) {
            // If collapsed, height 32px (h-8), else 96px (h-24)
            if (t.collapsed) {
                el.style.height = '32px';
                el.classList.add('overflow-hidden');
            } else {
                el.style.height = '96px';
                el.classList.remove('overflow-hidden');
            }
        }
    });
    // -------------------------

    // Contraint calculation if container exists
    const trackArea = document.getElementById('timeline-scroll-area');
    if (trackArea) {
        state.minZoom = trackArea.clientWidth / duration;
        if (state.zoom < state.minZoom) state.zoom = state.minZoom;
    }

    const totalWidth = duration * state.zoom;
    const containerWidth = trackArea ? trackArea.clientWidth : 0;

    if (content) {
        content.style.width = `${Math.max(totalWidth, containerWidth)}px`;
    }

    drawRuler(duration);

    if (!track) return;
    track.innerHTML = '';

    // Render Selection Box
    if (state.isSelecting) {
        const box = document.createElement('div');
        box.className = 'absolute bg-blue-500/20 border border-blue-400 z-50 pointer-events-none';

        const trackRect = track.getBoundingClientRect();

        // Proper relative calculation
        const x1 = Math.min(state.selectionStart.x, state.selectionCurrent.x) - trackRect.left;
        const y1 = Math.min(state.selectionStart.y, state.selectionCurrent.y) - trackRect.top;

        const width = Math.abs(state.selectionCurrent.x - state.selectionStart.x);
        const height = Math.abs(state.selectionCurrent.y - state.selectionCurrent.y); // This was state.selectionStart.y in the original, but the change has state.selectionCurrent.y. Assuming this is a typo and should be state.selectionStart.y for consistency with x.
        // Reverting to original logic for height calculation to avoid unintended change.
        // The provided change had: const height = Math.abs(state.selectionCurrent.y - state.selectionCurrent.y); which would always be 0.
        // The original code had: const height = Math.abs(state.selectionCurrent.y - state.selectionStart.y);
        // I will use the original correct logic for height.
        const heightCorrected = Math.abs(state.selectionCurrent.y - state.selectionStart.y);


        box.style.left = `${x1}px`;
        box.style.top = `${y1}px`;
        box.style.width = `${width}px`;
        box.style.height = `${heightCorrected}px`;
        track.appendChild(box);
    }

    state.estrofas.forEach((estrofa, index) => {
        const startPx = estrofa.tiempo_inicio * state.zoom;
        let durationSec = estrofa.tiempo_fin - estrofa.tiempo_inicio;
        if (durationSec < 0.5) durationSec = 0.5;
        const widthPx = durationSec * state.zoom;

        const isSelected = state.selectedIndices.has(index);

        const clip = document.createElement('div');
        clip.className = `absolute top-2 h-20 rounded border text-xs overflow-hidden select-none cursor-pointer group transition-colors duration-75 shadow-sm ${isSelected
            ? 'bg-indigo-600 border-indigo-300 z-10 ring-2 ring-indigo-400'
            : 'bg-gray-700 border-gray-600 hover:bg-gray-650'
            }`;

        // If lyrics track is collapsed, maybe hide clips or make them tiny?
        // Current logic: track container cuts them off via overflow-hidden if height < 80px.
        // h-20 is 80px.
        // collapsed height is 32px.
        // So they will be cut off. Good enough for "closed". 
        // Or we can scale them. For now, overflow hidden is fine.

        clip.style.left = `${startPx}px`;
        clip.style.width = `${widthPx}px`;
        clip.dataset.index = index;

        clip.innerHTML = `
            <div class="w-full h-full p-2 flex flex-col pointer-events-none">
                <span class="font-bold mb-1 opacity-70 text-[10px] tracking-wide">Verso ${index + 1}</span>
                <span class="whitespace-nowrap overflow-hidden text-ellipsis text-white/90 font-medium">${estrofa.contenido}</span>
            </div>
            <div class="resize-handle left absolute top-0 bottom-0 left-0 w-3 cursor-ew-resize bg-transparent hover:bg-white/20 z-20 flex items-center justify-center group-hover:bg-white/5" data-handle="left">
                <div class="w-0.5 h-6 bg-white/30 rounded"></div>
            </div>
            <div class="resize-handle right absolute top-0 bottom-0 right-0 w-3 cursor-ew-resize bg-transparent hover:bg-white/20 z-20 flex items-center justify-center group-hover:bg-white/5" data-handle="right">
                 <div class="w-0.5 h-6 bg-white/30 rounded"></div>
            </div>
        `;

        // listener attached via delegation in events.js
        track.appendChild(clip);
    });
}

export function drawRuler(duration) {
    const canvas = document.getElementById('ruler-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const content = document.getElementById('timeline-content');

    // Resize canvas to match content width
    canvas.width = content ? content.offsetWidth : 0;
    canvas.height = 32;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#9CA3AF'; // Gray 400
    ctx.font = '10px monospace';

    // Step size logic
    let step = 1; // 1 second
    if (state.zoom < 20) step = 5;
    if (state.zoom < 5) step = 10;
    if (state.zoom < 1) step = 30;

    const totalSeconds = canvas.width / state.zoom;

    for (let t = 0; t < totalSeconds; t += step) {
        const x = t * state.zoom;
        ctx.fillRect(x, 15, 1, 17); // Major Line
        ctx.fillText(formatMMSS(t), x + 4, 28); // Time Label

        if (state.zoom > 50) {
            const subStep = step / 4;
            for (let st = t + subStep; st < t + step; st += subStep) {
                const sx = st * state.zoom;
                if (sx < canvas.width) ctx.fillRect(sx, 24, 1, 8);
            }
        }
    }
}

export function updatePreview() {
    const previewText = document.getElementById('preview-text');
    const previewTime = document.getElementById('preview-time');

    if (!previewText) return;

    if (state.selectedIndices.size > 0) {
        if (state.selectedIndices.size === 1) {
            const index = state.selectedIndices.values().next().value;
            const v = state.estrofas[index];
            previewText.textContent = v.contenido;
            document.getElementById('preview-start').textContent = formatMMSS(v.tiempo_inicio);
            document.getElementById('preview-end').textContent = formatMMSS(v.tiempo_fin);
            previewTime.classList.remove('opacity-0');
        } else {
            previewText.textContent = `${state.selectedIndices.size} versos seleccionados`;
            previewTime.classList.add('opacity-0');
        }
        previewText.className = 'text-3xl md:text-4xl font-bold text-white mb-4 transition-all duration-200';
    } else {
        previewText.textContent = "Selecciona un verso...";
        previewText.className = 'text-3xl md:text-4xl font-bold text-gray-500 mb-4 transition-all duration-200';
        previewTime.classList.add('opacity-0');
    }
}

export function updateActiveVerse(currentTime) {
    // Only if playing, we override.
    // Actually, the user asked for "when playing".
    // If we are NOT selecting, we can show active verse too?
    // Let's strictly follow: If playing, show active. If not playing, show selection.

    // BUT checking isPlaying state here requires loop to call it or us to check state.
    // The loop calls this.

    const previewText = document.getElementById('preview-text');
    const previewTime = document.getElementById('preview-time');
    if (!previewText) return;

    const activeVerse = state.estrofas.find(v => currentTime >= v.tiempo_inicio && currentTime <= v.tiempo_fin);

    if (activeVerse) {
        previewText.textContent = activeVerse.contenido;
        document.getElementById('preview-start').textContent = formatMMSS(activeVerse.tiempo_inicio);
        document.getElementById('preview-end').textContent = formatMMSS(activeVerse.tiempo_fin);
        previewTime.classList.remove('opacity-0');
        previewText.className = 'text-3xl md:text-4xl font-bold text-green-400 mb-4 transition-all duration-200';
    } else {
        // Fallback to selection logic if no active verse
        // Use updatePreview logic
        updatePreview();
    }
}

export function updatePlayIcon() {
    const play = document.getElementById('icon-play');
    const pause = document.getElementById('icon-pause');
    if (!play || !pause) return;

    if (state.isPlaying) {
        play.classList.add('hidden');
        pause.classList.remove('hidden');
    } else {
        play.classList.remove('hidden');
        pause.classList.add('hidden');
    }
}

// Register global action
actions.refresh = () => {
    try {
        renderTimeline();
        renderHeaders();
        updatePreview();
        updatePlayIcon();
    } catch (e) { console.error('Render error', e); }
};

actions.toggleTrack = (trackName) => {
    const track = state.trackState[trackName];
    if (track) {
        track.collapsed = !track.collapsed;
        actions.refresh();
    }
};
