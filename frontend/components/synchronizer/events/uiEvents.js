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

        // 2. Post-layout frame (standard)
        requestAnimationFrame(() => {
            scrollArea.scrollLeft = Math.max(0, newScroll);
        });

        // 3. Post-task (fallback for heavy renders)
        setTimeout(() => {
            scrollArea.scrollLeft = Math.max(0, newScroll);
        }, 0);
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
    });
}

// Refresh layout on window resize to ensure timeline fills width
window.addEventListener('resize', () => {
    actions.refresh();
});
}
