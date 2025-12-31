import { ChordManager } from './sidebar/ChordManager.js';
import { VersesManager } from './sidebar/VersesManager.js';
import { ViewManager } from './sidebar/ViewManager.js';
import { SettingsLogic } from './SettingsLogic.js';

/**
 * Handles the Split/Merge logic for the Sidebar Verse Editor
 */

export const EditorSidebarLogic = {
    init: () => {
        ChordManager.init();
        VersesManager.init();
        ViewManager.init();
        SettingsLogic.init();
    },
    restoreLyricsView: () => {
        ViewManager.restoreLyricsView();
    }
};
