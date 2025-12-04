<<<<<<< HEAD
import { PlayerHeader } from '../components/player/PlayerHeader.js';
import { PlayerControls } from '../components/player/PlayerControls.js';
import { LyricsPanel } from '../components/editor/LyricsPanel.js';
import { ChordsPanel } from '../components/editor/ChordsPanel.js';
import { initPlayer } from '../components/player/PlayerController.js';

export function PlayerPage(id) {
    // Initialization
    setTimeout(() => initPlayer(id), 0);

    return `
        <div class="player-page-container h-[calc(100vh-64px)] flex flex-col overflow-hidden relative">
            ${PlayerHeader()}

            <!-- Main Content Area -->
            <main class="flex-1 flex flex-col relative overflow-hidden min-h-0">
                <!-- Content Panels (Lyrics, Chords) -->
                <div class="flex-1 flex relative overflow-hidden min-h-0">
                    ${ChordsPanel(false)} <!-- Default Hidden -->
                    ${LyricsPanel()}
                </div>

                <!-- Controls -->
                <div class="shrink-0 z-20 w-full">
                    ${PlayerControls(id, false)}
                </div>
            </main>
        </div>
    `;
=======
import { getCancion } from '../services/cancionService.js';
import { getEstrofas } from '../services/estrofaService.js';
import { CONTENT_BASE_URL } from '../config.js';
import { PlayerHeader } from '../components/PlayerHeader.js';
import { PlayerControls } from '../components/PlayerControls.js';
import { LyricsPanel } from '../components/LyricsPanel.js';
import { ChordsPanel } from '../components/ChordsPanel.js';
import { StrummingPanel } from '../components/StrummingPanel.js';

let audio = null;
let isPlaying = false;
let currentSong = null;
let showChords = true; // Piano toggle state

export function PlayerPage(id) {
    // Reset state on new load
    if (audio) {
        audio.pause();
        audio = null;
    }
    isPlaying = false;
    currentSong = null;

    // Initial Skeleton/Loading UI
    const html = `
        <div class="player-page-container h-screen flex flex-col bg-gray-900 text-white overflow-hidden relative">
            ${PlayerHeader()}

            <!-- Main Content Area -->
            <main class="flex-1 flex relative">
                ${ChordsPanel(showChords)}
                ${LyricsPanel()}
                ${StrummingPanel()}
            </main>

            ${PlayerControls(id, showChords)}
        </div>
    `;

    // Fetch Data & Init Audio
    setTimeout(async () => {
        try {
            const song = await getCancion(id);
            const estrofas = await getEstrofas(id);
            currentSong = { ...song, estrofas }; // Combine data
            initAudio(currentSong);
            updateUI(currentSong);
        } catch (error) {
            console.error(error);
            document.getElementById('lyrics-container').innerHTML = `<p class="text-red-500">Error al cargar la canción.</p>`;
        }
    }, 0);

    return html;
}

function initAudio(song) {
    audio = new Audio();

    // Construct path
    const path = song.ruta_mp3.startsWith('http')
        ? song.ruta_mp3
        : `${CONTENT_BASE_URL}/${song.ruta_mp3}`;

    audio.src = path;

    // Events
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
        document.getElementById('total-time').textContent = formatTime(audio.duration);
    });
    audio.addEventListener('ended', () => {
        isPlaying = false;
        updatePlayButton();
    });

    // Controls
    const btnPlay = document.getElementById('btn-play');
    btnPlay.onclick = togglePlay;

    const progressBar = document.getElementById('progress-bar');
    progressBar.onclick = (e) => {
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pos * audio.duration;
    };

    // Toggle Chords
    const btnChords = document.getElementById('btn-toggle-chords');
    btnChords.onclick = () => {
        showChords = !showChords;
        const panel = document.getElementById('chords-panel');
        if (showChords) {
            panel.classList.remove('opacity-0');
            panel.classList.add('opacity-100');
            btnChords.classList.add('text-green-400');
        } else {
            panel.classList.remove('opacity-100');
            panel.classList.add('opacity-0');
            btnChords.classList.remove('text-green-400');
        }
    };
}

function updateUI(song) {
    const container = document.getElementById('lyrics-container');

    if (!song.estrofas || song.estrofas.length === 0) {
        container.innerHTML = `
            <div class="text-gray-400 text-lg flex flex-col items-center">
                <p class="mb-4 text-xl font-semibold text-gray-500">No hay letras disponibles</p>
                <a href="#/songeditor/${song.id_cancion}" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition">
                    Edita esta canción para añadir las lyrics
                </a>
            </div>
        `;
    } else {
        // Render lyrics from estrofas
        const lyricsHtml = song.estrofas.map(estrofa => `
            <div class="mb-8 transition-opacity duration-500 hover:opacity-100 opacity-80">
                <p class="text-white text-2xl font-bold leading-relaxed whitespace-pre-line">${estrofa.contenido}</p>
            </div>
        `).join('');
        container.innerHTML = lyricsHtml;
    }
}

function togglePlay() {
    if (!audio) return;
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
    isPlaying = !isPlaying;
    updatePlayButton();
}

function updatePlayButton() {
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    if (isPlaying) {
        iconPlay.classList.add('hidden');
        iconPause.classList.remove('hidden');
    } else {
        iconPlay.classList.remove('hidden');
        iconPause.classList.add('hidden');
    }
}

function updateProgress() {
    if (!audio) return;

    const progressFill = document.getElementById('progress-fill');
    const progressHandle = document.getElementById('progress-handle');
    const currentTimeEl = document.getElementById('current-time');

    if (!progressFill || !progressHandle || !currentTimeEl) return;

    const current = audio.currentTime;
    const duration = audio.duration || 1;
    const percent = (current / duration) * 100;

    progressFill.style.width = `${percent}%`;
    progressHandle.style.left = `${percent}%`;
    currentTimeEl.textContent = formatTime(current);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
>>>>>>> c82b7bf (feat(likes): Implementada funcionalidad de likes y rediseño de tarjetas. Actualizado project_structure.json)
}
