import { state, actions } from '../store.js';
import { handleClipMouseDown } from './dragLogic.js';

export function attachTrackListeners() {
    const versesTrack = document.getElementById('track-verses');
    const sectionsTrack = document.getElementById('track-sections');
    const audioTrack = document.getElementById('waveform-container');

    // Helper for Track Events
    const bindTrackEvents = (trackEl, itemType) => {
        if (!trackEl) return;
        trackEl.addEventListener('mousedown', (e) => {
            // Update Active Track Context
            if (itemType === 'section') state.activeTrack = 'chords';
            else state.activeTrack = 'lyrics';

            // Check if clicking a resize handle (highest priority)
            if (e.target.classList.contains('resize-handle') || e.target.closest('.resize-handle')) {
                const handleEl = e.target.classList.contains('resize-handle') ? e.target : e.target.closest('.resize-handle');
                const clipEl = handleEl.closest('[data-index]');
                if (clipEl) {
                    const index = parseInt(clipEl.dataset.index);
                    handleClipMouseDown(e, index, itemType);
                    return;
                }
            }

            // Check if clicking a clip (but not handle)
            const clipEl = e.target.closest('[data-index]');
            if (clipEl) {
                const index = parseInt(clipEl.dataset.index);
                handleClipMouseDown(e, index, itemType);
                return;
            }

            // If we are here, we clicked on the background track
            if (e.target === trackEl) {
                state.isSelecting = true;
                state.selectionType = itemType; // Set selection context
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
    };

    // Bind Lyrics Track
    bindTrackEvents(versesTrack, 'verse');
    // Bind Sections Track
    bindTrackEvents(sectionsTrack, 'section');

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
