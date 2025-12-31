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

    // Metronome Toggle Logic
    const toggleMetronomeAction = (btn) => {
        const isActive = MetronomeLogic.toggle();
        // Update ALL metronome buttons
        const allBtns = document.querySelectorAll('#toggle-metronome, #toggle-metronome-mobile');
        allBtns.forEach(b => {
            b.classList.toggle('text-cyan-400', isActive);
            b.classList.toggle('bg-white/10', isActive);
            b.classList.toggle('text-gray-400', !isActive);
        });
    };

    const btnMetronome = document.getElementById('toggle-metronome');
    if (btnMetronome) btnMetronome.onclick = () => toggleMetronomeAction(btnMetronome);

    const btnMetronomeMobile = document.getElementById('toggle-metronome-mobile');
    if (btnMetronomeMobile) btnMetronomeMobile.onclick = () => toggleMetronomeAction(btnMetronomeMobile);


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

    const saveAction = async (btnClicked) => {
        try {
            // Update UI on both buttons if they exist
            const allSaveBtns = document.querySelectorAll('#btn-save-sync, #btn-save-sync-mobile');
            allSaveBtns.forEach(btn => {
                const span = btn.querySelector('span'); // Might be missing on mobile
                if (span) btn.dataset.originalText = span.textContent;

                // For mobile button which has no text, maybe change color
                btn.classList.add('opacity-50', 'cursor-not-allowed');
                btn.disabled = true;
            });

            if (btnClicked.textContent) btnClicked.textContent = '...';

            // Prepare Settings Payload
            const settingsPayload = {
                id_cancion: state.song.id_cancion,
                bpm: state.settings.tempo,
                metrica_numerador: state.settings.timeSignature.num,
                metrica_denominador: state.settings.timeSignature.den,
                beat_marker: JSON.stringify(state.settings.beatMarker), // Save as JSON string
                subdivision: state.settings.subdivision,
                velocity: state.settings.velocity,
                acordes: JSON.stringify(state.chords || []), // Save Chords
                song_sections: JSON.stringify(state.settings.songSections || []), // Save Sections
                action: 'update'
            };

            await Promise.all([
                updateEstrofas(state.estrofas),
                cancionService.updateCancion(settingsPayload)
            ]);

            allSaveBtns.forEach(btn => {
                btn.classList.remove('opacity-50', 'cursor-not-allowed');
                btn.disabled = false;
                btn.classList.add('text-green-400'); // Valid visual feedback for icon-only btns
                if (btn.dataset.originalText) {
                    const span = btn.querySelector('span');
                    if (span) span.textContent = 'OK';
                }
                setTimeout(() => {
                    btn.classList.remove('text-green-400');
                    if (btn.dataset.originalText) {
                        const span = btn.querySelector('span');
                        if (span) span.textContent = btn.dataset.originalText;
                    }
                }, 2000);
            });

        } catch (e) { alert('Error al guardar: ' + e.message); }
    };

    const btnSave = document.getElementById('btn-save-sync');
    if (btnSave) btnSave.onclick = () => saveAction(btnSave);

    const btnSaveMobile = document.getElementById('btn-save-sync-mobile');
    if (btnSaveMobile) btnSaveMobile.onclick = () => saveAction(btnSaveMobile);

    // --- TOGGLE DISPLAY AREA (Mobile) ---
    const btnToggleDisplay = document.getElementById('toggle-display-btn');
    const displayArea = document.getElementById('active-verse-display');
    const toggleIcon = document.getElementById('icon-toggle-display');

    if (btnToggleDisplay && displayArea) {
        btnToggleDisplay.onclick = () => {
            const isHidden = displayArea.classList.contains('max-[820px]:hidden');

            if (isHidden) {
                // Show it
                displayArea.classList.remove('max-[820px]:hidden');
                displayArea.classList.add('flex'); // Ensure it flexes

                // Icon state: Collapse
                toggleIcon.classList.add('rotate-180');
                btnToggleDisplay.classList.add('bg-white/10', 'text-white');
            } else {
                // Hide it
                displayArea.classList.add('max-[820px]:hidden');
                displayArea.classList.remove('flex');

                // Icon state: Expand
                toggleIcon.classList.remove('rotate-180');
                btnToggleDisplay.classList.remove('bg-white/10', 'text-white');
            }
        };
    }

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



    // Refresh layout on window resize to ensure timeline fills width
    window.addEventListener('resize', () => {
        actions.refresh();
    });
}
