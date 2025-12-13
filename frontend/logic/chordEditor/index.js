import { initialState } from './state.js';
import { ChordEditorRenderer } from './renderer.js';
import { ChordEditorEvents } from './events.js';

export const ChordEditorLogic = {
    // Clone initial state to avoid mutation of the constant if we restart
    state: JSON.parse(JSON.stringify(initialState)),

    init() {
        this.render();
        ChordEditorEvents.attachListeners(this.state, () => this.render());
    },

    render() {
        ChordEditorRenderer.render(this.state, () => this.render());
    }
};
