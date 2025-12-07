import { agregarAcordeSincronizado, getAcordesSincronizados } from '../services/chordService.js';

export function setupDragDrop(state, renderCallbacks) {
    const { currentSong, estrofas, zoomLevel } = state;
    const { renderTimeline, renderLyrics } = renderCallbacks;
    let draggedChord = null;

    // Sidebar Drag Start
    document.querySelectorAll('.draggable-chord').forEach(el => {
        el.addEventListener('dragstart', (e) => {
            draggedChord = {
                id_acorde: el.dataset.id,
                nombre: el.dataset.name,
                color: el.dataset.color
            };
            e.dataTransfer.setData('text/plain', JSON.stringify(draggedChord));
            e.dataTransfer.effectAllowed = 'copy';
        });
    });

    // Timeline Drop
    const track = document.getElementById('track-chords');
    if (track) {
        track.ondragover = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; };
        track.ondrop = async (e) => {
            e.preventDefault();
            if (!draggedChord) return;
            const rect = track.getBoundingClientRect();
            const scrollLeft = document.getElementById('timeline-tracks').scrollLeft;
            const time = e.offsetX / zoomLevel;

            try {
                await agregarAcordeSincronizado({
                    id_cancion: currentSong.id_cancion,
                    id_acorde: draggedChord.id_acorde,
                    tiempo_inicio: time,
                    tiempo_fin: time + 2.0
                });
                // Update state and re-render
                state.acordesSincronizados = await getAcordesSincronizados(currentSong.id_cancion);
                renderTimeline();
                renderLyrics();
            } catch (error) { console.error(error); }
        };
    }

    // Lyrics Drop
    document.querySelectorAll('.mini-timeline-tracks').forEach(track => {
        const estrofaId = track.dataset.estrofaId;
        const estrofa = estrofas.find(e => e.id_estrofa == estrofaId);
        if (!estrofa) return;

        track.ondragover = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; };
        track.ondrop = async (e) => {
            e.preventDefault();
            if (!draggedChord) return;
            const rect = track.getBoundingClientRect();
            const percentage = e.clientX - rect.left / rect.width;
            const estrofaDuration = parseFloat(estrofa.tiempo_fin) - parseFloat(estrofa.tiempo_inicio);
            const dropTime = parseFloat(estrofa.tiempo_inicio) + (percentage * estrofaDuration);

            try {
                await agregarAcordeSincronizado({
                    id_cancion: currentSong.id_cancion,
                    id_acorde: draggedChord.id_acorde,
                    tiempo_inicio: dropTime,
                    tiempo_fin: dropTime + 2.0
                });
                state.acordesSincronizados = await getAcordesSincronizados(currentSong.id_cancion);
                renderLyrics();
                renderTimeline();
            } catch (error) { console.error(error); }
        };
    });
}
