import { state, actions } from '../store.js';
import { handleClipMouseDown } from './dragLogic.js';

export function attachTrackListeners() {
    const track = document.getElementById('track-verses');
    const audioTrack = document.getElementById('waveform-container');

    // --- LYRICS TRACK EVENTS ---
    if (track) {
        track.addEventListener('mousedown', (e) => {
            // Check if clicking a resize handle (highest priority)
            if (e.target.classList.contains('resize-handle') || e.target.closest('.resize-handle')) {
                const handleEl = e.target.classList.contains('resize-handle') ? e.target : e.target.closest('.resize-handle');
                const clipEl = handleEl.closest('[data-index]');
                if (clipEl) {
                    const index = parseInt(clipEl.dataset.index);
                    handleClipMouseDown(e, index);
                    return;
                }
            }

            // Check if clicking a clip (but not handle)
            const clipEl = e.target.closest('[data-index]');
            if (clipEl) {
                const index = parseInt(clipEl.dataset.index);
                handleClipMouseDown(e, index);
                return;
            }

            // If we are here, we clicked on the background track
            if (e.target === track) {
                state.isSelecting = true;
                state.selectionStart = { x: e.clientX, y: e.clientY };
                state.selectionCurrent = { x: e.clientX, y: e.clientY };
                if (!e.shiftKey) {
                    state.selectedIndices.clear();
                    // Clear beat marker selection if clicking away
                    if (state.selectedElement === 'beat-marker') {
                        state.selectedElement = null;
                    }
                    actions.refresh();
                }
            }
        });
    }

    // --- AUDIO TRACK / BEAT MARKER EVENTS ---
    if (audioTrack) {
        // Double Click to Create/Move Beat Marker
        audioTrack.addEventListener('dblclick', (e) => {
            if (state.trackState.audio.collapsed) return;
            const rect = audioTrack.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const time = clickX / state.zoom;

            // Set marker
            state.song.beat_marker = time;
            state.selectedElement = 'beat-marker'; // Select it immediately
            actions.refresh();
        });

        // Click to Select Beat Marker
        audioTrack.addEventListener('mousedown', (e) => {
            if (e.target.dataset.type === 'beat-marker' || e.target.classList.contains('beat-marker')) {
                state.selectedElement = 'beat-marker';
                // Deselect verses
                state.selectedIndices.clear();
                actions.refresh();
                e.stopPropagation(); // prevent drag start logic of parent if any
            }
        });
    }
}
