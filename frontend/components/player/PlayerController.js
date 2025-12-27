import { audioService } from '../../services/audioService.js';
import { CONTENT_BASE_URL } from '../../config.js';
import { attachPlayerControlsEvents, updatePlayerMeta } from './PlayerControls.js';
import { renderLyrics, highlightLyrics } from './LyricsRenderer.js';
import { getCancion } from '../../services/cancionService.js';
import { getEstrofas } from '../../services/estrofaService.js';

let isPlaying = false;
let currentSong = null;
let showChords = false;

export async function initPlayer(songId) {
    try {
        showChords = false; // Reset chords visibility
        const song = await getCancion(songId);
        const estrofas = await getEstrofas(songId);
        currentSong = { ...song, estrofas };

        initAudio(currentSong);
        renderLyrics(currentSong);
        updatePlayerMeta(currentSong);
        setupUIEvents();
    } catch (error) {
        console.error(error);
        const el = document.getElementById('lyrics-container');
        if (el) el.innerHTML = `<p class="text-red-500">Error al cargar la canción.</p>`;
    }
}

function initAudio(song) {
    const audio = audioService.getInstance();
    const path = song.ruta_mp3.startsWith('http') ? song.ruta_mp3 : `${CONTENT_BASE_URL}/${song.ruta_mp3}`;

    if (audioService.currentUrl !== path) {
        audio.src = path;
        audioService.currentUrl = path;
    }

    audio.play().catch(e => console.log('Autoplay blocked:', e));
    isPlaying = !audio.paused;
    updatePlayButton();

    audio.ontimeupdate = updateProgress;
    audio.onloadedmetadata = () => {
        const totalTime = document.getElementById('total-time');
        if (totalTime) totalTime.textContent = formatTime(audio.duration);
    };
    audio.onended = handleSongEnd;

    attachPlayerControlsEvents(song);
    setupProgressBar(audio);
}

function handleSongEnd() {
    const queueStr = localStorage.getItem('playbackQueue');
    if (queueStr) {
        try {
            const queue = JSON.parse(queueStr);
            const idx = queue.findIndex(s => s.id == currentSong.id_cancion);
            if (idx >= 0 && idx < queue.length - 1) {
                window.navigate('/song/' + queue[idx + 1].id);
                return;
            }
        } catch (e) { console.error(e); }
    }
    isPlaying = false;
    updatePlayButton();
}

function updateProgress() {
    if (window.isDraggingProgress) return;
    const audio = audioService.getInstance();
    const current = audio.currentTime;
    const duration = audio.duration || 1;
    const percent = (current / duration) * 100;

    const fill = document.getElementById('progress-fill');
    const handle = document.getElementById('progress-handle');
    const timeEl = document.getElementById('current-time');

    if (fill) fill.style.width = `${percent}%`;
    if (handle) handle.style.left = `${percent}%`;
    if (timeEl) timeEl.textContent = formatTime(current);

    highlightLyrics(current, currentSong);
}

function setupProgressBar(audio) {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const updateDrag = (e) => {
            const rect = progressBar.getBoundingClientRect();
            const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

            const fill = document.getElementById('progress-fill');
            const handle = document.getElementById('progress-handle');
            if (fill) fill.style.width = `${pos * 100}%`;
            if (handle) handle.style.left = `${pos * 100}%`;
            return pos;
        };

        const onDragEnd = (e) => {
            window.isDraggingProgress = false;
            const pos = updateDrag(e);
            audio.currentTime = pos * audio.duration;
            document.removeEventListener('mousemove', updateDrag);
            document.removeEventListener('mouseup', onDragEnd);
        };

        progressBar.onmousedown = (e) => {
            window.isDraggingProgress = true;
            updateDrag(e);
            document.addEventListener('mousemove', updateDrag);
            document.addEventListener('mouseup', onDragEnd);
        };
    }
}

function setupUIEvents() {
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

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Only if Player Page is active
        if (!document.getElementById('player-page-container')) return;

        // Ignore inputs
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

        if (e.code === 'Space') {
            e.preventDefault(); // Prevent scroll
            const btnPlay = document.getElementById('btn-play');
            if (btnPlay) btnPlay.click();
        }
    });

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

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
