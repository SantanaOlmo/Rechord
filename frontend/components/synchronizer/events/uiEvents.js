import { state, actions } from '../store.js';
import { audioService } from '../../../services/audioService.js';
import * as cancionService from '../../../services/cancionService.js';
import { updateEstrofas } from '../../../services/estrofaService.js';
import { togglePlay } from './playbackLogic.js';
import { ensurePlayheadVisible } from '../rendering.js';
import { MetronomeLogic } from '../MetronomeLogic.js';

export function attachUIListeners() {
    const btnPlay = document.getElementById('btn-play-pause');
    if (btnPlay) btnPlay.onclick = togglePlay;

    // Metronome Toggle
    const btnMetronome = document.getElementById('toggle-metronome');
    if (btnMetronome) {
        btnMetronome.onclick = () => {
            const isActive = MetronomeLogic.toggle();
            btnMetronome.classList.toggle('text-cyan-400', isActive);
            btnMetronome.classList.toggle('bg-white/10', isActive);
            btnMetronome.classList.toggle('text-gray-400', !isActive);
        };
    }



    // Helper: Apply Zoom centering on viewport or mouse
    function applyZoom(factor, mouseX = null) {
        const scrollArea = document.getElementById('timeline-scroll-area');
        if (!scrollArea) {
            state.zoom *= factor;
            actions.refresh();
            return;
        }

        const rect = scrollArea.getBoundingClientRect();
        const scrollLeft = scrollArea.scrollLeft;

        // Determine "Center" pixel (relative to content start)
        // If mouseX provided (absolute client X), calculate relative to content
        // Else use viewport center
        let pivotPixel;
        let pivotOffset; // Distance of pivot from left edge of viewport

        if (mouseX !== null) {
            pivotOffset = mouseX - rect.left;
            pivotPixel = scrollLeft + pivotOffset;
        } else {
            pivotOffset = rect.width / 2;
            pivotPixel = scrollLeft + pivotOffset;
        }

        // Calculate Time at Pivot
        const pivotTime = pivotPixel / state.zoom;

        // Apply Zoom
        state.zoom *= factor;

        // Refresh UI
        actions.refresh();

        // Calculate New Scroll Position to keep Pivot Time at Pivot Offset
        const newScroll = (pivotTime * state.zoom) - pivotOffset;

        // Multi-stage enforcement to fight browser layout thrashing
        // 1. Immediate attempt (optimistic)
        scrollArea.scrollLeft = Math.max(0, newScroll);

        // 2. Post-layout frame (double RAF to wait for repaint/reflow)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                scrollArea.scrollLeft = Math.max(0, newScroll);
            });
        });
    }

    // Zoom with Wheel (Ctrl + Wheel)
    const timelineContainer = document.getElementById('timeline-container');
    if (timelineContainer) {
        timelineContainer.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                const factor = e.deltaY < 0 ? 1.1 : 0.9;
                applyZoom(factor, e.clientX);
            }
        });
    }

    const btnSave = document.getElementById('btn-save-sync');
    if (btnSave) btnSave.onclick = async () => {
        try {
            const btn = document.getElementById('btn-save-sync');
            const originalText = btn.textContent;
            btn.textContent = 'Guardando...';
            btn.disabled = true;

            // Prepare Settings Payload
            const settingsPayload = {
                id_cancion: state.song.id_cancion,
                bpm: state.settings.tempo,
                metrica_numerador: state.settings.timeSignature.num,
                metrica_denominador: state.settings.timeSignature.den,
                metrica_numerador: state.settings.timeSignature.num,
                metrica_denominador: state.settings.timeSignature.den,
                beat_marker: JSON.stringify(state.settings.beatMarker), // Save as JSON string
                subdivision: state.settings.subdivision,
                velocity: state.settings.velocity,
                velocity: state.settings.velocity,
                acordes: JSON.stringify(state.chords || []), // Save Chords
                song_sections: JSON.stringify(state.settings.songSections || []), // Save Sections
                action: 'update'
            };

            await Promise.all([
                updateEstrofas(state.estrofas),
                cancionService.updateCancion(settingsPayload)
            ]);

            btn.textContent = 'Guardado!';
            setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 2000);
        } catch (e) { alert('Error al guardar: ' + e.message); }
    };

    // --- NEW: Lyrics Display Interaction ---
    const activeDisplay = document.getElementById('active-verse-display');
    if (activeDisplay) {
        // Scroll to navigate
        activeDisplay.addEventListener('wheel', (e) => {
            e.preventDefault();
            const audio = audioService.getInstance();
            if (!audio) return;

            // Find current verse index including approximation
            const currentTime = audio.currentTime;
            let currentIndex = state.estrofas.findIndex(v => currentTime >= v.tiempo_inicio && currentTime <= v.tiempo_fin);

            if (currentIndex === -1) {
                currentIndex = state.estrofas.findIndex(v => v.tiempo_inicio > currentTime);
                if (currentIndex === -1) currentIndex = state.estrofas.length - 1;
                else currentIndex = Math.max(0, currentIndex - 1);
            }

            if (e.deltaY > 0) {
                // Next
                if (currentIndex < state.estrofas.length - 1) {
                    const nextIndex = currentIndex + 1;
                    audio.currentTime = state.estrofas[nextIndex].tiempo_inicio + 0.01;

                    // Select it
                    state.selectedIndices.clear();
                    state.selectedIndices.add(nextIndex);

                    actions.refresh();
                    ensurePlayheadVisible(audio.currentTime);
                }
            } else {
                // Prev
                if (currentIndex >= 0 && state.estrofas[currentIndex - 1]) {
                    const prevIndex = currentIndex - 1;
                    audio.currentTime = state.estrofas[prevIndex].tiempo_inicio + 0.01;

                    // Select it
                    state.selectedIndices.clear();
                    state.selectedIndices.add(prevIndex);

                    actions.refresh();
                    ensurePlayheadVisible(audio.currentTime);
                }
            }
        });
    }

    // --- SIDEBAR RESIZING LOGIC ---
    const resizer = document.getElementById('sidebar-resizer');
    const sidebar = document.getElementById('editor-sidebar');
    const trackHeaders = document.getElementById('track-headers-sidebar');

    if (resizer && sidebar) {
        let isResizing = false;

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.cursor = 'col-resize';
            document.body.classList.add('select-none'); // Prevent selection while dragging
        });

        window.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            // Calculate new width optimized with requestAnimationFrame logic implicitly by browser event handling, 
            // but we can just set it directly as layout thrashing is unavoidable here.
            // Using requestAnimationFrame explicitly for "no lag" feel if events are too frequent.
            requestAnimationFrame(() => {
                const newWidth = e.clientX - sidebar.getBoundingClientRect().left;

                // Constraints (min 200px, max 50% of screen)
                if (newWidth > 200 && newWidth < window.innerWidth * 0.6) {
                    sidebar.style.width = `${newWidth}px`;
                    // Dispatch resize event so timeline can update if needed (though timeline is flex, checks container)
                    actions.refresh();
                }
            });
        });

        window.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
                document.body.classList.remove('select-none');
                actions.refresh();
            }
        });
    }

    // --- VERTICAL RESIZING LOGIC ---
    const vResizer = document.getElementById('vertical-resizer');
    const timelineContainerResize = document.getElementById('timeline-container');

    if (vResizer && timelineContainerResize) {
        let isVResizing = false;

        vResizer.addEventListener('mousedown', (e) => {
            isVResizing = true;
            document.body.style.cursor = 'row-resize';
            document.body.classList.add('select-none');
        });

        window.addEventListener('mousemove', (e) => {
            if (!isVResizing) return;

            requestAnimationFrame(() => {
                // Calculate height from bottom
                const newHeight = window.innerHeight - e.clientY - 10; // 10px buffer

                // Constraints
                if (newHeight > 100 && newHeight < window.innerHeight * 0.8) {
                    timelineContainerResize.style.height = `${newHeight}px`;
                    actions.refresh();
                }
            });
        });

        window.addEventListener('mouseup', () => {
            if (isVResizing) {
                isVResizing = false;
                document.body.style.cursor = '';
                document.body.classList.remove('select-none');
                actions.refresh();
            }
        });
    }

    // Refresh layout on window resize to ensure timeline fills width
    window.addEventListener('resize', () => {
        actions.refresh();
    });
}
