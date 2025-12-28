import { state, actions } from '../store.js';
import { audioService } from '../../../services/audioService.js';
import { togglePlay } from './playbackLogic.js';
import { ensurePlayheadVisible } from '../rendering.js';
import { history } from './historyLogic.js';

let isAttached = false;

// Helper to abstract property differences
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


// State for the Game Loop
const activeKeys = new Set();
let loopId = null;
let lastTick = 0;
const TICK_RATE = 50; // ms between updates (approx 20fps for control speed)

export function attachKeyboardListeners() {
    if (isAttached) return;
    isAttached = true;

    // Track Modifiers directly in state for UI feedback if needed, but rely on activeKeys for logic
    window.addEventListener('keyup', (e) => {
        activeKeys.delete(e.code);

        if (e.code === 'KeyZ') state.isZDown = false;
        if (e.code === 'KeyX') state.isXDown = false;
        if (e.code === 'KeyC') state.isCDown = false;
        if (e.code === 'KeyJ') state.isJDown = false;

        // Stop Loop if no direction keys are held
        if (!activeKeys.has('ArrowLeft') && !activeKeys.has('ArrowRight')) {
            stopLoop();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;

        const onSyncPage = !!document.getElementById('timeline-container');
        const onSongPage = !!document.querySelector('.song-page-container');
        if (!onSyncPage && !onSongPage) return;

        // Context Setup
        const type = state.selectionType || 'verse';
        const dataSource = type === 'section' ? state.settings.songSections : state.estrofas;

        // Global Undo/Redo/Save/Play (One-off actions)
        if (handleGlobalShortcuts(e, dataSource)) return;

        // Update Key State
        activeKeys.add(e.code);

        // Update UI State hints
        if (e.code === 'KeyZ') state.isZDown = true;
        if (e.code === 'KeyX') state.isXDown = true;
        if (e.code === 'KeyC') state.isCDown = true;
        if (e.code === 'KeyJ') state.isJDown = true;

        // Start Loop if Arrow Pressed and not running
        if ((e.code === 'ArrowLeft' || e.code === 'ArrowRight') && !loopId) {
            e.preventDefault();
            // Snapshot history ONCE effectively when movement starts
            const isModifying = state.isZDown || state.isXDown || state.isCDown || state.isJDown || e.altKey;
            if (isModifying && state.selectedIndices.size > 0) {
                history.push(dataSource, type);
            }
            startLoop();
        }
    });
}

function handleGlobalShortcuts(e, dataSource) {
    if (e.ctrlKey && e.code === 'KeyZ') {
        e.preventDefault();
        const getter = (t) => t === 'section' ? state.settings.songSections : state.estrofas;
        const result = history.undo(getter);
        if (result) {
            if (result.type === 'section') state.settings.songSections = result.data;
            else state.estrofas = result.data;
            actions.refresh();
        }
        return true;
    }
    if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
        return true;
    }
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
        e.preventDefault();
        const btnSave = document.getElementById('btn-save-sync');
        if (btnSave) btnSave.click();
        return true;
    }
    return false;
}

function startLoop() {
    if (loopId) return;
    lastTick = 0; // Force immediate first tick
    loopId = requestAnimationFrame(loop);
}

function stopLoop() {
    if (loopId) {
        cancelAnimationFrame(loopId);
        loopId = null;
    }
}

function loop(timestamp) {
    if (!loopId) return; // Guard

    const elapsed = timestamp - lastTick;

    if (elapsed > TICK_RATE) {
        handleMovementTick();
        lastTick = timestamp;
    }

    loopId = requestAnimationFrame(loop);
}

function handleMovementTick() {
    const audio = audioService.getInstance();
    if (!audio) return;

    const type = state.selectionType || 'verse';
    const dataSource = type === 'section' ? state.settings.songSections : state.estrofas;

    // Determine Direction
    // If both pressed, cancel out or prioritize last? Let's prioritize Left for simplicity if both
    let direction = 0;
    if (activeKeys.has('ArrowLeft')) direction = -1;
    if (activeKeys.has('ArrowRight')) direction = 1;

    if (direction === 0) return; // Should stop loop? kept active while held for responsiveness

    // Logic Dispatch
    const isShift = activeKeys.has('ShiftLeft') || activeKeys.has('ShiftRight');
    const isAlt = activeKeys.has('AltLeft') || activeKeys.has('AltRight');

    // 1. Modifiers with Selection
    if (state.selectedIndices.size > 0) {
        // A. Compression (Alt)
        if (isAlt) {
            applyCompression(direction, dataSource, type);
            return;
        }
        // B. Move (Z)
        if (state.isZDown) {
            applyMove(direction, isShift, dataSource, type);
            return;
        }
        // C. Resize Start (X)
        if (state.isXDown) {
            applyResizeStart(direction, isShift, dataSource, type);
            return;
        }
        // D. Resize End (C)
        if (state.isCDown) {
            applyResizeEnd(direction, isShift, dataSource, type);
            return;
        }
        // E. Join (J)
        if (state.isJDown) {
            applyJoin(direction, dataSource, type);
            return;
        }
    }

    // 2. Navigation (No modification modifiers)
    applyNavigation(direction, isShift, dataSource, type, audio);
}

