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
        <div class="flex h-[calc(100vh-64px)] bg-gray-900 text-gray-300 font-sans overflow-hidden">
            <!-- Sidebar: Settings -->
            <aside class="w-72 bg-gray-800 p-6 flex flex-col gap-6 border-r border-gray-700 shadow-xl z-20">
                
                <!-- Settings Group -->
                <div class="space-y-5">
                    <!-- Tempo -->
                    <div class="flex justify-between items-center">
                        <label class="text-sm font-medium text-gray-400">Tempo</label>
                        <input type="number" value="120" class="w-20 bg-gray-900 border border-gray-700 rounded px-3 py-1 text-right focus:outline-none focus:border-indigo-500 transition">
                    </div>

                    <!-- Métrica -->
                    <div class="flex justify-between items-center">
                        <label class="text-sm font-medium text-gray-400">Métrica</label>
                        <div class="flex items-center gap-2">
                            <input type="number" value="4" class="w-10 bg-gray-900 border border-gray-700 rounded px-1 py-1 text-center focus:outline-none focus:border-indigo-500">
                            <span class="text-gray-500">/</span>
                            <input type="number" value="4" class="w-10 bg-gray-900 border border-gray-700 rounded px-1 py-1 text-center focus:outline-none focus:border-indigo-500">
                        </div>
                    </div>

                    <!-- Beat marker -->
                    <div class="flex justify-between items-center">
                        <label class="text-sm font-medium text-gray-400">Beat marker</label>
                        <div class="w-20 h-8 bg-gray-900 rounded border border-gray-700"></div>
                    </div>

                    <!-- Snapping -->
                    <div class="flex justify-between items-center">
                        <label class="text-sm font-medium text-gray-400">Snapping</label>
                        <input type="checkbox" checked class="w-5 h-5 bg-gray-900 border-gray-700 rounded text-indigo-500 focus:ring-0">
                    </div>

                    <!-- Grid -->
                    <div class="flex justify-between items-center">
                        <label class="text-sm font-medium text-gray-400">Grid</label>
                        <input type="checkbox" class="w-5 h-5 bg-gray-900 border-gray-700 rounded text-indigo-500 focus:ring-0">
                    </div>

                    <!-- Subdivision -->
                    <div class="flex justify-between items-center">
                        <label class="text-sm font-medium text-gray-400">Subdivision</label>
                        <select class="w-24 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500">
                            <option>1/4</option>
                            <option>1/8</option>
                            <option>1/16</option>
                        </select>
                    </div>

                    <!-- Velocity -->
                    <div class="flex justify-between items-center">
                        <label class="text-sm font-medium text-gray-400">Velocity</label>
                        <div class="w-24 h-8 bg-gray-900 rounded border border-gray-700 relative overflow-hidden">
                            <div class="absolute top-0 left-0 h-full bg-indigo-900 w-3/4"></div>
                        </div>
                    </div>
                </div>

                <!-- Tools Icons (Vertical) -->
                <div class="flex flex-col gap-4 mt-auto ml-auto">
                    <button class="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                    </button>
                    <button class="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    </button>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 flex flex-col relative bg-gray-900">
                
                <!-- Top Bar (Back) -->
                <div class="absolute top-4 left-4 z-10">
                    <a href="#/" class="text-green-400 hover:text-green-300 transition">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"></path></svg>
                    </a>
                </div>

                <!-- Lyrics Display Area -->
                <div class="flex-1 flex flex-col items-center justify-center p-10 space-y-8 relative overflow-y-auto">
                    <!-- Example Lyrics (Static for now, dynamic later) -->
                    <div class="text-center space-y-6 opacity-50 blur-[1px]">
                        <p class="text-xl font-medium">ou oh oh</p>
                    </div>
                    
                    <div class="text-center space-y-2 transform scale-110 transition-all duration-300">
                        <p class="text-2xl text-gray-400">Someone said you had</p>
                        <div class="h-1 w-48 bg-gray-700 mx-auto rounded-full overflow-hidden">
                            <div class="h-full bg-gray-500 w-3/4"></div>
                        </div>
                        <p class="text-3xl font-bold text-white mt-2">your tattooes removed</p>
                        <div class="h-1.5 w-64 bg-gray-700 mx-auto rounded-full overflow-hidden">
                            <div class="h-full bg-gray-400 w-1/2"></div>
                        </div>
                    </div>

                    <div class="text-center space-y-2">
                        <p class="text-3xl font-bold text-blue-400">Saw you downtown</p>
                        <div class="h-1.5 w-56 bg-gray-700 mx-auto rounded-full overflow-hidden">
                            <div class="h-full bg-blue-500 w-full"></div>
                        </div>
                        <p class="text-3xl font-bold text-blue-400">singing the blues</p>
                        <div class="h-1.5 w-52 bg-gray-700 mx-auto rounded-full overflow-hidden">
                            <div class="h-full bg-blue-500 w-2/3"></div>
                        </div>
                    </div>

                    <div class="text-center space-y-2 opacity-80">
                        <p class="text-2xl text-white">It's time to face the music</p>
                        <div class="h-1 w-60 bg-gray-700 mx-auto rounded-full"></div>
                        <p class="text-2xl text-white">I'm no longer your muse</p>
                        <div class="h-1 w-56 bg-gray-700 mx-auto rounded-full"></div>
                    </div>
                </div>

                <!-- Timeline & Waveform Area -->
                <div class="h-80 bg-gray-800 border-t border-gray-700 flex flex-col relative shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                    
                    <!-- Timeline Tracks -->
                    <div class="flex-1 p-4 relative overflow-hidden">
                        <!-- Track 1: Chords/Regions -->
                        <div class="h-8 mb-4 flex gap-1 relative">
                            <div class="h-full bg-red-500/80 w-32 rounded-l-lg"></div>
                            <div class="h-full bg-yellow-500/80 w-24"></div>
                            <div class="h-full bg-blue-500/80 w-12"></div>
                            <div class="h-full bg-gray-600/50 flex-1 rounded-r-lg"></div>
                            
                            <!-- Playhead Line (Top part) -->
                            <div class="absolute top-0 bottom-0 w-0.5 bg-blue-500 left-[35%] z-20 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                        </div>

                        <!-- Track 2: Waveform -->
                        <div class="h-32 bg-gray-700/50 rounded-lg relative overflow-hidden backdrop-blur-sm border border-gray-600/30">
                            <canvas id="waveform-canvas" class="w-full h-full opacity-80"></canvas>
                            
                            <!-- Playhead Line (Waveform part) -->
                            <div id="playhead" class="absolute top-0 bottom-0 w-0.5 bg-blue-500 left-[35%] shadow-[0_0_8px_rgba(59,130,246,1)]">
                                <div class="w-3 h-3 bg-blue-500 rounded-full absolute -top-1.5 -left-1.5 shadow-lg"></div>
                            </div>
                        </div>
                        
                        <!-- Progress Bar Bottom -->
                        <div class="mt-6 h-1.5 bg-gray-700 rounded-full relative cursor-pointer group">
                            <div class="absolute top-0 left-0 h-full bg-blue-600 w-[35%] rounded-full group-hover:bg-blue-500 transition-colors"></div>
                            <div class="absolute top-1/2 -translate-y-1/2 left-[35%] w-4 h-4 bg-blue-600 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform"></div>
                        </div>
                    </div>

                    <!-- Playback Controls -->
                    <div class="h-20 flex items-center justify-center gap-8 pb-4">
                        <button class="w-10 h-10 rounded-full bg-green-900/30 text-green-500 flex items-center justify-center hover:bg-green-900/50 transition">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                        </button>
                        
                        <button class="w-10 h-10 rounded-full bg-green-900/30 text-green-500 flex items-center justify-center hover:bg-green-900/50 transition">
                            <span class="font-bold text-sm">Aa</span>
                        </button>

                        <button id="btn-play-pause" class="w-14 h-14 rounded-full bg-green-500 text-gray-900 flex items-center justify-center hover:bg-green-400 transition shadow-[0_0_15px_rgba(34,197,94,0.4)] transform hover:scale-105">
                            <svg id="icon-play" class="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            <svg id="icon-pause" class="w-8 h-8 hidden" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        </button>

                        <button class="w-10 h-10 rounded-full bg-green-900/30 text-green-500 flex items-center justify-center hover:bg-green-900/50 transition">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h-2v5H6v2h2v5h2v-5h2v-2zm5 0h-2V7h-2v5h-2v2h2v5h2v-5h2v-2z"/></svg>
                        </button>

                        <button class="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center hover:bg-green-500/30 transition border border-green-500/50">
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

    // Upload Audio (Hidden trigger for now, maybe add a button in UI later if needed)
    // For now, we assume audio is loaded via song data or we can add a trigger in the sidebar
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

        // Gradient effect
        // const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        // gradient.addColorStop(0, '#34d399');
        // gradient.addColorStop(1, '#059669');
        // ctx.fillStyle = gradient;

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
