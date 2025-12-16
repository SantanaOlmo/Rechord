import { state } from '../store.js';
import { getSnapTime } from './snapUtils.js';


// Helper to abstract property differences (Estrofa: tiempo_inicio/fin, Section: start/end)
function getBounds(item, type) {
    if (type === 'section') return { start: item.start, end: item.end };
    return { start: item.tiempo_inicio, end: item.tiempo_fin };
}
function setBounds(item, start, end, type) {
    if (type === 'section') {
        item.start = start;
        item.end = end;
    } else {
        item.tiempo_inicio = start;
        item.tiempo_fin = end;
    }
}

export function handleResize(deltaSec) {
    // Context Awareness
    const type = state.selectionType;
    const dataSource = type === 'section' ? state.settings.songSections : state.estrofas;

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
        const { start, end } = getBounds(leaderInitial, type);

        if (state.dragTarget === 'right') {
            const proposedEnd = end + deltaSec;
            const snappedEnd = getSnapTime(proposedEnd, 15);
            if (snappedEnd !== null) {
                allowedDelta = snappedEnd - end;
            }
        } else if (state.dragTarget === 'left') {
            const proposedStart = start + deltaSec;
            const snappedStart = getSnapTime(proposedStart, 15);
            if (snappedStart !== null) {
                allowedDelta = snappedStart - start;
            }
        }
    }

    // Apply the calculated delta
    if (state.dragTarget === 'right') {
        targets.forEach(idx => {
            const item = dataSource[idx];
            const initial = state.initialSnapshot[idx];
            const { start, end } = getBounds(initial, type);

            let newEnd = end + allowedDelta;
            if (newEnd < start + 0.5) newEnd = start + 0.5;

            // Next clip constraint
            const nextItem = dataSource[idx + 1]; // Use live data as source of truth for existence? Or snapshot?
            // Drag logic uses snapshot for calculating moves usually, but here 'dataSource' is LIVE array reference, 
            // but we need to check if adjacent item is selected.
            // Safe to check `state.initialSnapshot` for constraint values if we assume no topology change during drag.
            // `moveLogic` used `state.initialSnapshot`. Let's stick to that for consistence.
            const nextInitial = state.initialSnapshot[idx + 1];

            if (nextInitial && !state.selectedIndices.has(idx + 1)) {
                const nextStart = getBounds(nextInitial, type).start;
                if (newEnd > nextStart) newEnd = nextStart;
            }

            // Set end, keep start
            setBounds(item, start, newEnd, type); // Start didn't change, pass initial start
        });
    }
    else if (state.dragTarget === 'left') {
        targets.forEach(idx => {
            const item = dataSource[idx];
            const initial = state.initialSnapshot[idx];
            const { start, end } = getBounds(initial, type);

            let newStart = start + allowedDelta;
            if (newStart > end - 0.5) newStart = end - 0.5;
            if (newStart < 0) newStart = 0;

            const prevInitial = state.initialSnapshot[idx - 1];
            if (prevInitial && !state.selectedIndices.has(idx - 1)) {
                const prevEnd = getBounds(prevInitial, type).end;
                if (newStart < prevEnd) newStart = prevEnd;
            }

            // Set start, keep end
            setBounds(item, newStart, end, type);
        });
    }
}
