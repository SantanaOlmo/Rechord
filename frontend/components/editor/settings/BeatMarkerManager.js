import { state } from '../../synchronizer/store.js';
import { showErrorToast } from '../../synchronizer/utils.js';
import { renderTimeline } from '../../synchronizer/rendering.js';

export const BeatMarkerManager = {
    addMarkerAtTime: (time) => {
        const markers = state.settings.beatMarker || [];
        const songDur = state.song.duracion || 180;

        // Check if inside any region
        const currentRegionIndex = markers.findIndex(m => time >= m.start && time <= (m.end || Infinity));

        if (currentRegionIndex !== -1) {
            showErrorToast('Ya existe una sección activa en este punto.');
            return false;
        }

        // Default duration 2s
        const duration = 2.0;
        let newEnd = time + duration;

        // Prevent overlap with Next Marker
        const nextMarker = markers.find(m => m.start > time);
        if (nextMarker && newEnd > nextMarker.start) {
            newEnd = nextMarker.start;
        }

        // Clamp to song duration
        if (newEnd > songDur) newEnd = songDur;

        // Create if valid
        if (newEnd > time) {
            markers.push({ start: time, end: newEnd });
            markers.sort((a, b) => a.start - b.start);
            state.settings.beatMarker = [...markers];
            renderTimeline();
            return true;
        }
        return false;
    },

    deleteMarker: (index) => {
        const markers = state.settings.beatMarker || [];
        if (index >= 0 && index < markers.length) {
            markers.splice(index, 1);
            state.settings.beatMarker = [...markers];

            // Adjust selection
            if (state.settings.selectedRegionIndex === index) {
                state.settings.selectedRegionIndex = -1;
            } else if (state.settings.selectedRegionIndex > index) {
                state.settings.selectedRegionIndex--;
            }

            renderTimeline();
            return true;
        }
        return false;
    },

    updateMarker: (index, newStart, newEnd) => {
        const markers = state.settings.beatMarker || [];
        const songDur = state.song.duracion || 180;

        const valid = validateRegion(markers, index, newStart, newEnd, songDur);
        if (valid) {
            markers[index].start = valid.start;
            markers[index].end = valid.end;
            state.settings.beatMarker = [...markers];
            renderTimeline();
            return valid;
        }
        return false;
    },

    // Explicit selection helper
    selectMarker: (index) => {
        state.settings.selectedRegionIndex = index;
        renderTimeline();
    }
};

function validateRegion(regions, index, newStart, newEnd, songDuration) {
    if (newStart < 0) newStart = 0;
    if (newEnd > songDuration) newEnd = songDuration;
    if (newStart >= newEnd) return false;

    // Check collision
    for (let i = 0; i < regions.length; i++) {
        if (i === index) continue;
        const r = regions[i];
        const rEnd = r.end || songDuration;

        // Overlap logic
        if (newStart < rEnd && newEnd > r.start) {
            return false;
        }
    }
    return { start: newStart, end: newEnd };
}
