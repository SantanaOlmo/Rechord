import { state } from '../store.js';
import { getSnapTime } from './snapUtils.js';

export function handleMove(deltaSec) {
    const selectedIndices = Array.from(state.selectedIndices).sort((a, b) => a - b);
    if (selectedIndices.length === 0) return;

    let allowedDelta = deltaSec;

    // Snapping Logic
    // We snap based on the "leader" (the verse we started dragging) or the first selected if unknown
    const leaderIndex = state.dragVerseIndex !== -1 ? state.dragVerseIndex : selectedIndices[0];

    // Helper to check if a specific index is part of the selection
    if (state.selectedIndices.has(leaderIndex)) {
        const leaderInitial = state.initialSnapshot[leaderIndex];
        const proposedTime = leaderInitial.tiempo_inicio + deltaSec;

        const snappedTime = getSnapTime(proposedTime, 15); // 15px threshold
        if (snappedTime !== null) {
            // Adjust delta to match snap
            allowedDelta = snappedTime - leaderInitial.tiempo_inicio;
        }
    }

    // 1. Calculate Allowable Delta for the WHOLE GROUP
    // Check LEFT constraints for all selected
    if (deltaSec < 0) {
        for (let i of selectedIndices) {
            const initial = state.initialSnapshot[i];

            // Constraint: Previous Clip (if not selected)
            let minLimit = 0;
            if (i > 0 && !state.selectedIndices.has(i - 1)) {
                minLimit = state.initialSnapshot[i - 1].tiempo_fin;
            }

            const maxMove = minLimit - initial.tiempo_inicio; // Negative value
            if (allowedDelta < maxMove) allowedDelta = maxMove; // maxMove is closer to 0 (e.g. -2 vs -5)
        }
    }
    // Check RIGHT constraints for all selected
    else {
        for (let i of selectedIndices) {
            const initial = state.initialSnapshot[i];

            // Constraint: Next Clip (if not selected)
            let maxLimit = Infinity;
            if (i < state.estrofas.length - 1 && !state.selectedIndices.has(i + 1)) {
                maxLimit = state.initialSnapshot[i + 1].tiempo_inicio;
            }

            const maxMove = maxLimit - initial.tiempo_fin;
            if (allowedDelta > maxMove) allowedDelta = maxMove;
        }
    }

    // 2. Apply Delta
    selectedIndices.forEach(i => {
        const initial = state.initialSnapshot[i];
        state.estrofas[i].tiempo_inicio = initial.tiempo_inicio + allowedDelta;
        state.estrofas[i].tiempo_fin = initial.tiempo_fin + allowedDelta;
    });
}
