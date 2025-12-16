import { ChordEditorActions } from './actions.js';

export const ChordEditorRenderer = {
    render(state, renderCallback) {
        // Update Chord Name
        const nameEl = document.getElementById('chord-name');
        if (nameEl) {
            nameEl.textContent = state.chordName || 'Nombre del Acorde...';
            nameEl.style.opacity = state.chordName ? '1' : '0.5';
            nameEl.style.fontStyle = state.chordName ? 'normal' : 'italic';
        }

        this.renderFretSelector(state, renderCallback);
        this.renderGrid(state, renderCallback);
    },

    renderFretSelector(state, renderCallback) {
        const container = document.getElementById('fret-selector-list');
        if (!container) return;

        container.innerHTML = '';

        let displayNumbers = [];
        let activeIndex = -1;

        // Always show 5 numbers, starting from the current startFret
        // This effectively keeps the "selected" startFret at the top visually.
        displayNumbers = [
            state.startFret,
            state.startFret + 1,
            state.startFret + 2,
            state.startFret + 3,
            state.startFret + 4
        ];

        // The active item is ALWAYS the first one effectively (index 0)
        activeIndex = 0;

        const opacityMap = [1, 0.6, 0.35, 0.15, 0.05];

        displayNumbers.forEach((val, index) => {
            const el = document.createElement('div');
            // flex-1 ensures they split the height equally (20% each)
            let classes = 'flex-1 flex items-center justify-center font-bold text-lg select-none transition-all duration-200 w-full';

            // Opacity & Color
            // Index 0 is the "selected" one -> White, full opacity
            // Others -> Grayish/White with fading opacity
            if (index === 0) {
                // Active: White, Bold, Full Opacity
                classes += ' text-white scale-125'; // Subtle scale for active
                el.style.opacity = '1';
                // Optional: Text shadow or something to make it pop without background?
                el.style.textShadow = '0 0 10px rgba(255,255,255,0.5)';
            } else {
                // Others: Gray/White, Fading
                classes += ' text-gray-300';
                el.style.opacity = opacityMap[index] !== undefined ? opacityMap[index] : 0;
            }

            el.className = classes;
            el.textContent = val;

            el.onclick = (e) => {
                e.stopPropagation();
                // Action: Set Start Fret
                ChordEditorActions.setStartFret(state, val, renderCallback);
            };

            container.appendChild(el);
        });
    },

    renderGrid(state, renderCallback) {
        const grid = document.getElementById('guitar-grid');
        if (!grid) return;
        grid.innerHTML = '';

        // Strings
        const stringWidths = [4, 3, 3, 2, 2, 1];
        for (let s = 1; s <= 6; s++) {
            const stringLine = document.createElement('div');
            const leftPos = (s - 1) * 20;
            // BLACK LINES on WHITE BG
            stringLine.className = 'absolute top-0 bottom-0 bg-gray-800 z-0 pointer-events-none';
            stringLine.style.left = `${leftPos}%`;
            stringLine.style.width = `${stringWidths[s - 1]}px`;
            stringLine.style.transform = 'translateX(-50%)';
            grid.appendChild(stringLine);
        }

        // Frets
        for (let f = 0; f <= 5; f++) {
            const fretLine = document.createElement('div');
            const topPos = f * 20;
            // BLACK LINES
            fretLine.className = 'absolute left-0 right-0 h-px bg-gray-800 z-0 pointer-events-none';
            fretLine.style.top = `${topPos}%`;
            grid.appendChild(fretLine);
        }

        // Barre Indicator
        if (state.barre) {
            const { from, to } = state.barre;
            const bar = document.createElement('div');

            const leftPerc = (from - 1) * 20;
            const widthPerc = (to - from) * 20;

            // Black barre? Or keep Indigo for accent? User didn't specify. 
            // Usually barre is black arc. I'll stick to accent color 'bg-indigo-600' or maybe 'bg-black'.
            // Let's use 'bg-gray-900' (Black) to match request for "negro".
            bar.className = 'absolute h-4 bg-gray-900 rounded-full z-10 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]';

            bar.style.left = `calc(${leftPerc}% - 12px)`;
            bar.style.width = `calc(${widthPerc}% + 24px)`;

            bar.style.top = '10%';
            bar.style.height = '14px';
            bar.style.transform = 'translateY(-50%)';
            grid.appendChild(bar);
        }

        // Interaction Zones (Dots)
        for (let fret = 1; fret <= 5; fret++) {
            for (let string = 1; string <= 6; string++) {
                const zone = document.createElement('div');
                const leftPos = (string - 1) * 20;
                const topPos = (fret - 1) * 20;

                zone.className = 'absolute w-8 h-8 -ml-4 -mt-4 z-20 cursor-pointer flex items-center justify-center group';
                zone.style.left = `${leftPos}%`;
                zone.style.top = `${topPos + 10}%`;

                // Dot
                const dot = document.createElement('div');
                const isSelected = state.fingers[`${string}-${fret}`];
                // Active: Black (gray-900). Inactive: transparent hover gray-200.
                dot.className = `w-5 h-5 rounded-full transition-all duration-200 border border-transparent ${isSelected ? 'bg-gray-900 scale-100 shadow-sm' : 'bg-gray-300/50 opacity-0 group-hover:opacity-100 scale-75'}`;

                zone.appendChild(dot);

                // zone.onclick removed - handled in events.js
                grid.appendChild(zone);
            }
        }
    }
};
