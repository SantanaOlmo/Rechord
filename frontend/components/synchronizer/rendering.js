import { state, actions } from './store.js';
import { renderTimeline } from './rendering/timelineRenderer.js';
import { renderHeaders } from './rendering/headerRenderer.js';
import { updatePreview, updatePlayIcon, updateActiveVerse, ensurePlayheadVisible } from './rendering/uiRenderer.js';

// Export everything for consumers
export { renderTimeline, renderHeaders, updatePreview, updatePlayIcon, updateActiveVerse, ensurePlayheadVisible };

// Register global actions (Side effects)
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
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
