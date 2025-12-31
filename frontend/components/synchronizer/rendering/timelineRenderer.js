import { state } from '../store.js';
import { audioService } from '../../../services/audioService.js';
import { renderVerses, renderSections } from './clipRenderer.js';
import { drawRuler } from './rulerRenderer.js';

function renderBeatMarker() {
    const container = document.getElementById('waveform-container');
    if (!container) return;
    container.querySelectorAll('.beat-marker').forEach(el => el.remove());

    const markers = Array.isArray(state.settings.beatMarker) ? state.settings.beatMarker : [];
    const colors = ['bg-cyan-400', 'bg-green-400', 'bg-pink-400', 'bg-yellow-400', 'bg-purple-400', 'bg-red-400'];

    markers.forEach((region, index) => {
        const colorClass = colors[index % colors.length];
        const isSelected = index === state.settings.selectedRegionIndex;
        const createMarker = (time, type) => {
            const px = time * state.zoom;
            const marker = document.createElement('div');
            marker.className = `beat-marker absolute w-3 h-3 border border-white shadow-sm transform -translate-x-1/2 rotate-45 z-20 cursor-pointer hover:scale-125 transition-transform ${colorClass}`;
            marker.style.top = '40%';
            marker.style.left = `${px}px`;
            marker.dataset.type = 'region-marker';
            marker.dataset.regionIndex = index;
            marker.dataset.markerType = type;

            if (isSelected && state.settings.selectedMarkerType === type) {
                marker.classList.add('ring-2', 'ring-yellow-400', 'ring-offset-1', 'ring-offset-gray-800');
                marker.style.zIndex = '30';
            }
            container.appendChild(marker);
        };
        createMarker(region.start, 'start');
        if (region.end && region.end < (state.song.duracion || 180)) {
            createMarker(region.end, 'end');
        }
    });
}

function renderSelectionBox() {
    const activeTrackEl = document.getElementById(`track-${state.activeTrack}`);
    if (activeTrackEl) {
        // Remove existing
        const existing = activeTrackEl.querySelector('.selection-box-overlay');
        if (existing) existing.remove();

        if (state.isSelecting) {
            const box = document.createElement('div');
            box.className = 'selection-box-overlay absolute bg-blue-500/20 border border-blue-400 z-50 pointer-events-none transition-none'; // Added class and transition-none
            const trackRect = activeTrackEl.getBoundingClientRect();
            const x1 = Math.min(state.selectionStart.x, state.selectionCurrent.x) - trackRect.left;
            const y1 = Math.min(state.selectionStart.y, state.selectionCurrent.y) - trackRect.top;
            const width = Math.abs(state.selectionCurrent.x - state.selectionStart.x);
            const height = Math.abs(state.selectionCurrent.y - state.selectionStart.y);

            box.style.left = `${x1}px`;
            box.style.top = `${y1}px`;
            box.style.width = `${width}px`;
            box.style.height = `${height}px`;
            activeTrackEl.appendChild(box);
        }
    }
}

export function renderTimeline() {
    const content = document.getElementById('timeline-content');
    const tracksContainer = document.getElementById('tracks-container');
    const audio = audioService.getInstance();
    const duration = state.song?.duracion || audio.duration || 180;

    if (tracksContainer) {
        let gridCanvas = document.getElementById('grid-canvas');
        if (!gridCanvas) {
            gridCanvas = document.createElement('canvas');
            gridCanvas.id = 'grid-canvas';
            gridCanvas.className = 'absolute top-0 left-0 h-full w-full pointer-events-none z-10 opacity-70 mix-blend-overlay';
            tracksContainer.appendChild(gridCanvas);
        }

        let existingTracks = Array.from(tracksContainer.children).filter(el => el.id !== 'grid-canvas');
        const trackMap = new Map(existingTracks.map(el => [el.id, el]));

        state.trackOrder.forEach((key, index) => {
            const t = state.trackState[key];
            if (!t) return;
            const trackId = `track-${key}`;
            let trackDiv = trackMap.get(trackId);

            if (!trackDiv) {
                trackDiv = document.createElement('div');
                trackDiv.id = trackId;
                trackDiv.className = `bg-gray-700 border-b border-gray-600 relative group transition-all duration-200`;

                if (key === 'lyrics') {
                    trackDiv.className = 'bg-gray-700/90 border-b border-gray-600 relative group transition-all duration-200';
                    trackDiv.innerHTML = `<div id="track-verses" class="w-full h-full relative overflow-hidden"></div>`;
                } else if (key === 'audio') {
                    trackDiv.innerHTML = `<div id="waveform-container" class="absolute inset-0 overflow-hidden relative"></div>`;
                } else if (key === 'chords') {
                    trackDiv.innerHTML = `<div id="track-sections" class="w-full h-full relative overflow-hidden"></div>`;
                } else {
                    trackDiv.innerHTML = `<div class="absolute inset-0 flex items-center justify-center text-gray-700 text-sm select-none font-medium overflow-hidden">${t.label} Track</div>`;
                }
                tracksContainer.appendChild(trackDiv);
            }
            tracksContainer.appendChild(trackDiv);
            trackDiv.classList.add('overflow-hidden');
            if (key === 'audio') {
                trackDiv.style.height = '48px';
            } else {
                trackDiv.style.height = t.collapsed ? '32px' : '96px';
            }
        });

        renderBeatMarker();
        existingTracks.forEach(el => {
            const key = el.id.replace('track-', '');
            if (!state.trackOrder.includes(key) && el.id !== 'grid-canvas') el.remove();
        });
    }

    const trackArea = document.getElementById('timeline-scroll-area');
    if (trackArea) {
        state.minZoom = trackArea.clientWidth / duration;
        if (state.zoom < state.minZoom) state.zoom = state.minZoom;
    }

    const totalWidth = duration * state.zoom;
    const containerWidth = trackArea ? trackArea.clientWidth : 0;
    if (content) content.style.width = `${Math.max(totalWidth, containerWidth)}px`;

    drawRuler(duration);
    renderSelectionBox();
    renderVerses();
    renderSections();
}
