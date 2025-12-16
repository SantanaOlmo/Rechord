import { state } from '../store.js';
import { formatMMSS } from '../utils.js';

export function drawGrid(duration) {
    const canvas = document.getElementById('grid-canvas');
    if (!canvas) return;

    if (!state.settings.grid) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    const ctx = canvas.getContext('2d');
    const content = document.getElementById('timeline-content');
    const tracksContainer = document.getElementById('tracks-container');

    canvas.width = content ? content.offsetWidth : 0;
    canvas.height = tracksContainer ? tracksContainer.offsetHeight : 600;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bpm = state.settings.tempo || 120;
    const subdivision = state.settings.subdivision || '1/4';

    const parts = subdivision.split('/');
    const numerator = parseInt(parts[0]) || 1;
    const denominator = parseInt(parts[1]) || 4;
    const subVal = numerator / denominator;

    const interval = (60 / bpm) * 4 * subVal;
    const totalSeconds = canvas.width / state.zoom;

    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 1;
    ctx.beginPath();

    const regions = Array.isArray(state.settings.beatMarker) ? state.settings.beatMarker : [];

    regions.forEach(region => {
        const startT = region.start;
        const endT = region.end || totalSeconds;
        for (let t = startT; t <= endT; t += interval) {
            const x = Math.round(t * state.zoom) + 0.5;
            if (x >= 0 && x <= canvas.width) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
            }
        }
    });

    ctx.stroke();
}

export function drawRuler(duration) {
    drawGrid(duration);

    const rulerContent = document.getElementById('ruler-content');
    if (!rulerContent) return;

    rulerContent.innerHTML = '';
    const content = document.getElementById('timeline-content');
    if (content) {
        rulerContent.style.width = `${content.offsetWidth}px`;
    }

    const fragment = document.createDocumentFragment();
    let step = 1;
    if (state.zoom < 20) step = 5;
    if (state.zoom < 5) step = 10;
    if (state.zoom < 1) step = 30;

    const totalWidth = rulerContent.offsetWidth || (duration * state.zoom);
    const totalSeconds = totalWidth / state.zoom;

    for (let t = 0; t < totalSeconds; t += step) {
        const x = t * state.zoom;

        const majorTick = document.createElement('div');
        majorTick.className = 'absolute bottom-0 border-l border-gray-500 h-4 pointer-events-none';
        majorTick.style.left = `${x}px`;
        fragment.appendChild(majorTick);

        const label = document.createElement('div');
        label.className = 'absolute bottom-0 text-[10px] text-gray-400 font-mono pointer-events-none select-none';
        label.style.left = `${x + 4}px`;
        label.textContent = formatMMSS(t);
        fragment.appendChild(label);

        if (state.zoom > 50) {
            const subStep = step / 4;
            for (let st = t + subStep; st < t + step; st += subStep) {
                const sx = st * state.zoom;
                if (sx < totalWidth) {
                    const minorTick = document.createElement('div');
                    minorTick.className = 'absolute bottom-0 border-l border-gray-600 h-2 pointer-events-none';
                    minorTick.style.left = `${sx}px`;
                    fragment.appendChild(minorTick);
                }
            }
        }
    }
    rulerContent.appendChild(fragment);
}
