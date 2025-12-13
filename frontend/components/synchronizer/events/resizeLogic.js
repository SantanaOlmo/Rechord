import { state } from '../store.js';
import { getSnapTime } from './snapUtils.js';

export function handleResize(deltaSec) {
    // If the dragged verse is part of a selection, we resize ALL selected verses
    // If not, we only resize that single verse
    const verseIndex = state.dragVerseIndex;
    const targets = state.selectedIndices.has(verseIndex)
        ? Array.from(state.selectedIndices)
        : [verseIndex];

    let allowedDelta = deltaSec;

    // Snapping Logic
    // Apply snap based on the verse being dragged (the "leader")
    if (state.settings.snapping) {
        const leaderInitial = state.initialSnapshot[verseIndex];
        if (state.dragTarget === 'right') {
            const proposedEnd = leaderInitial.tiempo_fin + deltaSec;
            const snappedEnd = getSnapTime(proposedEnd, 15);
            if (snappedEnd !== null) {
                allowedDelta = snappedEnd - leaderInitial.tiempo_fin;
            }
        } else if (state.dragTarget === 'left') {
            const proposedStart = leaderInitial.tiempo_inicio + deltaSec;
            const snappedStart = getSnapTime(proposedStart, 15);
            if (snappedStart !== null) {
                allowedDelta = snappedStart - leaderInitial.tiempo_inicio;
            }
        }
    }

    // Apply the calculated delta
    if (state.dragTarget === 'right') {
        targets.forEach(idx => {
            const verse = state.estrofas[idx];
            const initial = state.initialSnapshot[idx];

            let newEnd = initial.tiempo_fin + allowedDelta;
            if (newEnd < initial.tiempo_inicio + 0.5) newEnd = initial.tiempo_inicio + 0.5;

            // Next clip constraint
            const nextVerse = state.estrofas[idx + 1];
            if (nextVerse && !state.selectedIndices.has(idx + 1) && newEnd > nextVerse.tiempo_inicio) {
                newEnd = nextVerse.tiempo_inicio;
            }
            verse.tiempo_fin = newEnd;
        });
    }
    else if (state.dragTarget === 'left') {
        targets.forEach(idx => {
            const verse = state.estrofas[idx];
            const initial = state.initialSnapshot[idx];

            let newStart = initial.tiempo_inicio + allowedDelta;
            if (newStart > initial.tiempo_fin - 0.5) newStart = initial.tiempo_fin - 0.5;
            if (newStart < 0) newStart = 0;

            const prevVerse = state.estrofas[idx - 1];
            if (prevVerse && !state.selectedIndices.has(idx - 1) && newStart < prevVerse.tiempo_fin) {
                newStart = prevVerse.tiempo_fin;
            }
            verse.tiempo_inicio = newStart;
        });
    }
}
