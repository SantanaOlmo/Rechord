import { state, actions } from '../store.js';
import { formatMMSS } from '../utils.js';
import { MetronomeLogic } from '../MetronomeLogic.js';

export function updatePreview() {
    const previewText = document.getElementById('preview-text');
    const previewTime = document.getElementById('preview-time');

    if (!previewText) return;

    if (state.selectedIndices.size > 0) {
        if (state.selectedIndices.size === 1) {
            const index = state.selectedIndices.values().next().value;
            // Determined by selectionType?
            // If selectionType is section, we might want to show section info??
            // Currently logic assumes VERSES for preview info text.
            // If dragging sections, we might want to update this?
            // Existing code assumed Verses. Safe to keep verses for now, or adapt later.
            // But if I selected a SECTION, accessing state.estrofas[index] might be valid index but WRONG data.

            if (state.selectionType === 'section') {
                const s = state.settings.songSections[index];
                if (s) {
                    previewText.textContent = s.label || `Sección ${index + 1}`;
                    document.getElementById('preview-start').textContent = formatMMSS(s.start);
                    document.getElementById('preview-end').textContent = formatMMSS(s.end);
                    previewTime.classList.remove('opacity-0');
                }
            } else {
                const v = state.estrofas[index];
                if (v) {
                    previewText.textContent = v.contenido;
                    document.getElementById('preview-start').textContent = formatMMSS(v.tiempo_inicio);
                    document.getElementById('preview-end').textContent = formatMMSS(v.tiempo_fin);
                    previewTime.classList.remove('opacity-0');
                }
            }
        } else {
            previewText.textContent = `${state.selectedIndices.size} items seleccionados`;
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
    // Calculate grid settings for Metronome
    const bpm = state.settings.tempo || 120;
    const subdivision = state.settings.subdivision || '1/4';
    const parts = subdivision.split('/');
    const subVal = (parseInt(parts[0]) || 1) / (parseInt(parts[1]) || 4);
    const interval = (60 / bpm) * 4 * subVal;

    // Check if in valid region
    const regions = Array.isArray(state.settings.beatMarker) ? state.settings.beatMarker : [];
    const activeRegion = regions.find(r => currentTime >= r.start && currentTime <= (r.end || Infinity));

    if (activeRegion) {
        MetronomeLogic.checkMetronome(currentTime, interval, activeRegion.start);
    }

    const previewText = document.getElementById('preview-text');
    const previewTime = document.getElementById('preview-time');
    if (!previewText) return;

    const activeVerse = state.estrofas.find(v => currentTime >= v.tiempo_inicio && currentTime <= v.tiempo_fin);

    if (state.isPlaying) {
        if (activeVerse) {
            previewText.textContent = activeVerse.contenido;
            document.getElementById('preview-start').textContent = formatMMSS(activeVerse.tiempo_inicio);
            document.getElementById('preview-end').textContent = formatMMSS(activeVerse.tiempo_fin);
            previewTime.classList.remove('opacity-0');
            previewText.className = 'text-3xl md:text-4xl font-bold text-green-400 mb-4 transition-all duration-200';
        } else {
            // Playing but silence/gap -> Show nothing or placeholder
            previewText.textContent = "...";
            previewText.className = 'text-3xl md:text-4xl font-bold text-gray-700 mb-4 transition-all duration-200';
            previewTime.classList.add('opacity-0');
        }
    } else {
        // Not playing -> Show selection
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

export function ensurePlayheadVisible(currentTime) {
    const scrollArea = document.getElementById('timeline-scroll-area');
    if (!scrollArea) return;

    const px = currentTime * state.zoom;
    const containerWidth = scrollArea.clientWidth;
    const scrollLeft = scrollArea.scrollLeft;

    // Right Edge Check
    if (px > scrollLeft + containerWidth) {
        scrollArea.scrollLeft = px - 20;
    }
    // Left Edge Check
    else if (px < scrollLeft) {
        scrollArea.scrollLeft = Math.max(0, px - 20);
    }
}
