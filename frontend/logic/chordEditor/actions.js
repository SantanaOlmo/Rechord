export const ChordEditorActions = {
    countActive(state) {
        const fingerCount = Object.keys(state.fingers).length;
        const barreCount = state.barre ? 1 : 0;
        return fingerCount + barreCount;
    },

    toggleFinger(state, string, fret, renderCallback) {
        // Rule: If click on fret 1 AND Barre is active
        if (fret === 1 && state.barre) {
            let { from, to } = state.barre;

            if (string < from) {
                // Extend Left
                from = string;
            } else if (string > to) {
                // Extend Right
                to = string;
            } else if (string === from) {
                // Shrink from Left
                from++;
            } else if (string === to) {
                // Shrink from Right
                to--;
            } else {
                // Click in Middle - Smart Shrink from nearest edge
                const distToFrom = string - from;
                const distToTo = to - string;

                if (distToFrom < distToTo) {
                    // Closer to start -> Remove start -> Keep Right side
                    from = string + 1;
                } else {
                    // Closer to end (or equal) -> Remove end -> Keep Left side
                    to = string - 1;
                }
            }

            // Cleanup invalid barre
            if (from > to) {
                state.barre = null;
            } else {
                state.barre = { from, to };

                // Remove individual fingers that are now covered by the barre
                for (let s = from; s <= to; s++) {
                    delete state.fingers[`${s}-1`];
                }
            }
        }
        else {
            // Standard Toggle Logic (No Barre handling or Fret != 1)
            const key = `${string}-${fret}`;
            if (state.fingers[key]) {
                delete state.fingers[key];
            } else {
                // Check Limit Max 5
                if (this.countActive(state) >= 5) return;

                // Remove other fingers on same string
                for (let f = 1; f <= 5; f++) {
                    delete state.fingers[`${string}-${f}`];
                }
                state.fingers[key] = true;
            }

            // Rule: Auto-Detect Barre (4+ consecutive fingers on Fret 1)
            if (fret === 1) {
                this.checkAutoBarre(state);
            }
        }

        if (renderCallback) renderCallback();
    },

    checkAutoBarre(state) {
        let maxSeq = 0;
        let currentSeq = 0;
        let startOfCurrentSeq = -1;

        let bestStart = -1;
        let bestEnd = -1;

        for (let s = 1; s <= 6; s++) {
            if (state.fingers[`${s}-1`]) {
                if (currentSeq === 0) startOfCurrentSeq = s;
                currentSeq++;
            } else {
                if (currentSeq >= 4) {
                    if (currentSeq > maxSeq) {
                        maxSeq = currentSeq;
                        bestStart = startOfCurrentSeq;
                        bestEnd = s - 1;
                    }
                }
                currentSeq = 0;
                startOfCurrentSeq = -1;
            }
        }
        if (currentSeq >= 4) {
            if (currentSeq > maxSeq) {
                maxSeq = currentSeq;
                bestStart = startOfCurrentSeq;
                bestEnd = 6;
            }
        }

        if (bestStart !== -1) {
            state.barre = { from: bestStart, to: bestEnd };
            for (let s = bestStart; s <= bestEnd; s++) {
                delete state.fingers[`${s}-1`];
            }
        }
    },

    toggleBarre(state, renderCallback) {
        if (state.barre) {
            state.barre = null;
        } else {
            // Check Limit Max 5
            // Net addition = 1 (barre) - fingersOnFret1
            let fingersOnFret1 = 0;
            for (let s = 1; s <= 6; s++) {
                if (state.fingers[`${s}-1`]) fingersOnFret1++;
            }

            const currentActive = this.countActive(state);
            const newTotal = currentActive - fingersOnFret1 + 1;

            if (newTotal > 5) return;

            state.barre = { from: 1, to: 6 };
            for (let s = 1; s <= 6; s++) {
                delete state.fingers[`${s}-1`];
            }
        }
        if (renderCallback) renderCallback();
    },

    setStartFret(state, val, renderCallback) {
        state.startFret = val;
        if (renderCallback) renderCallback();
    },

    setChordName(state, name, renderCallback) {
        state.chordName = name;
        if (renderCallback) renderCallback();
    }
};
