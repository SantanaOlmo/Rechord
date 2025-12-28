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

export function attachKeyboardListeners() {
    if (isAttached) return;
    isAttached = true;

    window.addEventListener('keyup', (e) => {
        if (e.code === 'KeyZ') state.isZDown = false;
        if (e.code === 'KeyX') state.isXDown = false;
        if (e.code === 'KeyC') state.isCDown = false;
        if (e.code === 'KeyJ') state.isJDown = false;
    });

    window.addEventListener('keydown', (e) => {
        // Prevent if typing
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;

        // Prevent if not on Sync Page OR Song Page
        const onSyncPage = !!document.getElementById('timeline-container');
        const onSongPage = !!document.querySelector('.song-page-container');

        if (!onSyncPage && !onSongPage) return;

        // Context Setup
        const type = state.selectionType || 'verse';
        const dataSource = type === 'section' ? state.settings.songSections : state.estrofas;
        const activeTrack = type === 'section' ? 'chords' : 'lyrics'; // Or use state.activeTrack

        // GLOBAL UNDO (Ctrl+Z)
        if (e.ctrlKey && e.code === 'KeyZ') {
            e.preventDefault();

            const getter = (t) => {
                if (t === 'section') return state.settings.songSections;
                return state.estrofas;
            };

            const result = history.undo(getter);
            if (result) {
                const { type: rType, data } = result;
                if (rType === 'section') state.settings.songSections = data;
                else state.estrofas = data;
                actions.refresh();
            }
            return;
        }

        // TOGGLE PLAY (Space)
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        }

        // SAVE (Ctrl+S)
        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
            e.preventDefault();
            const btnSave = document.getElementById('btn-save-sync');
            if (btnSave) btnSave.click();
            return;
        }

        // MODIFIER STATE (J)
        if (e.code === 'KeyJ') {
            state.isJDown = true;
        }

        // Clip Navigation using Arrows
        if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
            e.preventDefault();
            const audio = audioService.getInstance();
            if (!audio) return;

            // Modifier Actions (Require Selection OR Beat Marker)
            if (state.selectedIndices.size > 0) {
                // If Shift is NOT held, we act on modifiers or move focused clip
                if (state.isZDown || state.isXDown || state.isCDown || state.isJDown) {
                    if (!e.repeat) history.push(dataSource, type);
                }
            } else if (state.settings.selectedRegionIndex !== -1 && state.settings.selectedMarkerType) {
                // MOVE SPECIFIC BEAT MARKER (Start or End)
                // ... Existing Beat Marker Logic (Unchanged) ...
                e.preventDefault();
                let delta = 0.01;
                if (e.shiftKey) delta = 0.1;
                const change = (e.code === 'ArrowRight') ? delta : -delta;
                const idx = state.settings.selectedRegionIndex;
                const mType = state.settings.selectedMarkerType;
                const region = state.settings.beatMarker[idx];
                import('../editor/settings/BeatMarkerManager.js').then(({ BeatMarkerManager }) => {
                    let s = region.start;
                    let end = region.end || 180;
                    if (mType === 'start') s += change;
                    else end += change;
                    BeatMarkerManager.updateMarker(idx, s, end);
                });
                return;
            }

            // DIRECTIONAL JOIN (J + Arrow)
            if (state.isJDown && state.selectedIndices.size > 0) {
                const sorted = Array.from(state.selectedIndices)
                    .map(i => ({ index: i, item: dataSource[i] }))
                    .sort((a, b) => getBounds(a.item, type).start - getBounds(b.item, type).start);

                let changed = false;

                if (e.code === 'ArrowLeft') {
                    for (let i = 1; i < sorted.length; i++) {
                        const prevObj = sorted[i - 1];
                        const currObj = sorted[i];
                        const prev = prevObj.item;
                        const curr = currObj.item;
                        const { start: currStart, end: currEnd } = getBounds(curr, type);
                        const prevEnd = getBounds(prev, type).end;
                        const duration = currEnd - currStart;

                        if (Math.abs(currStart - prevEnd) > 0.001) {
                            setBounds(curr, prevEnd, prevEnd + duration, type);
                            changed = true;
                        }
                    }
                } else if (e.code === 'ArrowRight') {
                    for (let i = sorted.length - 2; i >= 0; i--) {
                        const nextObj = sorted[i + 1];
                        const currObj = sorted[i];
                        const next = nextObj.item;
                        const curr = currObj.item;
                        const { start: currStart, end: currEnd } = getBounds(curr, type);
                        const nextStart = getBounds(next, type).start;
                        const duration = currEnd - currStart;

                        if (Math.abs(currEnd - nextStart) > 0.001) {
                            setBounds(curr, nextStart - duration, nextStart, type);
                            changed = true;
                        }
                    }
                }

                if (changed) {
                    actions.refresh();
                }
                return;
            }

            // MODIFIER LOGIC FOR CLIPS (X, C, Z)
            if (state.selectedIndices.size > 0) {
                const step = e.shiftKey ? 0.2 : 0.1;
                const delta = (e.code === 'ArrowRight') ? step : -step;
                const selected = Array.from(state.selectedIndices);

                // 1. Resize START (X + Arrows)
                if (state.isXDown) {
                    if (!e.repeat) history.push(dataSource, type);
                    selected.forEach(idx => {
                        const item = dataSource[idx];
                        const { start, end } = getBounds(item, type);
                        let newVal = start + delta;
                        let minLimit = 0;

                        // Check previous item in dataSource
                        if (idx > 0 && !state.selectedIndices.has(idx - 1)) {
                            minLimit = getBounds(dataSource[idx - 1], type).end;
                        }

                        newVal = Math.max(minLimit, Math.min(newVal, end - 0.1));
                        setBounds(item, newVal, end, type);
                    });
                    const first = getBounds(dataSource[selected[0]], type);
                    audio.currentTime = first.start;
                    actions.refresh();
                    ensurePlayheadVisible(audio.currentTime);
                    return;
                }

                // 2. Resize END (C + Arrows)
                if (state.isCDown) {
                    if (!e.repeat) history.push(dataSource, type);
                    selected.forEach(idx => {
                        const item = dataSource[idx];
                        const { start, end } = getBounds(item, type);
                        let newVal = end + delta;
                        let maxLimit = Infinity;

                        // Check next item
                        if (idx < dataSource.length - 1 && !state.selectedIndices.has(idx + 1)) {
                            maxLimit = getBounds(dataSource[idx + 1], type).start;
                        }

                        newVal = Math.max(start + 0.1, Math.min(newVal, maxLimit));
                        setBounds(item, start, newVal, type);
                    });
                    const first = getBounds(dataSource[selected[0]], type);
                    // audio.currentTime = first.end; // User requested playhead stays put
                    actions.refresh();
                    // ensurePlayheadVisible(audio.currentTime); 
                    return;
                }

                // 3. Move Clip (Z + Arrows)
                if (state.isZDown) {
                    if (!e.repeat) history.push(dataSource, type);
                    let allowedDelta = delta;
                    if (delta < 0) {
                        for (let idx of selected) {
                            if (!state.selectedIndices.has(idx - 1)) {
                                const { start } = getBounds(dataSource[idx], type);
                                const prevEnd = (idx > 0) ? getBounds(dataSource[idx - 1], type).end : 0;
                                const maxMove = prevEnd - start;
                                if (allowedDelta < maxMove) allowedDelta = maxMove;
                            }
                        }
                    } else {
                        for (let idx of selected) {
                            if (!state.selectedIndices.has(idx + 1)) {
                                const { end } = getBounds(dataSource[idx], type);
                                const nextStart = (idx < dataSource.length - 1) ? getBounds(dataSource[idx + 1], type).start : Infinity;
                                const maxMove = nextStart - end;
                                if (allowedDelta > maxMove) allowedDelta = maxMove;
                            }
                        }
                    }

                    selected.forEach(idx => {
                        const item = dataSource[idx];
                        const { start, end } = getBounds(item, type);
                        setBounds(item, start + allowedDelta, end + allowedDelta, type);
                    });
                    const first = getBounds(dataSource[selected[0]], type);
                    audio.currentTime = first.start;
                    actions.refresh();
                    ensurePlayheadVisible(audio.currentTime);
                    return;
                }

                // 4. Compress/Expand Gaps (Alt + Arrows)
                if (e.altKey) {
                    if (!e.repeat) history.push(dataSource, type);

                    const sortedIndices = Array.from(state.selectedIndices).sort((a, b) => a - b);
                    const compressionStep = 0.05;
                    const shiftAmount = (e.code === 'ArrowRight') ? compressionStep : -compressionStep;
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

                        // Collision Check (Right Neighbor) - mainly for expanding
                        if (currentIdx < dataSource.length - 1) {
                            const nextItem = dataSource[currentIdx + 1];
                            const nextStart = getBounds(nextItem, type).start;
                            if (newEnd > nextStart) {
                                newEnd = nextStart;
                                newStart = newEnd - duration;
                            }
                        }

                        // Double-check Left (Priority: Don't push back into left neighbor if blocked by right)
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
                    return;
                }
            }

            // Normal Navigation (Clears Anchor if no Shift)
            if (e.shiftKey) {
                // Initialize Anchor if needed
                if (state.selectionAnchor === null || state.selectedIndices.size === 0) {
                    let startIdx = -1;
                    if (state.selectedIndices.size > 0) {
                        startIdx = Array.from(state.selectedIndices).sort((a, b) => a - b)[0];
                    } else {
                        const time = audio.currentTime;
                        // Find item under playhead
                        startIdx = dataSource.findIndex(v => {
                            const { start, end } = getBounds(v, type);
                            return time >= start && time <= end;
                        });
                        if (startIdx === -1) startIdx = 0; // Fallback
                    }
                    state.selectionAnchor = startIdx;
                    state.selectionHead = startIdx;
                }

                // Move Head
                let target = state.selectionHead;
                if (e.code === 'ArrowRight') {
                    if (target < dataSource.length - 1) target++;
                } else {
                    if (target > 0) target--;
                }
                state.selectionHead = target;

                // Re-build Selection Set
                const min = Math.min(state.selectionAnchor, state.selectionHead);
                const max = Math.max(state.selectionAnchor, state.selectionHead);
                state.selectedIndices.clear();
                for (let i = min; i <= max; i++) {
                    state.selectedIndices.add(i);
                }

                const headItem = dataSource[target];
                audio.currentTime = getBounds(headItem, type).start + 0.01;
                actions.refresh();
                ensurePlayheadVisible(audio.currentTime);
                return;
            }

            // Normal Navigation (No Shift, No Modifiers)
            state.selectionAnchor = null;
            state.selectionHead = null;

            const currentTime = audio.currentTime;

            // Find current item based on time
            let currentIndex = dataSource.findIndex(v => {
                const { start, end } = getBounds(v, type);
                return currentTime >= start && currentTime <= end;
            });

            if (currentIndex === -1) {
                // If in gap, find next one
                currentIndex = dataSource.findIndex(v => getBounds(v, type).start > currentTime);
                if (currentIndex === -1) currentIndex = dataSource.length - 1;
                else currentIndex = Math.max(0, currentIndex - 1);
            }

            if (e.code === 'ArrowRight') {
                if (currentIndex < dataSource.length - 1) {
                    const nextIndex = currentIndex + 1;
                    const nextItem = dataSource[nextIndex];
                    audio.currentTime = getBounds(nextItem, type).start + 0.01;
                    state.selectedIndices.clear();
                    state.selectedIndices.add(nextIndex);
                    state.selectionAnchor = nextIndex;
                    state.selectionHead = nextIndex;
                    actions.refresh();
                    ensurePlayheadVisible(audio.currentTime);
                }
            } else {
                if (currentIndex >= 0 && dataSource[currentIndex - 1]) {
                    const prevIndex = currentIndex - 1;
                    const prevItem = dataSource[prevIndex];
                    audio.currentTime = getBounds(prevItem, type).start + 0.01;
                    state.selectedIndices.clear();
                    state.selectedIndices.add(prevIndex);
                    state.selectionAnchor = prevIndex;
                    state.selectionHead = prevIndex;
                    actions.refresh();
                    ensurePlayheadVisible(audio.currentTime);
                }
            }
        } // End of Arrow check

        // Track Modifiers (keydown)
        if (e.code === 'KeyZ') state.isZDown = true;
        if (e.code === 'KeyX') state.isXDown = true;
        if (e.code === 'KeyC') state.isCDown = true;
        if (e.code === 'KeyJ') state.isJDown = true;
    });
}
