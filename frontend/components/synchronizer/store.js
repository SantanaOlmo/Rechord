export let state = {
    song: null,
    estrofas: [],
    selectedIndices: new Set(),
    zoom: 50,
    minZoom: 10,
    // Dragging State
    isDragging: false,
    dragTarget: null,
    dragVerseIndex: -1,
    dragStartX: 0,
    initialSnapshot: [],

    // Ruler Drag State
    isDraggingRuler: false,
    initialScrollLeft: 0,

    isPlaying: false,

    // Selection Box State
    isSelecting: false,
    selectionStart: { x: 0, y: 0 },
    selectionCurrent: { x: 0, y: 0 },

    // Track State (Minimization)
    trackState: {
        lyrics: { collapsed: false, height: 96, label: 'Lyrics', color: 'text-indigo-400' },
        strumming: { collapsed: false, height: 96, label: 'Strumming Patterns', color: 'text-yellow-400' },
        chords: { collapsed: false, height: 96, label: 'Chords', color: 'text-green-400' }
    }
};

// Global actions registry to avoid circular dependency
export const actions = {
    refresh: () => console.warn('Refresh not linked'),
    toggleTrack: () => console.warn('Toggle not linked')
};
