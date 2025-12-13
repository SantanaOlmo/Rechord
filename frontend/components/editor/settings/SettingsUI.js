import { state } from '../../synchronizer/store.js';
import { renderTimeline } from '../../synchronizer/rendering.js';
import { BeatMarkerManager } from './BeatMarkerManager.js';

export const SettingsUI = {
    updateBeatMarkerUI: (btn, valLabel) => {
        if (!state.song) return;
        const markers = state.settings.beatMarker || [];

        // Update Button Icon (Only once ideally, but safe here)
        if (btn && btn.getAttribute('data-setup') !== 'true') {
            btn.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
            `;
            btn.title = "Crear nueva sección";
            btn.className = "text-indigo-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-1 rounded-full transition";
            btn.setAttribute('data-setup', 'true');
        }

        if (valLabel) {
            valLabel.textContent = `${markers.length} Secciones`;
        }

        // OPTIMIZATION: Do NOT call renderSectionsList here.
        // renderSectionsList should only be called on INIT or when ADD/DELETE/SELECT actions happen.
    },

    ensureContainer: (wrapper) => {
        if (wrapper && !document.getElementById('beat-markers-list-container')) {
            const container = document.createElement('div');
            container.id = 'beat-markers-list-container';
            container.className = 'mt-4 flex flex-col gap-1 max-h-60 overflow-y-auto border-t border-gray-700 pt-2';
            wrapper.appendChild(container);
        }
    },

    renderSectionsList: () => {
        const listContainer = document.getElementById('beat-markers-list-container');
        if (!listContainer) return;

        listContainer.innerHTML = '';
        const regions = state.settings.beatMarker || [];
        const colors = ['text-cyan-400', 'text-green-400', 'text-pink-400', 'text-yellow-400', 'text-purple-400', 'text-red-400'];

        if (regions.length === 0) {
            listContainer.innerHTML = '<div class="text-xs text-gray-500 text-center py-2">Sin secciones</div>';
            return;
        }

        regions.forEach((region, index) => {
            const row = document.createElement('div');
            const isSelected = index === state.settings.selectedRegionIndex;

            // Row Container
            row.className = `flex items-start justify-between gap-2 p-2 rounded text-[10px] border ${isSelected ? 'bg-gray-700 border-yellow-400/50' : 'bg-gray-900 border-transparent hover:bg-gray-700'} mb-1`;

            const colorClass = colors[index % colors.length];

            // Generated HTML with Stacked Layout + Eye Buttons
            row.innerHTML = `
                <div class="w-1.5 h-1.5 rounded-full shrink-0 ${colorClass.replace('text-', 'bg-')} mt-1.5"></div>
                
                <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                    <!-- IN ROW -->
                    <div class="flex items-center gap-1">
                         <span class="text-gray-500 w-5 text-right">In:</span>
                         <input type="text" readonly class="bg-gray-800 border-none rounded px-1 w-12 text-white text-right marker-start focus:ring-1 focus:ring-cyan-400 outline-none h-5 cursor-e-resize font-mono" 
                                value="${region.start.toFixed(2)}" 
                                data-index="${index}" title="Drag horizontal or use arrows">
                         <button class="text-gray-500 hover:text-white p-0.5" title="Centrar Entrada" data-action="focus-in">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                         </button>
                    </div>
                    <!-- OUT ROW -->
                    <div class="flex items-center gap-1">
                         <span class="text-gray-500 w-5 text-right">Out:</span>
                         <input type="text" readonly class="bg-gray-800 border-none rounded px-1 w-12 text-white text-right marker-end focus:ring-1 focus:ring-cyan-400 outline-none h-5 cursor-e-resize font-mono" 
                                value="${(region.end || 180).toFixed(2)}" 
                                data-index="${index}" title="Drag horizontal or use arrows">
                         <button class="text-gray-500 hover:text-white p-0.5" title="Centrar Salida" data-action="focus-out">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                         </button>
                    </div>
                </div>
                
                <!-- DELETE COL -->
                <div class="flex items-center pl-1 border-l border-gray-700 ml-1 self-center">
                     <button class="text-gray-500 hover:text-red-400 p-1.5 rounded-full hover:bg-white/5 transition-colors" title="Borrar Sección" data-action="delete">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     </button>
                </div>
            `;

            // BIND EVENTS
            const startInput = row.querySelector('.marker-start');
            const endInput = row.querySelector('.marker-end');

            const setupInput = (input, isStart) => {
                // Focus -> Select
                input.addEventListener('focus', () => {
                    state.settings.selectedMarkerType = isStart ? 'start' : 'end';
                    state.selectedIndices.clear(); // Clear lyrics selection
                    BeatMarkerManager.selectMarker(index);
                    SettingsUI.renderSectionsList(); // to update highlights

                    // Center View
                    const time = isStart ? region.start : (region.end || 180);
                    const scrollArea = document.getElementById('timeline-scroll-area');
                    if (scrollArea) {
                        scrollArea.scrollLeft = Math.max(0, (time * state.zoom) - (scrollArea.clientWidth / 2));
                    }
                });

                // Keydown -> Move
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                        e.preventDefault();
                        const step = e.shiftKey ? 1.0 : (e.altKey ? 0.01 : 0.1);
                        const delta = (e.key === 'ArrowRight' ? 1 : -1) * step;

                        let s = region.start;
                        let eVal = region.end || 180;
                        if (isStart) s += delta;
                        else eVal += delta;

                        // Use Manager to Update
                        const valid = BeatMarkerManager.updateMarker(index, s, eVal);
                        if (valid) {
                            input.value = (isStart ? valid.start : valid.end).toFixed(2);
                        }
                    }
                });
            };

            setupInput(startInput, true);
            setupInput(endInput, false);

            row.querySelector('[data-action="focus-in"]').addEventListener('click', (e) => {
                e.stopPropagation();
                state.settings.selectedMarkerType = 'start';
                state.selectedIndices.clear();
                BeatMarkerManager.selectMarker(index);
                SettingsUI.renderSectionsList();
                const scrollArea = document.getElementById('timeline-scroll-area');
                if (scrollArea) scrollArea.scrollLeft = Math.max(0, (region.start * state.zoom) - (scrollArea.clientWidth / 2));
            });

            row.querySelector('[data-action="focus-out"]').addEventListener('click', (e) => {
                e.stopPropagation();
                state.settings.selectedMarkerType = 'end';
                state.selectedIndices.clear();
                BeatMarkerManager.selectMarker(index);
                SettingsUI.renderSectionsList();
                const scrollArea = document.getElementById('timeline-scroll-area');
                if (scrollArea) scrollArea.scrollLeft = Math.max(0, ((region.end || 180) * state.zoom) - (scrollArea.clientWidth / 2));
            });

            row.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
                e.stopPropagation();
                if (BeatMarkerManager.deleteMarker(index)) {
                    SettingsUI.renderSectionsList(); // Re-render after delete
                }
            });

            listContainer.appendChild(row);
        });
    }
};
