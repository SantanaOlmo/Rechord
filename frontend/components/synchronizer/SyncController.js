import { getCancion } from '../../services/cancionService.js';
import { getEstrofas } from '../../services/estrofaService.js';
import { audioService } from '../../services/audioService.js';
import { CONTENT_BASE_URL } from '../../config.js';
import { state } from './store.js';
import { renderTimeline, updatePlayIcon, renderHeaders, updateActiveVerse } from './rendering.js';
import { attachListeners, handleGlobalMouseMove, handleGlobalMouseUp } from './events.js';
import { formatMMSS, showErrorToast } from './utils.js';

export function attachEditorEvents() {
    const songId = location.hash.split('/').pop();
    if (songId) {
        init(songId);
    }
}

async function init(songId) {
    try {
        const [song, estrofas] = await Promise.all([getCancion(songId), getEstrofas(songId)]);
        state.song = song;

        // Prepare verses
        state.estrofas = estrofas.map((e, index) => {
            let start = parseFloat(e.tiempo_inicio);
            let end = parseFloat(e.tiempo_fin);
            return {
                ...e,
                id: index,
                tiempo_inicio: start,
                tiempo_fin: end
            };
        });

        const allZero = state.estrofas.every(e => e.tiempo_inicio === 0 && e.tiempo_fin === 0);
        if (allZero && state.estrofas.length > 0) {
            let currentTime = 0;
            state.estrofas.forEach(e => {
                e.tiempo_inicio = currentTime;
                e.tiempo_fin = currentTime + 4;
                currentTime += 4.5;
            });
        }

        const audio = audioService.getInstance();
        const path = song.ruta_mp3.startsWith('http') ? song.ruta_mp3 : `${CONTENT_BASE_URL}/${song.ruta_mp3}`;
        if (audioService.currentUrl !== path) {
            audio.src = path;
        }

        const finishSetup = () => {
            setupZoom(audio.duration || song.duracion || 180);
            renderHeaders();
            renderTimeline();
            attachListeners();
            startRenderLoopInContext();
        };

        if (audio.readyState >= 1) {
            finishSetup();
        } else {
            audio.onloadedmetadata = () => finishSetup();
        }

        state.isPlaying = !audio.paused;
        updatePlayIcon();

    } catch (e) {
        console.error(e);
        showErrorToast('Error cargando el editor: ' + e.message);
    }
}

function setupZoom(duration) {
    if (!duration) duration = 180;
    const trackArea = document.getElementById('timeline-scroll-area');
    const availableWidth = trackArea ? trackArea.clientWidth : window.innerWidth - 200;
    state.minZoom = availableWidth / duration;
    state.zoom = Math.max(state.minZoom, 10);
    renderTimeline();
}

function startRenderLoopInContext() {
    const audio = audioService.getInstance();
    const loop = () => {
        if (!document.getElementById('timeline-container')) {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
            return;
        }

        const currentTime = audio.currentTime;
        const timeDisplay = document.getElementById('global-time');
        if (timeDisplay) timeDisplay.textContent = formatMMSS(currentTime, true);

        const playhead = document.getElementById('playhead');
        if (playhead) {
            const px = currentTime * state.zoom;
            playhead.style.left = `${px}px`;
        }

        if (state.isPlaying) {
            updateActiveVerse(currentTime);
        }

        requestAnimationFrame(loop);
    };
    loop();
}
