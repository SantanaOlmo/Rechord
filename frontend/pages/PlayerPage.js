import { getCancion } from '../services/cancionService.js';
import { getEstrofas } from '../services/estrofaService.js';
import { CONTENT_BASE_URL } from '../config.js';
import { PlayerHeader } from '../components/player/PlayerHeader.js';
import { PlayerControls, attachPlayerControlsEvents } from '../components/player/PlayerControls.js';
import { LyricsPanel } from '../components/editor/LyricsPanel.js';
import { ChordsPanel } from '../components/editor/ChordsPanel.js';
import { StrummingPanel } from '../components/editor/StrummingPanel.js';

import { audioService } from '../services/audioService.js';

let isPlaying = false;
let currentSong = null;
let showChords = false; // Piano toggle state
window.isDraggingProgress = false;

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
        <div class="player-page-container h-[calc(100vh-64px)] flex flex-col overflow-hidden relative">
            ${PlayerHeader()}

            <!-- Main Content Area: Flex Column to hold Panels + Controls -->
            <main class="flex-1 flex flex-col relative overflow-hidden min-h-0">
                <!-- Content Panels (Lyrics, Chords, etc) - Flex 1 to take available space -->
                <div class="flex-1 flex relative overflow-hidden min-h-0">
                    ${ChordsPanel(showChords)}
                    ${LyricsPanel()}
                </div>

                <!-- Controls fixed at bottom of Main -->
                <div class="shrink-0 z-20 w-full">
                    ${PlayerControls(id, showChords)}
                </div>
            </main>
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

    // Auto-play on load
    audio.play().catch(e => console.log('Autoplay blocked:', e));

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

    // Unified Progress Bar Interaction (Click + Drag)
    const progressBar = document.getElementById('progress-bar');
    let isDragging = false;

    if (progressBar) {
        const updateDrag = (e) => {
            const rect = progressBar.getBoundingClientRect();
            const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

            // Update Visuals immediately
            const progressFill = document.getElementById('progress-fill');
            const progressHandle = document.getElementById('progress-handle');
            if (progressFill) progressFill.style.width = `${pos * 100}%`;
            if (progressHandle) progressHandle.style.left = `${pos * 100}%`;

            return pos;
        };

        const onDragEnd = (e) => {
            isDragging = false;
            const pos = updateDrag(e);
            audio.currentTime = pos * audio.duration;
            document.removeEventListener('mousemove', updateDrag);
            document.removeEventListener('mouseup', onDragEnd);
        };

        progressBar.onmousedown = (e) => {
            isDragging = true;
            updateDrag(e); // Allow click-to-seek start
            document.addEventListener('mousemove', updateDrag);
            document.addEventListener('mouseup', onDragEnd);
        };
    }

    // Toggle Chords
    const btnChords = document.getElementById('btn-toggle-chords');
    if (btnChords) {
        btnChords.onclick = () => {
            showChords = !showChords;
            const panel = document.getElementById('chords-panel');
            if (showChords) {
                panel.classList.remove('hidden', 'opacity-0');
                panel.classList.add('opacity-100');
                btnChords.classList.add('text-green-400');
            } else {
                panel.classList.remove('opacity-100');
                panel.classList.add('hidden', 'opacity-0');
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
        const lyricsHtml = song.estrofas.map((estrofa, index) => `
            <div id="stanza-${index}" class="lyric-stanza mb-12 transition-all duration-500 ease-out opacity-30 transform scale-100 origin-center cursor-pointer hover:opacity-60"
                 onclick="const audio = audioService.getInstance(); audio.currentTime = ${estrofa.tiempo_inicio};">
                <p class="leading-relaxed whitespace-pre-line transition-all duration-200 font-bold" style="font-size: var(--lyrics-font-size, 24px);">${estrofa.contenido}</p>
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

    // Don't update visual bar while user is dragging
    // Need to access isDragging from scope or make it global/module level
    // Implementing module-level isDragging variable at top
    if (window.isDraggingProgress) return;

    const current = audio.currentTime;
    const duration = audio.duration || 1;
    const percent = (current / duration) * 100;

    progressFill.style.width = `${percent}%`;
    progressHandle.style.left = `${percent}%`;
    currentTimeEl.textContent = formatTime(current);

    highlightLyrics(current);
}

function highlightLyrics(currentTime) {
    if (!currentSong || !currentSong.estrofas) return;

    const lyricsContainer = document.getElementById('lyrics-container');
    const stanzas = lyricsContainer.querySelectorAll('.lyric-stanza');
    let activeIndex = -1;

    // Find active stanza
    currentSong.estrofas.forEach((estrofa, index) => {
        const start = parseFloat(estrofa.tiempo_inicio);
        const end = parseFloat(estrofa.tiempo_fin);

        if (currentTime >= start && currentTime < end) {
            activeIndex = index;
        }
    });

    // Update Styles & Scroll
    stanzas.forEach((stanza, index) => {
        if (index === activeIndex) {
            // Active Style
            stanza.classList.remove('opacity-30', 'scale-100');
            stanza.classList.add('opacity-100', 'scale-105', 'text-white', 'font-bold');

            // Scroll to Center
            // Only scroll if we changed active index to avoid jitter, requires tracking previous index
            // But simple implementation: check if it's already centered?
            // Let's use behavior smooth
            const containerCenter = lyricsContainer.clientHeight / 2;
            const stanzaCenter = stanza.offsetTop + (stanza.clientHeight / 2);

            // We want to scroll container so that stanzaCenter is at containerCenter
            // container.scrollTop = stanza.offsetTop - (container.clientHeight / 2) + (stanza.clientHeight / 2)
            // But stanza.offsetTop is relative to parent if positioned? 
            // Better: stanza.getBoundingClientRect().top relative to container

            // Simple approach:
            // lyricsContainer.scrollTo({
            //     top: stanza.offsetTop - lyricsContainer.clientHeight / 2 + stanza.clientHeight / 2,
            //     behavior: 'smooth'
            // });

            // To avoid constant scrolling calls, we can check if it's already near center?
            // Or just call it, smooth behavior handles it well usually.

            // BUT: scrollIntoView with block: center is easiest
            // stanza.scrollIntoView({ behavior: 'smooth', block: 'center' }); // This moves the whole page sometimes if not careful

            // Manual calculation is safer for nested overflow
            const targetScrollToken = stanza.offsetTop - (lyricsContainer.clientHeight / 2) + (stanza.clientHeight / 2);
            // Check distance to avoid micro-scrolls
            if (Math.abs(lyricsContainer.scrollTop - targetScrollToken) > 10) {
                lyricsContainer.scrollTo({
                    top: targetScrollToken,
                    behavior: 'smooth'
                });
            }

        } else {
            // Inactive Style
            stanza.classList.remove('opacity-100', 'scale-105', 'text-white', 'font-bold');
            stanza.classList.add('opacity-30', 'scale-100');
        }
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
