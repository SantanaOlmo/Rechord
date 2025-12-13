import { ChordEditorActions } from './actions.js';

export const ChordEditorEvents = {
    attachListeners(state, renderCallback) {
        // Barre Toggle
        const barreBtn = document.getElementById('btn-barre');
        if (barreBtn) {
            barreBtn.onclick = () => {
                ChordEditorActions.toggleBarre(state, renderCallback);
            };
        }

        // Fret Selector Scroll & Drag
        const selector = document.getElementById('fret-selector-container');
        if (selector) {
            selector.onwheel = (e) => {
                e.preventDefault();
                // Logic directly here or in Action? simpler to update state here via action
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

        // Inline Chord Name Edit
        const nameEl = document.getElementById('chord-name');
        if (nameEl) {
            nameEl.ondblclick = () => {
                const currentName = state.chordName;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentName;
                input.className = 'bg-gray-800 text-white font-bold text-center text-xl border-b-2 border-indigo-500 outline-none w-full py-1';

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