// --- Logic Implementations ---

function applyMove(direction, isShift, dataSource, type) {
    const selected = Array.from(state.selectedIndices);
    const audio = audioService.getInstance();

    // Speed Logic: Default 0.1, Shift 0.3 (3x), Double-Shift 0.4 (4x)
    let step = 0.1;
    if (isSuperShift) step = 0.4;
    else if (isShift) step = 0.3;

    let delta = direction * step;

    // Collision Limit Check
    let allowedDelta = delta;
    if (delta < 0) { // Moving Left
        for (let idx of selected) {
            if (!state.selectedIndices.has(idx - 1)) {
                const { start } = getBounds(dataSource[idx], type);
                const prevEnd = (idx > 0) ? getBounds(dataSource[idx - 1], type).end : 0;
                const maxMove = prevEnd - start; // Negative numbers
                if (allowedDelta < maxMove) allowedDelta = maxMove;
            }
        }
    } else { // Moving Right
        for (let idx of selected) {
            if (!state.selectedIndices.has(idx + 1)) {
                const { end } = getBounds(dataSource[idx], type);
                const nextStart = (idx < dataSource.length - 1) ? getBounds(dataSource[idx + 1], type).start : Infinity;
                const maxMove = nextStart - end;
                if (allowedDelta > maxMove) allowedDelta = maxMove;
            }
        }
    }

    if (Math.abs(allowedDelta) < 0.0001) return; // Blocked

    selected.forEach(idx => {
        const item = dataSource[idx];
        const { start, end } = getBounds(item, type);
        setBounds(item, start + allowedDelta, end + allowedDelta, type);
    });

    const first = getBounds(dataSource[selected[0]], type);
    audio.currentTime = first.start;
    actions.refresh();
    ensurePlayheadVisible(audio.currentTime);
}

function applyResizeStart(direction, isShift, dataSource, type) {
    // Speed Logic
    let step = 0.1;
    if (isSuperShift) step = 0.4;
    else if (isShift) step = 0.3;

    const delta = direction * step;
    const selected = Array.from(state.selectedIndices);
    const audio = audioService.getInstance();

    selected.forEach(idx => {
        const item = dataSource[idx];
        const { start, end } = getBounds(item, type);
        let newVal = start + delta;
        let minLimit = 0;

        if (idx > 0 && !state.selectedIndices.has(idx - 1)) {
            minLimit = getBounds(dataSource[idx - 1], type).end;
        }
        newVal = Math.max(minLimit, Math.min(newVal, end - 0.1));
        setBounds(item, newVal, end, type);
    });

    if (selected.length > 0) {
        const first = getBounds(dataSource[selected[0]], type);
        audio.currentTime = first.start;
        actions.refresh();
        ensurePlayheadVisible(audio.currentTime);
    }
}

function applyResizeEnd(direction, isShift, dataSource, type) {
    // Speed Logic
    let step = 0.1;
    if (isSuperShift) step = 0.4;
    else if (isShift) step = 0.3;

    const delta = direction * step;
    const selected = Array.from(state.selectedIndices);

    selected.forEach(idx => {
        const item = dataSource[idx];
        const { start, end } = getBounds(item, type);
        let newVal = end + delta;
        let maxLimit = Infinity;

        if (idx < dataSource.length - 1 && !state.selectedIndices.has(idx + 1)) {
            maxLimit = getBounds(dataSource[idx + 1], type).start;
        }
        newVal = Math.max(start + 0.1, Math.min(newVal, maxLimit));
        setBounds(item, start, newVal, type);
    });
    actions.refresh();
}

