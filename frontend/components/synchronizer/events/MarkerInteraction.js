import { state, actions } from '../store.js';
import { audioService } from '../../../services/audioService.js';
import { renderTimeline, ensurePlayheadVisible } from '../rendering.js';
import { SettingsUI } from '../../editor/settings/SettingsUI.js';
import { BeatMarkerManager } from '../../editor/settings/BeatMarkerManager.js';

export const MarkerInteraction = {
    handleMouseDown: (e) => {
        const target = e.target;
        if (!target.classList.contains('beat-marker')) return false;

        e.preventDefault();
        e.stopPropagation();

        const index = parseInt(target.dataset.regionIndex);
        const type = target.dataset.markerType; // 'start' or 'end'

        // Select Interaction
        state.settings.selectedRegionIndex = index;
        state.settings.selectedMarkerType = type;

        // Clear lyric selection to remove ambiguity
        state.selectedIndices.clear();

        renderTimeline();
        SettingsUI.renderSectionsList(); // Update UI highlight

        // Init Drag
        const startX = e.clientX;
        const initialTime = type === 'start' ? state.settings.beatMarker[index].start : (state.settings.beatMarker[index].end || 180);

        const onMouseMove = (moveEvent) => {
            const currentX = moveEvent.clientX;
            const diffPx = currentX - startX;
            const diffTime = diffPx / state.zoom;

            let newTime = initialTime + diffTime;

            // Update via Manager (handles validation)
            // We need to pass both start/end to updateMarker, so we get current values
            const region = state.settings.beatMarker[index];
            let s = region.start;
            let end = region.end || 180;

            if (type === 'start') s = newTime;
            else end = newTime;

            const valid = BeatMarkerManager.updateMarker(index, s, end);
            // If valid, it updated state. We just re-render is handled by Manager usually? 
            // Manager does renderTimeline.
            // But dragging might be high frequency.
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        return true; // Handled
    }
};
