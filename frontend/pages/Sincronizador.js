import { getAcordesSincronizados } from '../services/chordService.js';
import { getCancion } from '../services/cancionService.js';
import { getEstrofas } from '../services/estrofaService.js';
import { getAcordes } from '../services/acordeService.js';
import { CONTENT_BASE_URL } from '../config.js';
import { audioService } from '../services/audioService.js';

// Components
import { EditorSidebar } from '../components/editor/EditorSidebar.js';
import { EditorToolsPanel } from '../components/editor/EditorToolsPanel.js';
import { EditorLyrics } from '../components/editor/EditorLyrics.js';
import { EditorTimeline } from '../components/editor/EditorTimeline.js';
import { EditorControls } from '../components/editor/EditorControls.js';
import { EditorSearchModal } from '../components/editor/EditorSearchModal.js';
import { setupDragDrop } from '../helpers/editorDragDrop.js';

// State
let state = {
    currentSong: null,
    estrofas: [],
    acordesSincronizados: [],
    acordesDisponibles: [],
    zoomLevel: 100,
    activeTab: 'chords',
    audioBuffer: null
};

export function render(songId = null) {
    // Default tab logic
    if (!state.estrofas || state.estrofas.length === 0) state.activeTab = 'lyrics';
    else state.activeTab = 'chords';

    return `
        <div class="editor-container h-screen w-screen flex bg-gray-900 text-white overflow-hidden">
            ${EditorSidebar(state.activeTab)}
            <div class="flex-1 flex overflow-hidden">
                ${EditorToolsPanel(state.activeTab, state.estrofas, state.acordesDisponibles)}
                <main class="flex-1 flex flex-col relative bg-gray-900">
                    ${EditorLyrics(state.estrofas, state.acordesSincronizados)}
                    ${EditorTimeline(state.acordesSincronizados, state.zoomLevel, audioService.getInstance().duration || 180)}
                    ${EditorControls(audioService.isPlaying(), audioService.getInstance().currentTime, audioService.getInstance().duration, state.zoomLevel)}
                </main>
            </div>
            ${EditorSearchModal()}
        </div>
    `;
}

export async function initEditor(songId) {
    try {
        const [song, estrofas, acordes, sincronizados] = await Promise.all([
            getCancion(songId), getEstrofas(songId), getAcordes(), getAcordesSincronizados(songId)
        ]);
        state = { ...state, currentSong: song, estrofas, acordesDisponibles: acordes, acordesSincronizados: sincronizados };

        // Audio Setup
        const audio = audioService.getInstance();
        const path = song.ruta_mp3.startsWith('http') ? song.ruta_mp3 : `${CONTENT_BASE_URL}/${song.ruta_mp3}`;
        if (audioService.currentUrl !== path) audioService.play(path); // Auto play or just load? Service handles it.

        // Waveform
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const response = await fetch(path);
        state.audioBuffer = await audioContext.decodeAudioData(await response.arrayBuffer());

        // Render Waveform (Canvas needs DOM)
        drawWaveform();

    } catch (e) { console.error(e); }
}

export function attachEditorEvents() {
    const songId = location.hash.split('/').pop();
    if (songId) initEditor(songId).then(() => {
        // Re-render to show data
        document.querySelector('#app-root').innerHTML = render(songId);
        attachListeners();
    });

    window.switchTab = (tab) => {
        state.activeTab = tab;
        document.querySelector('#app-root').innerHTML = render(songId);
        attachListeners();
        drawWaveform();
    };
}

function attachListeners() {
    const audio = audioService.getInstance();

    // Play/Pause
    document.getElementById('btn-play-pause')?.addEventListener('click', () => {
        if (audio.paused) audio.play(); else audio.pause();
        document.querySelector('#app-root').innerHTML = render(state.currentSong.id_cancion); // Re-render for icon update? Efficient? No.
        // Better: just toggle icon classes
        attachListeners(); // Re-attach if we re-render
    });

    // Zoom
    document.getElementById('zoom-slider')?.addEventListener('input', (e) => {
        state.zoomLevel = parseInt(e.target.value);
        document.getElementById('timeline-tracks').innerHTML = EditorTimeline(state.acordesSincronizados, state.zoomLevel, audio.duration);
        drawWaveform();
    });

    // Drag & Drop
    setupDragDrop(state, {
        renderTimeline: () => document.getElementById('timeline-tracks').innerHTML = EditorTimeline(state.acordesSincronizados, state.zoomLevel, audio.duration),
        renderLyrics: () => document.getElementById('lyrics-area').innerHTML = EditorLyrics(state.estrofas, state.acordesSincronizados)
    });
}

function drawWaveform() {
    const canvas = document.getElementById('waveform-canvas');
    if (!canvas || !state.audioBuffer) return;
    const ctx = canvas.getContext('2d');
    const width = state.audioBuffer.duration * state.zoomLevel;
    canvas.width = width;
    canvas.height = 100;
    // ... Drawing logic (simplified for brevity, should be in helper or component)
    // For now, just a placeholder or move drawing logic to helper
}
