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

export function handleMove(deltaSec) {
    const selectedIndices = Array.from(state.selectedIndices).sort((a, b) => a - b);
    if (selectedIndices.length === 0) return;

    // Context Awareness
    const type = state.selectionType;
    const dataSource = type === 'section' ? state.settings.songSections : state.estrofas;

    // Use initial snapshot which corresponds to the dataSource
    // (dragLogic already ensures initialSnapshot matches the context)

    let allowedDelta = deltaSec;

    // Snapping Logic
    // We snap based on the "leader" (the verse we started dragging) or the first selected if unknown
    const leaderIndex = state.dragVerseIndex !== -1 ? state.dragVerseIndex : selectedIndices[0];

    // Helper to check if a specific index is part of the selection
    if (state.selectedIndices.has(leaderIndex)) {
        const leaderInitial = state.initialSnapshot[leaderIndex];
        const { start } = getBounds(leaderInitial, type);
        const proposedTime = start + deltaSec;

        const snappedTime = getSnapTime(proposedTime, 15); // 15px threshold
        if (snappedTime !== null) {
            // Adjust delta to match snap
            allowedDelta = snappedTime - start;
        }
    }

    // 1. Calculate Allowable Delta for the WHOLE GROUP
    // Check LEFT constraints for all selected
    if (deltaSec < 0) {
        for (let i of selectedIndices) {
            const initial = state.initialSnapshot[i];
            const { start } = getBounds(initial, type);

            // Constraint: Previous Clip (if not selected)
            let minLimit = 0;
            if (i > 0 && !state.selectedIndices.has(i - 1)) {
                // We must use the Snapshot for previous item's limit? 
                // Or live state? Ideally live state for unselected, but unselected shouldn't move.
                // Snapshot is safer if we captured everything, but we usually only snapshot selection?
                // Actually dragLogic snapshots EVERYTHING. map(v => ({...v})) on the whole array.
                const prev = state.initialSnapshot[i - 1];
                minLimit = getBounds(prev, type).end;
            }

            const maxMove = minLimit - start; // Negative value
            if (allowedDelta < maxMove) allowedDelta = maxMove; // maxMove is closer to 0 (e.g. -2 vs -5)
        }
    }
    // Check RIGHT constraints for all selected
    else {
        for (let i of selectedIndices) {
            const initial = state.initialSnapshot[i];
            const { end } = getBounds(initial, type);

            // Constraint: Next Clip (if not selected)
            let maxLimit = Infinity;
            if (i < dataSource.length - 1 && !state.selectedIndices.has(i + 1)) {
                const next = state.initialSnapshot[i + 1];
                maxLimit = getBounds(next, type).start;
            }

            const maxMove = maxLimit - end;
            if (allowedDelta > maxMove) allowedDelta = maxMove;
        }
    }

    // 2. Apply Delta
    selectedIndices.forEach(i => {
        const initial = state.initialSnapshot[i];
        const { start, end } = getBounds(initial, type);
        setBounds(dataSource[i], start + allowedDelta, end + allowedDelta, type);
    });
}
