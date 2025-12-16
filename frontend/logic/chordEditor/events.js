import { ChordEditorActions } from './actions.js';

export const ChordEditorEvents = {
    attachListeners(state, renderCallback) {
        // --- Grid Interaction (Click & Drag) ---
        const grid = document.getElementById('guitar-grid');
        if (grid) {
            let startDrag = null;
            let isDragging = false;

            // Helper to get coords
            const getCoords = (e) => {
                const rect = grid.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                // Strings: 6 columns. Frets: 5 rows
                let string = Math.floor((x / rect.width) * 6) + 1;
                let fret = Math.floor((y / rect.height) * 5) + 1;

                // Clamp
                if (string < 1) string = 1; if (string > 6) string = 6;
                if (fret < 1) fret = 1; if (fret > 5) fret = 5;

                return { string, fret };
            };

            const handleMove = (e) => {
                if (!startDrag) return;
                const current = getCoords(e);

                // Detect Drag
                if (current.string !== startDrag.string || current.fret !== startDrag.fret) {
                    isDragging = true;
                }

                // Drag Logic: Barre on Fret 1
                if (startDrag.fret === 1 && isDragging) {
                    // Only support barre on row 1 (relative) per user request/visuals
                    // Dynamic Update
                    const from = Math.min(startDrag.string, current.string);
                    const to = Math.max(startDrag.string, current.string);

                    // Update state live immediately
                    state.barre = { from, to };

                    // Clear fingers under the barre to prevent overlap
                    for (let s = from; s <= to; s++) {
                        if (state.fingers[`${s}-1`]) {
                            delete state.fingers[`${s}-1`];
                        }
                    }

                    // Re-render
                    renderCallback();
                }
            };

            const handleUp = (e) => {
                window.removeEventListener('mousemove', handleMove);
                window.removeEventListener('mouseup', handleUp);

                if (!startDrag) return;

                // Click (Finger Toggle)
                if (!isDragging) {
                    const { string, fret } = startDrag;
                    ChordEditorActions.toggleFinger(state, string, fret, renderCallback);
                }

                startDrag = null;
                isDragging = false;
            };

            grid.onmousedown = (e) => {
                e.preventDefault(); // Prevent text selection
                startDrag = getCoords(e);
                isDragging = false;

                window.addEventListener('mousemove', handleMove);
                window.addEventListener('mouseup', handleUp);
            };
        }

        // --- Fret Selector Scroll & Drag ---
        const selector = document.getElementById('fret-selector-container');
        if (selector) {
            selector.onwheel = (e) => {
                e.preventDefault();
                if (e.deltaY > 0) {
                    ChordEditorActions.setStartFret(state, state.startFret + 1, renderCallback);
                } else if (e.deltaY < 0 && state.startFret > 1) {
                    ChordEditorActions.setStartFret(state, state.startFret - 1, renderCallback);
                }
            };

            let startY = 0;
            let startVal = 0;
            const handleDragMove = (e) => {
                const diff = Math.floor((e.clientY - startY) / 30);
                const newVal = startVal - diff;
                if (newVal >= 1 && state.startFret !== newVal) {
                    ChordEditorActions.setStartFret(state, newVal, renderCallback);
                }
            };
            const handleDragUp = () => {
                window.removeEventListener('mousemove', handleDragMove);
                window.removeEventListener('mouseup', handleDragUp);
            };

            selector.onmousedown = (e) => {
                startY = e.clientY;
                startVal = state.startFret;
                window.addEventListener('mousemove', handleDragMove);
                window.addEventListener('mouseup', handleDragUp);
            };
        }

        // --- Inline Chord Name Edit ---
        const nameEl = document.getElementById('chord-name');
        if (nameEl) {
            nameEl.ondblclick = () => {
                const currentName = state.chordName;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentName;
                input.placeholder = 'Nombre del Acorde...';
                input.className = 'bg-gray-900 text-white font-bold text-center text-xl border-b-2 border-indigo-500 outline-none w-full py-1 placeholder-gray-500';

                const save = () => {
                    const val = input.value.trim();
                    if (val) ChordEditorActions.setChordName(state, val, renderCallback);

                    nameEl.textContent = state.chordName;
                    nameEl.classList.remove('hidden');
                    input.remove();
                };

                nameEl.classList.add('hidden');
                input.onblur = save;
                input.onkeydown = (e) => {
                    if (e.key === 'Enter') input.blur();
                };
                nameEl.parentNode.insertBefore(input, nameEl);
                input.focus();
            };
        }
    }
};
