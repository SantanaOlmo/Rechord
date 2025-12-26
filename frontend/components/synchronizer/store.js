export let state = {
    song: null,
    estrofas: [],
    selectedIndices: new Set(),

    // New Selection Context
    activeTrack: 'lyrics', // 'lyrics', 'chords', etc.
    selectionType: 'verse', // 'verse', 'section'

    // History for Undo/Redo
    history: [],
    historyIndex: -1,
    chords: [], // List of stored chords
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
    zoom: 50,
    minZoom: 10,
    // Dragging State
    isDragging: false,
    dragTarget: null,
    dragVerseIndex: -1,
    dragStartX: 0,
    editFocus: 'start', // 'start' or 'end'
    isXDown: false,
    // Keyboard modifiers state
    isZDown: false, // Move Clip
    isXDown: false, // Resize Start
    isCDown: false, // Resize End
    isJDown: false, // Join
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
    initialSnapshot: [],

    // Ruler Drag State
    isDraggingRuler: false,
    initialScrollLeft: 0,

    isPlaying: false,

    // Selection Box State
    isSelecting: false,
    selectionStart: { x: 0, y: 0 },
    selectionCurrent: { x: 0, y: 0 },
    selectionAnchor: null, // Index where selection started
    selectionHead: null,   // Index where selection is currently extended to

    // Track State (Minimization)
    trackOrder: ['audio', 'lyrics', 'strumming', 'chords', 'tabs'],
    trackState: {
        audio: { collapsed: false, height: 96, label: 'Audio Waveform', color: 'text-blue-400' },
        lyrics: { collapsed: false, height: 96, label: 'Lyrics', color: 'text-indigo-400' },
        strumming: { collapsed: false, height: 96, label: 'Strumming Patterns', color: 'text-yellow-400' },
        chords: { collapsed: false, height: 96, label: 'Chords', color: 'text-green-400' },
        tabs: { collapsed: false, height: 96, label: 'Tabs', color: 'text-teal-400' }
    },
    // Global Settings
    settings: {
        tempo: 120,
        timeSignature: { num: 4, den: 4 },
        timeSignature: { num: 4, den: 4 },
        beatMarker: [], // Array of {start, end} regions
        songSections: [], // Array of {start, end, label} regions
        selectedRegionIndex: -1, // Track selected grid region (Beat)
        selectedSectionIndex: -1, // Track selected section region
        activeViewMode: 'beat', // 'beat' or 'sections'
        selectedMarkerType: null, // 'start' or 'end'
        snapping: false,
        snapping: false,
        grid: true,
        subdivision: '1/4',
        velocity: 100
    },
    metronome: {
        active: false,
        lastGridIndex: -1
    },
    // Undo/Redo
    history: {
        stack: [],
        future: []
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
    }
};

// Global actions registry to avoid circular dependency
export const actions = {
    refresh: () => console.warn('Refresh not linked'),
    toggleTrack: () => console.warn('Toggle not linked'),
    moveTrack: (fromIndex, toIndex) => console.warn('Move not linked')
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
};
