import { getCancion } from '../services/cancionService.js';
import { getEstrofas } from '../services/estrofaService.js';
import { CONTENT_BASE_URL } from '../config.js';
import { PlayerHeader } from '../components/PlayerHeader.js';
import { PlayerControls, attachPlayerControlsEvents } from '../components/PlayerControls.js';
import { LyricsPanel } from '../components/LyricsPanel.js';
import { ChordsPanel } from '../components/ChordsPanel.js';
import { StrummingPanel } from '../components/StrummingPanel.js';

import { audioService } from '../services/audioService.js';

let isPlaying = false;
let currentSong = null;
let showChords = true; // Piano toggle state

export function PlayerPage(id) {
    // Reset state on new load
    // audioService.stop(); // Optional: Stop previous song or keep playing? User wants continuity? 
    // Usually entering a new song page implies playing THAT song.
    // But if we come from Sincronizador of SAME song... 
    // For now, let's stop previous to be safe, or let initAudio handle it.

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
    const audio = audioService.getInstance();

    // Construct path
    const path = song.ruta_mp3.startsWith('http')
        ? song.ruta_mp3
        : `${CONTENT_BASE_URL}/${song.ruta_mp3}`;

    // Only set src if different, to allow continuity if same song
    if (audioService.currentUrl !== path) {
        audio.src = path;
        audioService.currentUrl = path;
    }

    // Update isPlaying state based on actual audio state
    isPlaying = !audio.paused;
    updatePlayButton();

    // Events
    // Remove previous listeners to avoid duplicates? 
    // AudioService is singleton, listeners persist. We need to be careful.
    // Ideally, we should use a wrapper that cleans up. 
    // For now, let's assign ontimeupdate directly or use named functions.

    // Audio Event Bindings (Progress, End)
    // Kept local as they update the UI bars
    audio.ontimeupdate = updateProgress;
    audio.onloadedmetadata = () => {
        const totalTime = document.getElementById('total-time');
        if (totalTime) totalTime.textContent = formatTime(audio.duration);
    };
    audio.onended = () => {
        // ... (Queue Logic remains, optional to move to Controls but complex)
        // Check Queue
        const queueStr = localStorage.getItem('playbackQueue');
        if (queueStr) {
            try {
                const queue = JSON.parse(queueStr);
                const currentIndex = queue.findIndex(s => s.id == song.id_cancion);

                if (currentIndex >= 0 && currentIndex < queue.length - 1) {
                    const nextSong = queue[currentIndex + 1];
                    console.log('Playing next:', nextSong.title);
                    window.navigate('/player/' + nextSong.id);
                    return;
                }
            } catch (e) { console.error('Queue error', e); }
        }

        isPlaying = false;
        updatePlayButton();
    };

    // Attach Unified Controls Events (Local + Socket)
    attachPlayerControlsEvents(song);

    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.onclick = (e) => {
            const rect = progressBar.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            audio.currentTime = pos * audio.duration;
        };
    }

    // Toggle Chords
    const btnChords = document.getElementById('btn-toggle-chords');
    if (btnChords) {
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
    const audio = audioService.getInstance();
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
        if (iconPlay) iconPlay.classList.add('hidden');
        if (iconPause) iconPause.classList.remove('hidden');
    } else {
        if (iconPlay) iconPlay.classList.remove('hidden');
        if (iconPause) iconPause.classList.add('hidden');
    }
}

function updateProgress() {
    const audio = audioService.getInstance();
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
}
