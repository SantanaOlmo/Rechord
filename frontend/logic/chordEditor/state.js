export const initialState = {
    chordName: 'Cm/ Do menor',
    startFret: 3, // The fret number displayed at the top of the selector
    fingers: {}, // Map "string-fret" -> true/false. E.g. "6-3": true
    barre: null // Object { from: 1, to: 6 } or null
};
