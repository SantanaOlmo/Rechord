/**
 * Editor de Acordes Sincronizados para ReChord - UI Synchronizer
 */

import { getAcordesCancion, agregarAcorde, actualizarAcorde, eliminarAcorde } from '../services/acordeSincronizadoService.js';
import { getCancion } from '../services/cancionService.js';
import { getAcordes } from '../services/acordeService.js';

let audioContext = null;
let audioBuffer = null;
let audioElement = null;
let currentSong = null;
let acordesDisponibles = [];
let acordesSincronizados = [];
let zoomLevel = 1;
let isPlaying = false;

/**
 * Renderiza el editor con la nueva UI "Synchronizer"
 */
export function render(songId = null) {
    return `
        <div class="editor-container">
            <!-- Sidebar: Settings -->
            <aside class="editor-sidebar">
                
                <!-- Settings Group -->
                <div class="settings-group">
                    <!-- Tempo -->
                    <div class="setting-item">
                        <label class="setting-label">Tempo</label>
                        <input type="number" value="120" class="setting-input">
                    </div>

                    <!-- Métrica -->
                    <div class="setting-item">
                        <label class="setting-label">Métrica</label>
                        <div class="flex items-center gap-2">
                            <input type="number" value="4" class="setting-input-small">
                            <span class="text-gray-500">/</span>
                            <input type="number" value="4" class="setting-input-small">
                        </div>
                    </div>

                    <!-- Beat marker -->
                    <div class="setting-item">
                        <label class="setting-label">Beat marker</label>
                        <div class="w-20 h-8 bg-gray-900 rounded border border-gray-700"></div>
                    </div>

                    <!-- Snapping -->
                    <div class="setting-item">
                        <label class="setting-label">Snapping</label>
                        <input type="checkbox" checked class="setting-checkbox">
                    </div>

                    <!-- Grid -->
                    <div class="setting-item">
                        <label class="setting-label">Grid</label>
                        <input type="checkbox" class="setting-checkbox">
                    </div>

                    <!-- Subdivision -->
                    <div class="setting-item">
                        <label class="setting-label">Subdivision</label>
                        <select class="setting-select">
                            <option>1/4</option>
                            <option>1/8</option>
                            <option>1/16</option>
                        </select>
                    </div>

                    <!-- Velocity -->
                    <div class="setting-item">
                        <label class="setting-label">Velocity</label>
                        <div class="velocity-bar">
                            <div class="velocity-fill"></div>
                        </div>
                    </div>
                </div>

                <!-- Tools Icons (Vertical) -->
                <div class="sidebar-tools">
                    <button class="btn-tool">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                    </button>
                    <button class="btn-tool">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    </button>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="editor-main">
                
                <!-- Top Bar (Back) -->
                <div class="back-button-container">
                    <a href="#/" class="back-button">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"></path></svg>
                    </a>
                </div>

                <!-- Lyrics Display Area -->
                <div class="lyrics-area">
                    <!-- Example Lyrics (Static for now, dynamic later) -->
                    <div class="lyrics-block blur">
                        <p class="text-xl font-medium">ou oh oh</p>
                    </div>
                    
                    <div class="lyrics-block active">
                        <p class="lyrics-text-lg">Someone said you had</p>
                        <div class="chord-bar w-48">
                            <div class="chord-fill w-3/4"></div>
                        </div>
                        <p class="lyrics-text-xl">your tattooes removed</p>
                        <div class="chord-bar w-64">
                            <div class="chord-fill w-1/2"></div>
                        </div>
                    </div>

                    <div class="lyrics-block">
                        <p class="lyrics-text-blue">Saw you downtown</p>
                        <div class="chord-bar w-56">
                            <div class="chord-fill blue w-full"></div>
                        </div>
                        <p class="lyrics-text-blue">singing the blues</p>
                        <div class="chord-bar w-52">
                            <div class="chord-fill blue w-2/3"></div>
                        </div>
                    </div>

                    <div class="lyrics-block opacity-80">
                        <p class="text-2xl text-white">It's time to face the music</p>
                        <div class="chord-bar w-60"></div>
                        <p class="text-2xl text-white">I'm no longer your muse</p>
                        <div class="chord-bar w-56"></div>
                    </div>
                </div>

                <!-- Timeline & Waveform Area -->
                <div class="timeline-area">
                    
                    <!-- Timeline Tracks -->
                    <div class="timeline-tracks">
                        <!-- Track 1: Chords/Regions -->
                        <div class="track-row">
                            <div class="track-segment bg-red-500/80 w-32 rounded-l-lg"></div>
                            <div class="track-segment bg-yellow-500/80 w-24"></div>
                            <div class="track-segment bg-blue-500/80 w-12"></div>
                            <div class="track-segment bg-gray-600/50 flex-1 rounded-r-lg"></div>
                            
                            <!-- Playhead Line (Top part) -->
                            <div class="playhead-line"></div>
                        </div>

                        <!-- Track 2: Waveform -->
                        <div class="waveform-container">
                            <canvas id="waveform-canvas" class="w-full h-full opacity-80"></canvas>
                            
                            <!-- Playhead Line (Waveform part) -->
                            <div id="playhead" class="playhead-line">
                                <div class="playhead-knob"></div>
                            </div>
                        </div>
                        
                        <!-- Progress Bar Bottom -->
                        <div class="timeline-progress group">
                            <div class="timeline-progress-fill"></div>
                        </div>
                    </div>

                    <!-- Playback Controls -->
                    <div class="editor-controls">
                        <button class="btn-editor-secondary">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                        </button>
                        
                        <button class="btn-editor-secondary">
                            <span class="font-bold text-sm">Aa</span>
                        </button>

                        <button id="btn-play-pause" class="btn-editor-play">
                            <svg id="icon-play" class="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            <svg id="icon-pause" class="w-8 h-8 hidden" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        </button>

                        <button class="btn-editor-secondary">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h-2v5H6v2h2v5h2v-5h2v-2zm5 0h-2V7h-2v5h-2v2h2v5h2v-5h2v-2z"/></svg>
                        </button>

                        <button class="btn-editor-outline">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                        </button>
                    </div>

                    <!-- Hidden Audio Element -->
                    <audio id="audio-player" class="hidden"></audio>
                    <input type="file" id="audio-file-input" accept="audio/*" class="hidden">
                </div>
            </main>
        </div>
    `;
}

