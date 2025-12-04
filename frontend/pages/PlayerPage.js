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
            <!-- Header -->
            <header class="absolute top-0 left-0 w-full p-4 z-10 flex items-center">
                <a href="#/" class="text-white hover:text-green-400 transition">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                </a>
            </header>

            <!-- Main Content Area -->
            <main class="flex-1 flex relative">
                
                <!-- Left: Chords (Piano/Guitar diagrams) -->
                <div id="chords-panel" class="w-1/4 p-6 flex flex-col items-center justify-center transition-opacity duration-300 ${showChords ? 'opacity-100' : 'opacity-0'}">
                    <!-- Placeholder for dynamic chords -->
                    <div class="chord-box bg-green-800/50 p-4 rounded-xl mb-4 border-2 border-green-500">
                        <h3 class="text-2xl font-bold text-green-300 text-center mb-2">Cm</h3>
                        <div class="w-24 h-24 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-500">
                            (Diagrama)
                        </div>
                    </div>
                </div>

                <!-- Center: Lyrics -->
                <div class="w-2/4 flex flex-col items-center justify-center p-4">
                    <div id="lyrics-container" class="text-center space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar mask-image-gradient">
                        <!-- Placeholder Lyrics -->
                        <p class="text-gray-500 text-xl">Cargando canción...</p>
                    </div>
                </div>

                <!-- Right: Strumming Patterns -->
                <div class="w-1/4 p-6 flex flex-col items-center justify-center">
                    <div class="strumming-box opacity-50">
                        <div class="flex space-x-2 text-green-400 text-3xl">
                            <span>↓</span><span>↓</span><span class="opacity-50">↑</span><span>↓</span>
                        </div>
                    </div>
                </div>

            </main>

            <!-- Footer Controls -->
            <div class="bg-gray-900/90 backdrop-blur-md p-6 pb-8 border-t border-gray-800">
                
                <!-- Progress -->
                <div class="flex items-center space-x-4 mb-4">
                    <span id="current-time" class="text-xs text-gray-400 w-10 text-right">0:00</span>
                    <div class="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer group relative" id="progress-bar">
                        <div id="progress-fill" class="absolute top-0 left-0 h-full bg-green-500 rounded-full w-0"></div>
                        <div id="progress-handle" class="absolute top-1/2 -mt-1.5 h-3 w-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" style="left: 0%"></div>
                    </div>
                    <span id="total-time" class="text-xs text-gray-400 w-10">0:00</span>
                </div>

                <!-- Main Buttons -->
                <div class="flex items-center justify-between max-w-3xl mx-auto">
                    
                    <!-- Left Actions -->
                    <div class="flex items-center space-x-6">
                        <button class="text-gray-400 hover:text-white" title="Volver">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                        </button>
                        <button id="btn-font-size" class="text-gray-400 hover:text-white font-serif font-bold text-xl" title="Tamaño Letra">Aa</button>
                    </div>

                    <!-- Playback Controls -->
                    <div class="flex items-center space-x-8">
                        <button class="text-gray-400 hover:text-white">
                            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                        </button>
                        
                        <button id="btn-play" class="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-500 shadow-lg hover:scale-105 transition transform">
                            <svg id="icon-play" class="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            <svg id="icon-pause" class="w-8 h-8 hidden" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        </button>

                        <button class="text-gray-400 hover:text-white">
                            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                        </button>
                    </div>

                    <!-- Right Actions -->
                    <div class="flex items-center space-x-6">
                        <button id="btn-toggle-chords" class="text-gray-400 hover:text-green-400 ${showChords ? 'text-green-400' : ''}" title="Mostrar/Ocultar Acordes">
                            <!-- Piano Icon -->
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5.6 16H13v-9h1.4v9zm-2.8 0H10.2v-9h1.4v9zm-2.8 0H7.4v-9h1.4v9zm8.4 0h-1.4v-9h1.4v9z"/></svg>
                        </button>
                        <a href="#/sincronizador/${id}" class="text-gray-400 hover:text-white" title="Editar Canción">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </a>
                    </div>

                </div>
            </div>
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
