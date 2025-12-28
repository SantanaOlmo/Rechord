import { getCancion } from '../../services/cancionService.js';
import { getEstrofas } from '../../services/estrofaService.js';
import { audioService } from '../../services/audioService.js';
import { CONTENT_BASE_URL } from '../../config.js';
import { state, actions } from './store.js';
import { renderTimeline, updatePlayIcon, renderHeaders, updateActiveVerse, ensurePlayheadVisible, updatePreview } from './rendering.js';
import { attachListeners, handleGlobalMouseMove, handleGlobalMouseUp } from './events.js';
import { formatMMSS, showErrorToast } from './utils.js';
import { SettingsLogic } from '../editor/SettingsLogic.js'; // Ensure correct path
import { EditorSidebarLogic } from '../editor/EditorSidebarLogic.js';
import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js';

import { MarkerInteraction } from './events/MarkerInteraction.js';

export function attachEditorEvents() {
    // Top Level Listener for Timeline Interaction (Delegation)
    const timelineContainer = document.getElementById('timeline-container');
    if (timelineContainer) {
        timelineContainer.addEventListener('mousedown', (e) => {
            // 1. Try Marker Interaction first
            if (MarkerInteraction.handleMouseDown(e)) return;

            // 2. Try Header Resize/Drag
            // ... existing logic in other files ...
        }, true); // Use Capture to ensure we get the event before children stop propagation
    }


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

        // Initialize Settings from Song Data
        state.settings.tempo = parseInt(song.bpm) || 120;
        state.settings.timeSignature.num = parseInt(song.metrica_numerador) || 4;
        state.settings.timeSignature.den = parseInt(song.metrica_denominador) || 4;

        // Load Chords
        try {
            state.chords = song.acordes ? (typeof song.acordes === 'string' ? JSON.parse(song.acordes) : song.acordes) : [];
        } catch (e) {
            console.warn('Failed to parse chords:', e);
            state.chords = [];
        }

        // Multi-Section Grid Support
        let markers = [];
        if (song.beat_marker) {
            if (typeof song.beat_marker === 'string' && song.beat_marker.trim().startsWith('[')) {
                try {
                    markers = JSON.parse(song.beat_marker);
                } catch (e) {
                    console.warn('Failed to parse beat_marker JSON:', e);
                }
            } else {
                // Legacy: Single float value -> One open region
                const val = parseFloat(song.beat_marker);
                if (val > 0) {
                    markers = [{ start: val, end: song.duracion || 180 }];
                }
            }
        }
        state.settings.beatMarker = markers;

        // Load Song Sections
        if (song.song_sections && Array.isArray(song.song_sections)) {
            state.settings.songSections = song.song_sections.map(s => ({
                id: s.id, // Database ID
                label: s.label,
                start: parseFloat(s.start_time || s.start),
                end: parseFloat(s.end_time || s.end),
                chords: s.chords || []
            }));
        } else {
            state.settings.songSections = [];
        }

        state.settings.subdivision = song.subdivision || '1/4';
        state.settings.velocity = parseInt(song.velocity) || 100;


        const audio = audioService.getInstance();
        const path = song.ruta_mp3.startsWith('http') ? song.ruta_mp3 : `${CONTENT_BASE_URL}/${song.ruta_mp3}`;
        if (audioService.currentUrl !== path) {
            audio.src = path;
        }

        const finishSetup = () => {
            // Auto-collapse empty tracks
            // Audio always open. Lyrics open if has verses. Others closed by default for now.
            state.trackState.audio.collapsed = false;
            state.trackState.lyrics.collapsed = state.estrofas.length === 0;
            state.trackState.strumming.collapsed = true; // No data yet
            state.trackState.chords.collapsed = true;    // No data yet
            state.trackState.tabs.collapsed = true;      // No data yet

            // Populate Song Info in Playback Bar
            const imgEl = document.getElementById('playback-song-img');
            const titleEl = document.getElementById('playback-song-title');
            const artistEl = document.getElementById('playback-song-artist');

            if (imgEl && song.ruta_imagen) {
                const imgPath = song.ruta_imagen.startsWith('http')
                    ? song.ruta_imagen
                    : `${CONTENT_BASE_URL}/${song.ruta_imagen}`;
                imgEl.src = imgPath;
            }
            if (titleEl) titleEl.textContent = song.titulo || 'Sin título';
            if (artistEl) artistEl.textContent = song.artista || 'Desconocido';


            setupZoom(audio.duration || song.duracion || 180);
            renderHeaders();
            renderTimeline();
            attachListeners();
            EditorSidebarLogic.init();

            // Initialize WaveSurfer (Visual Only, synced to AudioService)
            const wsContainer = document.getElementById('waveform-container');
            if (wsContainer) {
                state.wavesurfer = WaveSurfer.create({
                    container: wsContainer,
                    waveColor: '#ffffff', // Pure White
                    progressColor: '#4f46e5', // Indigo-600
                    cursorColor: 'transparent', // We have our own playhead
                    height: 96,
                    barWidth: 2,
                    interact: false, // Prevent seek fighting, we handle clicks on timeline
                    backend: 'MediaElement', // IMPORTANT: Syncs with media element
                    media: audio, // The native Audio object from audioService
                    minPxPerSec: state.zoom, // Sync Zoom
                    fillParent: true,
                    autoScroll: false // We handle scroll
                });
            }


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

    // Fit entire song in view
    state.minZoom = availableWidth / duration;
    state.zoom = state.minZoom; // Force full view initially


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

            // Auto-scroll (Paging)
            const scrollArea = document.getElementById('timeline-scroll-area');
            if (scrollArea && state.isPlaying) {
                const containerWidth = scrollArea.clientWidth;
                const scrollLeft = scrollArea.scrollLeft;

                // If playhead goes beyond right edge
                // We want to scroll so playhead appears at left edge (or close to it)
                if (px > scrollLeft + containerWidth) {
                    scrollArea.scrollLeft = px - 20; // 20px padding
                }

                // Optional: If playhead goes behind left edge (e.g. seeking back or loop)
                // scrollArea.scrollLeft = px - 20;
            }

        }

        if (state.isPlaying) {
            updateActiveVerse(currentTime);
        }

        // Update Beat Marker UI (Button State changes based on Playhead position)
        const beatBtn = document.getElementById('setting-beat-marker-btn');
        const beatVal = document.getElementById('setting-beat-marker-val');
        if (beatBtn && beatVal) {
            SettingsLogic.updateUI(beatBtn, beatVal);
        }

        requestAnimationFrame(loop);
    };
    loop();
    // Link Actions
    let refreshPending = false;
    actions.refresh = () => {
        if (refreshPending) return;
        refreshPending = true;

        requestAnimationFrame(() => {
            renderTimeline();
            renderHeaders();
            updatePreview();
            updatePlayIcon();

            // Sync Wavesurfer Zoom
            if (state.wavesurfer && state.wavesurfer.getDuration() > 0) {
                try {
                    state.wavesurfer.zoom(state.zoom);
                } catch (e) {
                    // console.warn("WaveSurfer zoom failed:", e);
                }
            }
            refreshPending = false;
        });
    };

    actions.toggleTrack = (key) => {
        if (state.trackState[key]) {
            state.trackState[key].collapsed = !state.trackState[key].collapsed;
            actions.refresh();
        }
    };

    actions.moveTrack = (fromIndex, toIndex) => {
        if (fromIndex < 0 || fromIndex >= state.trackOrder.length || toIndex < 0 || toIndex >= state.trackOrder.length) return;

        // Remove from old index
        const item = state.trackOrder.splice(fromIndex, 1)[0];
        // Insert at new index
        state.trackOrder.splice(toIndex, 0, item);

        actions.refresh();
    };

    // Initial Render
    actions.refresh();

}
