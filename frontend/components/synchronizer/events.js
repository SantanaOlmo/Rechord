import { attachKeyboardListeners } from './events/keyboardEvents.js';
import { attachTrackListeners } from './events/trackEvents.js';
import { attachTimelineListeners } from './events/timelineEvents.js';
import { attachUIListeners } from './events/uiEvents.js';

import { handleGlobalMouseMove, handleGlobalMouseUp, handleClipMouseDown } from './events/dragLogic.js';
import { togglePlay } from './events/playbackLogic.js';

// Re-export for potential consumers (though usually attached directly)
export { handleGlobalMouseMove, handleGlobalMouseUp, handleClipMouseDown, togglePlay };


export function attachListeners() {
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    attachTrackListeners();
    attachTimelineListeners();
    attachKeyboardListeners();
    attachUIListeners();

}
