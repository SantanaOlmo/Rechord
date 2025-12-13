import { state, actions } from '../store.js';
import { audioService } from '../../../services/audioService.js';
import { togglePlay } from './playbackLogic.js';
import { ensurePlayheadVisible } from '../rendering.js';
import { history } from './historyLogic.js';

let isAttached = false;

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

        // GLOBAL UNDO (Ctrl+Z)
        if (e.ctrlKey && e.code === 'KeyZ') {
            e.preventDefault();
            const prev = history.undo(state.estrofas);
            if (prev) {
                state.estrofas = prev;
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
                    history.push(state.estrofas);
                }
            } else if (state.settings.selectedRegionIndex !== -1 && state.settings.selectedMarkerType) {
                // MOVE SPECIFIC BEAT MARKER (Start or End)
                e.preventDefault();
                let delta = 0.01; // 10ms default
                if (e.shiftKey) delta = 0.1; // 100ms with shift

                // Which direction?
                const change = (e.code === 'ArrowRight') ? delta : -delta;

                const idx = state.settings.selectedRegionIndex;
                const type = state.settings.selectedMarkerType;
                const region = state.settings.beatMarker[idx];

                // Use Manager
                import('../editor/settings/BeatMarkerManager.js').then(({ BeatMarkerManager }) => {
                    let s = region.start;
                    let end = region.end || 180;

                    if (type === 'start') s += change;
                    else end += change;

                    BeatMarkerManager.updateMarker(idx, s, end);
                });

                return;
            }

            // DIRECTIONAL JOIN (J + Arrow)
            if (state.isJDown && state.selectedIndices.size > 0) {
                const sorted = Array.from(state.selectedIndices).sort((a, b) => a - b);
                let changed = false;

                if (e.code === 'ArrowLeft') {
                    for (let i = 1; i < sorted.length; i++) {
                        const prevIdx = sorted[i - 1];
                        const currIdx = sorted[i];
                        const prev = state.estrofas[prevIdx];
                        const curr = state.estrofas[currIdx];
                        const duration = curr.tiempo_fin - curr.tiempo_inicio;
                        const newStart = prev.tiempo_fin;

                        if (Math.abs(curr.tiempo_inicio - newStart) > 0.001) {
                            curr.tiempo_inicio = newStart;
                            curr.tiempo_fin = newStart + duration;
                            changed = true;
                        }
                    }
                } else if (e.code === 'ArrowRight') {
                    for (let i = sorted.length - 2; i >= 0; i--) {
                        const nextIdx = sorted[i + 1];
                        const currIdx = sorted[i];
                        const next = state.estrofas[nextIdx];
                        const curr = state.estrofas[currIdx];
                        const duration = curr.tiempo_fin - curr.tiempo_inicio;
                        const newEnd = next.tiempo_inicio;

                        if (Math.abs(curr.tiempo_fin - newEnd) > 0.001) {
                            curr.tiempo_fin = newEnd;
                            curr.tiempo_inicio = newEnd - duration;
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
                const step = 0.1;
                const delta = (e.code === 'ArrowRight') ? step : -step;
                const selected = Array.from(state.selectedIndices);

                // 1. Resize START (X + Arrows)
                if (state.isXDown) {
                    history.push(state.estrofas);
                    selected.forEach(idx => {
                        const verse = state.estrofas[idx];
                        let newVal = verse.tiempo_inicio + delta;
                        let minLimit = 0;
                        if (idx > 0 && !state.selectedIndices.has(idx - 1)) {
                            minLimit = state.estrofas[idx - 1].tiempo_fin;
                        }
                        newVal = Math.max(minLimit, Math.min(newVal, verse.tiempo_fin - 0.1));
                        verse.tiempo_inicio = newVal;
                    });
                    audio.currentTime = state.estrofas[selected[0]].tiempo_inicio;
                    actions.refresh();
                    ensurePlayheadVisible(audio.currentTime);
                    return;
                }

                // 2. Resize END (C + Arrows)
                if (state.isCDown) {
                    history.push(state.estrofas);
                    selected.forEach(idx => {
                        const verse = state.estrofas[idx];
                        let newVal = verse.tiempo_fin + delta;
                        let maxLimit = Infinity;
                        if (idx < state.estrofas.length - 1 && !state.selectedIndices.has(idx + 1)) {
                            maxLimit = state.estrofas[idx + 1].tiempo_inicio;
                        }
                        newVal = Math.max(verse.tiempo_inicio + 0.1, Math.min(newVal, maxLimit));
                        verse.tiempo_fin = newVal;
                    });
                    audio.currentTime = state.estrofas[selected[0]].tiempo_fin; // Visual feedback
                    actions.refresh();
                    ensurePlayheadVisible(audio.currentTime);
                    return;
                }

                // 3. Move Clip (Z + Arrows)
                if (state.isZDown) {
                    history.push(state.estrofas);
                    let allowedDelta = delta;
                    if (delta < 0) {
                        for (let idx of selected) {
                            if (!state.selectedIndices.has(idx - 1)) {
                                const prevEnd = (idx > 0) ? state.estrofas[idx - 1].tiempo_fin : 0;
                                const maxMove = prevEnd - state.estrofas[idx].tiempo_inicio;
                                if (allowedDelta < maxMove) allowedDelta = maxMove;
                            }
                        }
                    } else {
                        for (let idx of selected) {
                            if (!state.selectedIndices.has(idx + 1)) {
                                const nextStart = (idx < state.estrofas.length - 1) ? state.estrofas[idx + 1].tiempo_inicio : Infinity;
                                const maxMove = nextStart - state.estrofas[idx].tiempo_fin;
                                if (allowedDelta > maxMove) allowedDelta = maxMove;
                            }
                        }
                    }

                    selected.forEach(idx => {
                        state.estrofas[idx].tiempo_inicio += allowedDelta;
                        state.estrofas[idx].tiempo_fin += allowedDelta;
                    });
                    audio.currentTime = state.estrofas[selected[0]].tiempo_inicio;
                    actions.refresh();
                    ensurePlayheadVisible(audio.currentTime);
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
                        startIdx = state.estrofas.findIndex(v => time >= v.tiempo_inicio && time <= v.tiempo_fin);
                        if (startIdx === -1) startIdx = 0; // Fallback
                    }
                    state.selectionAnchor = startIdx;
                    state.selectionHead = startIdx;
                }

                // Move Head
                let target = state.selectionHead;
                if (e.code === 'ArrowRight') {
                    if (target < state.estrofas.length - 1) target++;
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

                const headVerse = state.estrofas[target];
                audio.currentTime = headVerse.tiempo_inicio + 0.01;
                actions.refresh();
                ensurePlayheadVisible(audio.currentTime);
                return;
            }

            // Normal Navigation (No Shift, No Modifiers)
            state.selectionAnchor = null;
            state.selectionHead = null;

            const currentTime = audio.currentTime;
            let currentIndex = state.estrofas.findIndex(v => currentTime >= v.tiempo_inicio && currentTime <= v.tiempo_fin);

            if (currentIndex === -1) {
                currentIndex = state.estrofas.findIndex(v => v.tiempo_inicio > currentTime);
                if (currentIndex === -1) currentIndex = state.estrofas.length - 1;
                else currentIndex = Math.max(0, currentIndex - 1);
            }

            if (e.code === 'ArrowRight') {
                if (currentIndex < state.estrofas.length - 1) {
                    const nextIndex = currentIndex + 1;
                    audio.currentTime = state.estrofas[nextIndex].tiempo_inicio + 0.01;
                    state.selectedIndices.clear();
                    state.selectedIndices.add(nextIndex);
                    state.selectionAnchor = nextIndex;
                    state.selectionHead = nextIndex;
                    actions.refresh();
                    ensurePlayheadVisible(audio.currentTime);
                }
            } else {
                if (currentIndex >= 0 && state.estrofas[currentIndex - 1]) {
                    const prevIndex = currentIndex - 1;
                    audio.currentTime = state.estrofas[prevIndex].tiempo_inicio + 0.01;
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