function applyCompression(direction, dataSource, type) {
    const sortedIndices = Array.from(state.selectedIndices).sort((a, b) => a - b);
    const compressionStep = 0.05;
    const shiftAmount = (direction === 1) ? compressionStep : -compressionStep;
    let cumulativeShift = 0;

    for (let i = 1; i < sortedIndices.length; i++) {
        const currentIdx = sortedIndices[i];
        cumulativeShift += shiftAmount;

        const item = dataSource[currentIdx];
        const { start, end } = getBounds(item, type);
        const duration = end - start;

        let newStart = start + cumulativeShift;
        let newEnd = newStart + duration;

        // Collision Check (Left Neighbor)
        if (currentIdx > 0) {
            const prevItem = dataSource[currentIdx - 1];
            const prevEnd = getBounds(prevItem, type).end;
            if (newStart < prevEnd) {
                newStart = prevEnd;
                newEnd = newStart + duration;
            }
        }
        // Collision Check (Right Neighbor)
        if (currentIdx < dataSource.length - 1) {
            const nextItem = dataSource[currentIdx + 1];
            const nextStart = getBounds(nextItem, type).start;
            if (newEnd > nextStart) {
                newEnd = nextStart;
                newStart = newEnd - duration;
            }
        }
        // Priority Left Check
        if (currentIdx > 0) {
            const prevItem = dataSource[currentIdx - 1];
            const prevEnd = getBounds(prevItem, type).end;
            if (newStart < prevEnd) {
                newStart = prevEnd;
                newEnd = newStart + duration;
            }
        }

        setBounds(item, newStart, newEnd, type);
    }
    actions.refresh();
}

function applyJoin(direction, dataSource, type) {
    const sorted = Array.from(state.selectedIndices)
        .map(i => ({ index: i, item: dataSource[i] }))
        .sort((a, b) => getBounds(a.item, type).start - getBounds(b.item, type).start);

    let changed = false;

    if (direction === -1) { // Left
        for (let i = 1; i < sorted.length; i++) {
            const prev = sorted[i - 1].item;
            const curr = sorted[i].item;
            const { start: currStart, end: currEnd } = getBounds(curr, type);
            const prevEnd = getBounds(prev, type).end;
            const duration = currEnd - currStart;

            if (Math.abs(currStart - prevEnd) > 0.001) {
                setBounds(curr, prevEnd, prevEnd + duration, type);
                changed = true;
            }
        }
    } else { // Right
        for (let i = sorted.length - 2; i >= 0; i--) {
            const next = sorted[i + 1].item;
            const curr = sorted[i].item;
            const { start: currStart, end: currEnd } = getBounds(curr, type);
            const nextStart = getBounds(next, type).start;
            const duration = currEnd - currStart;

            if (Math.abs(currEnd - nextStart) > 0.001) {
                setBounds(curr, nextStart - duration, nextStart, type);
                changed = true;
            }
        }
    }
    if (changed) actions.refresh();
}

function applyNavigation(direction, isShift, dataSource, type, audio) {
    // Only triggers ONCE per key press actually, navigation shouldn't loop fast.
    // However, if holding arrow, we DO want repeat navigation (scrolling through).
    // The TICK_RATE (50ms) handles the speed.

    // Shift Selection (Anchor) - Copied logic but adapted for loop
    if (isShift) {
        if (state.selectionAnchor === null || state.selectedIndices.size === 0) {
            // Init Anchor (simplified)
            let startIdx = 0;
            if (state.selectedIndices.size > 0) startIdx = Math.min(...state.selectedIndices);
            else {
                const t = audio.currentTime;
                startIdx = dataSource.findIndex(v => t >= getBounds(v, type).start && t <= getBounds(v, type).end);
                if (startIdx === -1) startIdx = 0;
            }
            state.selectionAnchor = startIdx;
            state.selectionHead = startIdx;
        }

        let target = state.selectionHead;
        if (direction === 1) {
            if (target < dataSource.length - 1) target++;
        } else {
            if (target > 0) target--;
        }
        state.selectionHead = target;

        const min = Math.min(state.selectionAnchor, state.selectionHead);
        const max = Math.max(state.selectionAnchor, state.selectionHead);
        state.selectedIndices.clear();
        for (let i = min; i <= max; i++) state.selectedIndices.add(i);

        const headItem = dataSource[target];
        audio.currentTime = getBounds(headItem, type).start + 0.01;
        actions.refresh();
        ensurePlayheadVisible(audio.currentTime);
        return;
    }

    // Normal Jump (No Shift)
    state.selectionAnchor = null;
    state.selectionHead = null;
    const t = audio.currentTime;
    // Find closest relative to time, or selected?
    // Using simple logic: find current, move next/prev
    let idx = dataSource.findIndex(v => t >= getBounds(v, type).start && t <= getBounds(v, type).end);
    if (idx === -1) {
        idx = dataSource.findIndex(v => getBounds(v, type).start > t);
        if (idx === -1) idx = dataSource.length - 1;
        else idx = Math.max(0, idx - 1);
    }

    let nextIdx = idx + direction;
    if (nextIdx >= 0 && nextIdx < dataSource.length) {
        const item = dataSource[nextIdx];
        audio.currentTime = getBounds(item, type).start + 0.01;
        state.selectedIndices.clear();
        state.selectedIndices.add(nextIdx);
        actions.refresh();
        ensurePlayheadVisible(audio.currentTime);
    }
}