/**
 * Adjunta los event listeners
 */
export function attachEditorEvents() {
    const songId = getSongIdFromUrl();
    if (songId) {
        loadSongData(songId);
    }

    // Play/Pause
    const btnPlayPause = document.getElementById('btn-play-pause');
    const audioPlayer = document.getElementById('audio-player');

    if (btnPlayPause && audioPlayer) {
        btnPlayPause.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
            } else {
                audioPlayer.pause();
            }
        });

        audioPlayer.addEventListener('play', () => {
            isPlaying = true;
            document.getElementById('icon-play').classList.add('hidden');
            document.getElementById('icon-pause').classList.remove('hidden');
        });

        audioPlayer.addEventListener('pause', () => {
            isPlaying = false;
            document.getElementById('icon-play').classList.remove('hidden');
            document.getElementById('icon-pause').classList.add('hidden');
        });

        audioPlayer.addEventListener('timeupdate', updatePlayhead);
        audioPlayer.addEventListener('loadedmetadata', initializeEditor);
    }
}

function getSongIdFromUrl() {
    const hash = window.location.hash;
    const match = hash.match(/\/songeditor(?:\/(\d+)|[?&]id=(\d+))/);
    if (match) return parseInt(match[1] || match[2]);
    return null;
}

async function loadSongData(songId) {
    try {
        currentSong = await getCancion(songId);
        if (currentSong && currentSong.archivo_mp3) {
            const possiblePaths = [
                `../uploads/music/${currentSong.archivo_mp3}`,
                `../../uploads/music/${currentSong.archivo_mp3}`,
                `/rechord/uploads/music/${currentSong.archivo_mp3}`,
                `uploads/music/${currentSong.archivo_mp3}`
            ];
            const audio = document.getElementById('audio-player');
            if (audio) audio.src = possiblePaths[0];
        }
    } catch (error) {
        console.error('Error loading song:', error);
    }
}

async function initializeEditor() {
    audioElement = document.getElementById('audio-player');
    if (!audioElement) return;

    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const response = await fetch(audioElement.src);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        renderWaveform();
    } catch (error) {
        console.error('Error initializing editor:', error);
    }
}

function renderWaveform() {
    const canvas = document.getElementById('waveform-canvas');
    if (!canvas || !audioBuffer) return;

    const ctx = canvas.getContext('2d');
    // Set actual canvas size to match display size for sharpness
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;

    // Style matching the image (Green/Teal bars)
    ctx.fillStyle = '#34d399'; // teal-400

    // Draw bars instead of line for a more modern look
    const barWidth = 2;
    const gap = 1;

    for (let i = 0; i < width; i += (barWidth + gap)) {
        const min = 1.0;
        const max = -1.0;
        let datum = 0;

        // Simple downsampling
        for (let j = 0; j < step; j++) {
            datum += Math.abs(data[(i * step) + j]);
        }
        datum = datum / step;

        const barHeight = Math.max(2, datum * height * 1.5); // Amplify a bit
        const y = (height - barHeight) / 2;

        ctx.fillRect(i, y, barWidth, barHeight);
    }
}

function updatePlayhead() {
    if (!audioElement) return;
    const progress = (audioElement.currentTime / audioElement.duration) * 100;
    const playhead = document.getElementById('playhead');
    if (playhead) {
        playhead.style.left = `${progress}%`;
    }
}
