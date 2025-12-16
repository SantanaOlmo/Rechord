import { state } from '../../synchronizer/store.js';
import { showErrorToast } from '../../synchronizer/utils.js';
import { renderTimeline } from '../../synchronizer/rendering.js';

export const SongSectionManager = {
    addSectionAtTime: (time) => {
        const sections = state.settings.songSections || [];
        const songDur = state.song.duracion || 180;

        // Check if inside any region
        const currentRegionIndex = sections.findIndex(s => time >= s.start && time <= (s.end || Infinity));

        if (currentRegionIndex !== -1) {
            showErrorToast('Ya existe una sección activa en este punto.');
            return false;
        }

        // Default duration 8s (typical measure/phrase)
        const duration = 8.0;
        let newEnd = time + duration;

        // Prevent overlap with Next Section
        const nextSection = sections.find(s => s.start > time);
        if (nextSection && newEnd > nextSection.start) {
            newEnd = nextSection.start;
        }

        // Clamp to song duration
        if (newEnd > songDur) newEnd = songDur;

        // Create if valid
        if (newEnd > time) {
            sections.push({ 
                start: time, 
                end: newEnd, 
                label: 'Section ' + (sections.length + 1),
                chords: [] // Initialize empty chords array
            });
            sections.sort((a, b) => a.start - b.start);
            state.settings.songSections = [...sections];
            renderTimeline();
            return true;
        }
        return false;
    },

    deleteSection: (index) => {
        const sections = state.settings.songSections || [];
        if (index >= 0 && index < sections.length) {
            sections.splice(index, 1);
            state.settings.songSections = [...sections];

            // Adjust selection
            if (state.settings.selectedSectionIndex === index) {
                state.settings.selectedSectionIndex = -1;
            } else if (state.settings.selectedSectionIndex > index) {
                state.settings.selectedSectionIndex--;
            }

            renderTimeline();
            return true;
        }
        return false;
    },

    updateSection: (index, newStart, newEnd) => {
        const sections = state.settings.songSections || [];
        const songDur = state.song.duracion || 180;

        const valid = validateRegion(sections, index, newStart, newEnd, songDur);
        if (valid) {
            sections[index].start = valid.start;
            sections[index].end = valid.end;
            state.settings.songSections = [...sections];
            renderTimeline();
            return valid;
        }
        return false;
    },

    // Explicit selection helper
    selectSection: (index) => {
        state.settings.selectedSectionIndex = index;
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
