<<<<<<< HEAD
import { attachEditorEvents } from '../components/synchronizer/SyncController.js';

export function render(songId) {
    // Schedule initialization
    setTimeout(attachEditorEvents, 0);

    return `
        <div class="h-screen flex flex-col bg-gray-900 text-white font-sans select-none overflow-hidden">
            <!-- Header / Preview Area -->
            <div class="flex-1 flex flex-col relative border-b border-gray-800 bg-gray-900 min-h-0">
                <!-- Top Controls -->
                <div class="absolute top-4 left-4 z-10">
                   <button onclick="window.history.back()" class="text-gray-400 hover:text-white flex items-center">
                        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Volver
                   </button>
                </div>
                
                <div class="absolute top-4 right-4 z-10 flex space-x-3">
                    <button id="btn-save-sync" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold shadow-lg transition-transform hover:scale-105 active:scale-95">
                        Guardar Sincronización
                    </button>
                    <!-- Zoom Controls -->
                     <div class="flex items-center bg-gray-800 rounded px-2">
                        <button id="zoom-out" class="p-1 px-2 text-gray-400 hover:text-white">-</button>
                        <span class="text-xs text-gray-500 mx-1">ZOOM</span>
                        <button id="zoom-in" class="p-1 px-2 text-gray-400 hover:text-white">+</button>
                    </div>
                </div>

                <!-- Verse Preview -->
                <div class="flex-1 flex flex-col items-center justify-center p-8 text-center" id="active-verse-display">
                    <h2 id="preview-text" class="text-3xl md:text-4xl font-bold text-gray-500 mb-4 transition-all duration-200">
                        Selecciona un verso...
                    </h2>
                    <div class="text-xl font-mono text-gray-400 opacity-0 transition-opacity" id="preview-time">
                        <span id="preview-start" class="text-green-400">00:00</span> - <span id="preview-end" class="text-red-400">00:00</span>
                    </div>
                </div>

                <!-- New Global Time Display (Floating Bottom Right) -->
                <div class="absolute bottom-16 right-6 text-right z-20 pointer-events-none select-none">
                     <span id="global-time" class="font-mono text-xl font-bold text-gray-300 tracking-tight drop-shadow-sm bg-gray-900/50 px-2 py-1 rounded">00:00.00</span>
                </div>
                
                 <!-- Global Playback Bar -->
                 <div class="h-14 border-t border-gray-800 bg-gray-800/50 flex items-center px-4 relative justify-center">
                    <div class="absolute left-4 text-xs text-gray-500 hidden md:block">
                        Espacio: Play/Pause | Click: Seleccionar | Arrastrar: Ajustar
                    </div>
                    <div class="flex items-center space-x-4">
                        <button id="btn-play-pause" class="w-10 h-10 flex items-center justify-center bg-white text-gray-900 rounded-full hover:scale-110 transition shadow-lg">
                             <svg id="icon-play" class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                             <svg id="icon-pause" class="w-5 h-5 hidden" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        </button>
                    </div>
                 </div>
            </div>

            <!-- Timeline Main Area -->
            <div class="shrink-0 relative bg-gray-950 flex flex-col border-t border-gray-800 h-auto z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] pb-6" id="timeline-container">
                
                <!-- Time Ruler (Sticky) -->
                <div class="h-8 border-b border-gray-800 bg-gray-900/80 w-full flex shrink-0 z-20">
                     <div class="w-48 border-r border-gray-800 bg-gray-900 shrink-0"></div> <!-- Spacer for headers -->
                     <div class="flex-1 overflow-hidden relative" id="ruler-container">
                        <canvas id="ruler-canvas" class="h-full block"></canvas>
                     </div>
                </div>
                
                <!-- Tracks Area (Scrollable) -->
                <div class="flex-1 flex overflow-hidden relative">
                    
                    <!-- Track Headers (Fixed Left) -->
                    <div class="w-48 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 z-20" id="headers-container">
                         <!-- Injected by rendering.js -->
                    </div>

                    <!-- Scrollable Tracks Content -->
                    <div class="flex-1 overflow-x-auto overflow-y-hidden relative scrollbar-hide" id="timeline-scroll-area">
                        <div id="timeline-content" class="h-full relative">
                             <div id="tracks-container">
                                 <!-- Lyrics Track -->
                                 <div class="bg-gray-900/30 border-b border-gray-800 relative group transition-all duration-200" id="track-lyrics">
                                    <div id="track-verses" class="w-full h-full relative"></div>
                                 </div>
                                 <div class="bg-gray-900/20 border-b border-gray-800 relative group transition-all duration-200" id="track-strumming">
                                    <div class="absolute inset-0 flex items-center justify-center text-gray-700 text-sm select-none">Pista de Strumming</div>
                                 </div>
                                 <div class="bg-gray-900/20 border-b border-gray-800 relative group transition-all duration-200" id="track-chords">
                                     <div class="absolute inset-0 flex items-center justify-center text-gray-700 text-sm select-none">Pista de Acordes</div>
                                 </div>
                             </div>
                             <!-- Playhead -->
                             <div id="playhead" class="absolute top-0 bottom-0 w-px bg-red-500 z-10 pointer-events-none transform translate-x-0" style="left: 0px">
                                <div class="w-3 h-3 -ml-1.5 bg-red-500 transform rotate-45 -mt-1.5 shadow-sm"></div>
                                <div class="w-px h-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
=======
/**
 * Editor de Acordes Sincronizados para ReChord - UI Synchronizer
 */

import { getAcordesSincronizados, agregarAcordeSincronizado, actualizarAcordeSincronizado, eliminarAcordeSincronizado } from '../services/chordService.js';
import { getCancion } from '../services/cancionService.js';
import { getEstrofas } from '../services/estrofaService.js';
import { getAcordes } from '../services/acordeService.js';
import { CONTENT_BASE_URL } from '../config.js';

let audioContext = null;
let audioBuffer = null;
let audioElement = null;
let currentSong = null;
let estrofas = [];
let acordesSincronizados = [];
let acordesDisponibles = [];
let isPlaying = false;
let zoomLevel = 100; // Pixels per second

// Drag & Drop State
let draggedChord = null;
let isDragging = false;
let dragSource = null; // 'sidebar' | 'timeline' | 'lyrics'

export function render(songId = null) {
    return `
        <div class="editor-container h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
            <!-- Top Bar -->
            <header class="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 z-20">
                <div class="flex items-center">
                    <a href="#/" class="text-gray-400 hover:text-white mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                    </a>
                    <h1 class="text-xl font-bold text-green-400">Editor de Sincronización</h1>
                </div>
                <div class="flex items-center space-x-4">
                    <button id="btn-save" class="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-sm font-bold transition">Guardar</button>
                </div>
            </header>

            <div class="flex-1 flex overflow-hidden">
                <!-- Sidebar: Options (Chords) -->
                <aside class="w-64 bg-gray-800 border-r border-gray-700 flex flex-col z-10">
                    <div class="p-4 border-b border-gray-700 bg-lime-500/20">
                        <h2 class="text-lime-400 font-bold uppercase tracking-wider text-sm">Acordes</h2>
                    </div>
                    <div id="chords-list" class="flex-1 overflow-y-auto p-4 space-y-2">
                        <!-- Chords will be injected here -->
                        <div class="text-gray-500 text-sm text-center">Cargando acordes...</div>
                    </div>
                </aside>

                <!-- Main Content -->
                <main class="flex-1 flex flex-col relative bg-gray-900">
                    
                    <!-- Lyrics Area (Center) -->
                    <div id="lyrics-area" class="flex-1 overflow-y-auto p-8 text-center relative">
                        <div id="lyrics-content" class="max-w-3xl mx-auto space-y-12 pb-64">
                            <!-- Lyrics lines will be injected here -->
                            <div class="text-gray-500 mt-20">Cargando letras...</div>
                        </div>
                    </div>

                    <!-- Timeline Area (Bottom) -->
                    <div id="timeline-area" class="h-64 bg-gray-800 border-t border-gray-700 flex flex-col relative select-none">
                        
                        <!-- Timeline Header (Ruler) -->
                        <div class="h-6 bg-gray-900 border-b border-gray-700 relative overflow-hidden" id="timeline-ruler">
                            <!-- Time markers generated by JS -->
                        </div>

                        <!-- Tracks Container -->
                        <div class="flex-1 relative overflow-hidden overflow-x-auto" id="timeline-tracks">
                            
                            <!-- Playhead -->
                            <div id="playhead" class="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-30 pointer-events-none" style="left: 0px;">
                                <div class="w-3 h-3 bg-blue-500 rounded-full -ml-1.5 -mt-1.5"></div>
                            </div>

                            <!-- Track: Chords -->
                            <div class="h-12 border-b border-gray-700 relative bg-gray-800/50" id="track-chords">
                                <!-- Chord blocks generated by JS -->
                            </div>

                            <!-- Track: Waveform -->
                            <div class="h-24 relative bg-gray-900/50" id="track-waveform">
                                <canvas id="waveform-canvas" class="w-full h-full opacity-60"></canvas>
                            </div>

                        </div>

                        <!-- Controls -->
                        <div class="h-16 bg-gray-900 border-t border-gray-700 flex items-center justify-center space-x-6 px-4 z-20">
                            <button id="btn-play-pause" class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-400 shadow-lg transition">
                                <svg id="icon-play" class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                <svg id="icon-pause" class="w-6 h-6 hidden" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                            </button>
                            <input type="range" id="zoom-slider" min="10" max="300" value="100" class="w-32 accent-green-500">
                        </div>
                    </div>

                </main>
            </div>

            <!-- Hidden Audio -->
            <audio id="audio-player" class="hidden"></audio>
        </div>
    `;
}

// ... (Previous imports)

// Global function for tab switching (since we use onclick in HTML string)
window.switchTab = (tab) => {
    activeTab = tab;
    // Re-render sidebar content
    document.getElementById('sidebar-title').textContent = getPanelTitle(tab);
    document.getElementById('sidebar-panel-content').innerHTML = renderPanelContent(tab);

    // Update icons active state
    const buttons = document.querySelectorAll('aside button'); // Simple selector, might need refinement
    // Actually, let's just re-render the whole sidebar or toggle classes manually
    // Re-rendering the whole page is too heavy. Let's toggle classes.
    // But since we generated the HTML with renderSidebarIcon, it's easier to just update the container if we had one.
    // For MVP, let's just re-render the sidebar icon container? No, that kills event listeners if any.
    // Let's just update the classes manually for now.

    // Better: Re-render the icon bar
    const iconBar = document.querySelector('aside > div:first-child');
    if (iconBar) {
        iconBar.innerHTML = `
            ${renderSidebarIcon('chords', 'Guitarra', 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3')}
            ${renderSidebarIcon('audio', 'Audio', 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', true)}
            ${renderSidebarIcon('lyrics', 'Letras', 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z')}
            ${renderSidebarIcon('strumming', 'Rasgueo', 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z')}
            ${renderSidebarIcon('settings', 'Ajustes', 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z')}
        `;
    }

    // If switching to chords, re-render the drag list
    if (tab === 'chords') {
        renderChordsSidebar();
    }
};

export function attachEditorEvents() {
    const songId = getSongIdFromUrl();
    if (songId) {
        initEditor(songId);
    }
    // ... (rest of function)

    const btnPlayPause = document.getElementById('btn-play-pause');
    const audioPlayer = document.getElementById('audio-player');

    if (btnPlayPause && audioPlayer) {
        btnPlayPause.onclick = () => {
            if (audioPlayer.paused) audioPlayer.play();
            else audioPlayer.pause();
        };

        audioPlayer.onplay = () => {
            isPlaying = true;
            const iconPlay = document.getElementById('icon-play');
            const iconPause = document.getElementById('icon-pause');
            if (iconPlay) iconPlay.classList.add('hidden');
            if (iconPause) iconPause.classList.remove('hidden');
            requestAnimationFrame(animatePlayhead);
        };

        audioPlayer.onpause = () => {
            isPlaying = false;
            const iconPlay = document.getElementById('icon-play');
            const iconPause = document.getElementById('icon-pause');
            if (iconPlay) iconPlay.classList.remove('hidden');
            if (iconPause) iconPause.classList.add('hidden');
        };
    }

    // Zoom
    const zoomSlider = document.getElementById('zoom-slider');
    if (zoomSlider) {
        zoomSlider.oninput = (e) => {
            zoomLevel = parseInt(e.target.value);
            renderTimeline();
            renderWaveform();
        };
    }

    // Timeline Click (Seek)
    const timelineTracks = document.getElementById('timeline-tracks');
    if (timelineTracks) {
        timelineTracks.onclick = (e) => {
            if (e.target.closest('.chord-block')) return; // Ignore clicks on chords
            const rect = timelineTracks.getBoundingClientRect();
            const x = e.clientX - rect.left + timelineTracks.scrollLeft;
            const time = x / zoomLevel;
            if (audioPlayer && Number.isFinite(time)) {
                audioPlayer.currentTime = Math.max(0, Math.min(time, audioPlayer.duration));
                updatePlayheadPosition();
            }
        };
    }
}

async function initEditor(songId) {
    try {
        // 1. Fetch Data
        const [song, fetchedEstrofas, fetchedAcordes, fetchedSincronizados] = await Promise.all([
            getCancion(songId),
            getEstrofas(songId),
            getAcordes(),
            getAcordesSincronizados(songId)
        ]);

        currentSong = song;
        estrofas = fetchedEstrofas;
        acordesDisponibles = fetchedAcordes;
        acordesSincronizados = fetchedSincronizados;

        // 2. Setup Audio
        const audioPlayer = document.getElementById('audio-player');
        if (currentSong.ruta_mp3) {
            const path = currentSong.ruta_mp3.startsWith('http') ? currentSong.ruta_mp3 : `${CONTENT_BASE_URL}/${currentSong.ruta_mp3}`;
            audioPlayer.src = path;

            // Init Web Audio API for waveform
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const response = await fetch(path);
            const arrayBuffer = await response.arrayBuffer();
            audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        }

        // 3. Render UI Components
        renderChordsSidebar();
        renderLyrics();
        renderTimeline();
        renderWaveform();

    } catch (error) {
        console.error("Error initializing editor:", error);
        alert("Error al cargar el editor. Revisa la consola.");
    }
}

// --- RENDERING ---

function renderChordsSidebar() {
    const list = document.getElementById('chords-list');
    list.innerHTML = acordesDisponibles.map(acorde => `
        <div class="draggable-chord bg-gray-700 hover:bg-gray-600 p-2 rounded cursor-grab flex items-center justify-between mb-2 select-none"
             draggable="true"
             data-id="${acorde.id_acorde}"
             data-name="${acorde.nombre}"
             data-color="${acorde.color_hex || '#34d399'}">
            <span class="font-bold text-white">${acorde.nombre}</span>
            <div class="w-4 h-4 rounded-full" style="background-color: ${acorde.color_hex || '#34d399'}"></div>
        </div>
    `).join('');

    // Attach Drag Events
    document.querySelectorAll('.draggable-chord').forEach(el => {
        el.addEventListener('dragstart', (e) => {
            isDragging = true;
            dragSource = 'sidebar';
            draggedChord = {
                id_acorde: el.dataset.id,
                nombre: el.dataset.name,
                color: el.dataset.color
            };
            e.dataTransfer.setData('text/plain', JSON.stringify(draggedChord));
            e.dataTransfer.effectAllowed = 'copy';
        });
        el.addEventListener('dragend', () => {
            isDragging = false;
            dragSource = null;
            draggedChord = null;
        });
    });
}

function renderLyrics() {
    const container = document.getElementById('lyrics-content');
    if (!estrofas || estrofas.length === 0) {
        container.innerHTML = `<p class="text-gray-500">No hay letras. Añade estrofas primero.</p>`;
        return;
    }

    container.innerHTML = estrofas.map(estrofa => {
        // We render a single "Mini Timeline" for the whole estrofa for now, 
        // as we don't have per-line timestamps.
        // The user asked for "under each line", but without data, "under the block" is the best approximation
        // or we can duplicate it if we had line data.
        // Let's assume the Estrofa is the unit of time we have.

        const duration = parseFloat(estrofa.tiempo_fin) - parseFloat(estrofa.tiempo_inicio);
        const hasTime = duration > 0;

        return `
            <div class="estrofa-block mb-12 p-4 rounded border border-transparent hover:border-gray-700 transition" 
                 data-id="${estrofa.id_estrofa}" 
                 data-start="${estrofa.tiempo_inicio}" 
                 data-end="${estrofa.tiempo_fin}">
                
                <div class="mb-4">
                    <p class="text-2xl font-medium text-white select-text whitespace-pre-line leading-relaxed">${estrofa.contenido}</p>
                </div>

                <!-- Mini Timeline Bar for this Estrofa -->
                ${hasTime ? `
                <div class="mini-timeline-container relative h-12 bg-gray-800/50 rounded border border-gray-600 w-full group">
                    <!-- Background Grid/Ruler hint -->
                    <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image: linear-gradient(to right, #555 1px, transparent 1px); background-size: 20% 100%;"></div>
                    
                    <!-- Chords Container -->
                    <div class="mini-timeline-tracks absolute inset-0 overflow-hidden" data-estrofa-id="${estrofa.id_estrofa}">
                        ${renderChordsForEstrofa(estrofa)}
                    </div>

                    <!-- Time Label -->
                    <div class="absolute -top-3 right-0 text-xs text-gray-500 bg-gray-900 px-1 rounded">
                        ${parseFloat(estrofa.tiempo_inicio).toFixed(1)}s - ${parseFloat(estrofa.tiempo_fin).toFixed(1)}s
                    </div>
                </div>
                ` : `
                <div class="text-xs text-red-500">
                    Estrofa sin tiempo definido. Ajusta el tiempo en la vista de lista o arrastra en el timeline global.
                </div>
                `}
            </div>
        `;
    }).join('');

    setupLyricsDropZones();
}

function renderChordsForEstrofa(estrofa) {
    const start = parseFloat(estrofa.tiempo_inicio);
    const end = parseFloat(estrofa.tiempo_fin);
    const duration = end - start;

    if (duration <= 0) return '';

    // Filter chords that overlap with this estrofa
    const chords = acordesSincronizados.filter(c => {
        const cStart = parseFloat(c.tiempo_inicio);
        const cEnd = parseFloat(c.tiempo_fin);
        // Check overlap
        return (cStart < end && cEnd > start);
    });

    return chords.map(c => {
        const cStart = parseFloat(c.tiempo_inicio);
        const cEnd = parseFloat(c.tiempo_fin);

        // Calculate relative position in %
        // Clamp to 0-100 relative to estrofa
        const relStart = Math.max(0, (cStart - start) / duration) * 100;
        const relEnd = Math.min(100, (cEnd - start) / duration) * 100;
        const relWidth = relEnd - relStart;

        return `
            <div class="mini-chord-block absolute top-1 bottom-1 rounded shadow-sm flex items-center justify-center text-xs font-bold text-white cursor-pointer select-none overflow-hidden group/chord"
                 style="left: ${relStart}%; width: ${relWidth}%; background-color: ${c.color_hex || '#34d399'};"
                 data-id="${c.id_sincronia_acorde}"
                 data-start="${cStart}"
                 data-end="${cEnd}">
                ${c.nombre_acorde}
                
                <!-- Resize Handles -->
                <div class="absolute left-0 top-0 bottom-0 w-2 cursor-w-resize bg-black/20 hover:bg-white/50 opacity-0 group-hover/chord:opacity-100 transition-opacity handle-l"></div>
                <div class="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize bg-black/20 hover:bg-white/50 opacity-0 group-hover/chord:opacity-100 transition-opacity handle-r"></div>
            </div>
        `;
    }).join('');
}

function renderTimeline() {
    const trackChords = document.getElementById('track-chords');
    const trackWaveform = document.getElementById('track-waveform');

    // Clear existing
    trackChords.innerHTML = '';

    // Set width based on duration
    const duration = audioElement ? audioElement.duration : 180; // Default 3 mins
    const width = duration * zoomLevel;

    trackChords.style.width = `${width}px`;
    trackWaveform.style.width = `${width}px`;

    // Render Chords
    acordesSincronizados.forEach(acorde => {
        const left = acorde.tiempo_inicio * zoomLevel;
        const width = (acorde.tiempo_fin - acorde.tiempo_inicio) * zoomLevel;

        const el = document.createElement('div');
        el.className = 'chord-block absolute top-1 h-10 rounded shadow-sm border border-white/20 flex items-center justify-center text-xs font-bold text-white cursor-pointer select-none overflow-hidden group';
        el.style.left = `${left}px`;
        el.style.width = `${Math.max(width, 20)}px`; // Min width
        el.style.backgroundColor = acorde.color_hex || '#34d399';
        el.textContent = acorde.nombre_acorde;
        el.dataset.id = acorde.id_sincronia_acorde;

        // Resize Handles
        const handleL = document.createElement('div');
        handleL.className = 'absolute left-0 top-0 bottom-0 w-2 cursor-w-resize bg-black/20 hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity';

        const handleR = document.createElement('div');
        handleR.className = 'absolute right-0 top-0 bottom-0 w-2 cursor-e-resize bg-black/20 hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity';

        el.appendChild(handleL);
        el.appendChild(handleR);
        trackChords.appendChild(el);

        // Resize Logic
        setupResize(el, handleL, handleR, acorde, 'timeline');
    });

    setupTimelineDropZone();
}

function renderWaveform() {
    const canvas = document.getElementById('waveform-canvas');
    if (!canvas || !audioBuffer) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect(); // Use container size
    const duration = audioBuffer.duration;
    const fullWidth = duration * zoomLevel;

    canvas.width = fullWidth * dpr;
    canvas.height = rect.height * dpr;

    // Important: CSS width must match the scrollable width
    canvas.style.width = `${fullWidth}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, fullWidth, rect.height);
    ctx.fillStyle = '#4ade80'; // Green waveform

    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / fullWidth);
    const amp = rect.height / 2;

    for (let i = 0; i < fullWidth; i += 2) {
        let min = 1.0;
        let max = -1.0;
        for (let j = 0; j < step; j++) {
            const datum = data[(i * step) + j];
            if (datum < min) min = datum;
            if (datum > max) max = datum;
        }
        ctx.fillRect(i, (1 + min) * amp, 2, Math.max(1, (max - min) * amp));
    }
}

// --- INTERACTION ---

function setupTimelineDropZone() {
    const track = document.getElementById('track-chords');

    track.ondragover = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    track.ondrop = async (e) => {
        e.preventDefault();
        if (!draggedChord) return;

        const rect = track.getBoundingClientRect();
        const scrollLeft = document.getElementById('timeline-tracks').scrollLeft;
        const x = e.clientX - rect.left + scrollLeft; // Adjust for scroll? No, rect is relative to viewport, but track is scrolled inside container?
        // Actually, track-chords is the scrolling element's child.
        // Let's use offsetX if target is track, or calculate from clientX

        // Correct calculation:
        // The track-chords element is WIDE. e.offsetX gives position relative to it.
        const dropX = e.offsetX;
        const time = dropX / zoomLevel;

        const newChord = {
            id_cancion: currentSong.id_cancion,
            id_acorde: draggedChord.id_acorde,
            tiempo_inicio: time,
            tiempo_fin: time + 2.0 // Default 2s duration
        };

        try {
            await agregarAcordeSincronizado(newChord);
            // Refresh
            acordesSincronizados = await getAcordesSincronizados(currentSong.id_cancion);
            renderTimeline();
            renderLyrics(); // Sync
        } catch (error) {
            console.error(error);
            alert("Error al agregar acorde");
        }
    };
}

function setupLyricsDropZones() {
    document.querySelectorAll('.mini-timeline-tracks').forEach(track => {
        const estrofaId = track.dataset.estrofaId;
        const estrofa = estrofas.find(e => e.id_estrofa == estrofaId);

        if (!estrofa) return;

        track.ondragover = (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        };

        track.ondrop = async (e) => {
            e.preventDefault();
            if (!draggedChord) return;

            const rect = track.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            const percentage = x / width;

            const estrofaDuration = parseFloat(estrofa.tiempo_fin) - parseFloat(estrofa.tiempo_inicio);
            const dropTime = parseFloat(estrofa.tiempo_inicio) + (percentage * estrofaDuration);

            const newChord = {
                id_cancion: currentSong.id_cancion,
                id_acorde: draggedChord.id_acorde,
                tiempo_inicio: dropTime,
                tiempo_fin: dropTime + 2.0 // Default 2s
            };

            try {
                await agregarAcordeSincronizado(newChord);
                acordesSincronizados = await getAcordesSincronizados(currentSong.id_cancion);
                renderLyrics(); // Refresh both
                renderTimeline();
            } catch (error) {
                console.error(error);
                alert("Error al agregar acorde");
            }
        };

        // Setup Resize for existing chords in this mini-timeline
        track.querySelectorAll('.mini-chord-block').forEach(el => {
            const chordId = el.dataset.id;
            const chord = acordesSincronizados.find(c => c.id_sincronia_acorde == chordId);
            const handleL = el.querySelector('.handle-l');
            const handleR = el.querySelector('.handle-r');

            if (chord && handleL && handleR) {
                setupResize(el, handleL, handleR, chord, 'lyrics', track, estrofa);
            }
        });
    });
}

function setupResize(el, handleL, handleR, acorde, context, container = null, estrofa = null) {
    let startX, startLeft, startWidth, startTime, startDuration;

    const onMouseDown = (e, isLeft) => {
        e.stopPropagation();
        startX = e.clientX;
        startLeft = parseFloat(el.style.left); // px or %
        startWidth = parseFloat(el.style.width); // px or %
        startTime = parseFloat(acorde.tiempo_inicio);
        startDuration = parseFloat(acorde.tiempo_fin) - startTime;

        const onMouseMove = (e) => {
            const dx = e.clientX - startX;

            if (context === 'timeline') {
                // Pixel based
                let newWidth, newLeft, newStartTime, newEndTime;
                if (isLeft) {
                    newWidth = Math.max(20, startWidth - dx);
                    newLeft = startLeft + (startWidth - newWidth);
                    newStartTime = newLeft / zoomLevel;
                    newEndTime = acorde.tiempo_fin;
                    el.style.left = `${newLeft}px`;
                    el.style.width = `${newWidth}px`;
                } else {
                    newWidth = Math.max(20, startWidth + dx);
                    newEndTime = startTime + (newWidth / zoomLevel);
                    newStartTime = startTime;
                    el.style.width = `${newWidth}px`;
                }
                acorde.tiempo_inicio = newStartTime;
                acorde.tiempo_fin = newEndTime;

            } else if (context === 'lyrics') {
                // Percentage based
                const containerWidth = container.getBoundingClientRect().width;
                const estrofaDuration = parseFloat(estrofa.tiempo_fin) - parseFloat(estrofa.tiempo_inicio);

                // Convert dx to time
                const dt = (dx / containerWidth) * estrofaDuration;

                let newStartTime = startTime;
                let newEndTime = parseFloat(acorde.tiempo_fin);

                if (isLeft) {
                    newStartTime = Math.min(newEndTime - 0.1, startTime + dt);
                } else {
                    newEndTime = Math.max(newStartTime + 0.1, parseFloat(acorde.tiempo_fin) + dt);
                }

                // Update visual %
                const relStart = Math.max(0, (newStartTime - parseFloat(estrofa.tiempo_inicio)) / estrofaDuration) * 100;
                const relEnd = Math.min(100, (newEndTime - parseFloat(estrofa.tiempo_inicio)) / estrofaDuration) * 100;

                el.style.left = `${relStart}%`;
                el.style.width = `${relEnd - relStart}%`;

                acorde.tiempo_inicio = newStartTime;
                acorde.tiempo_fin = newEndTime;
            }
        };

        const onMouseUp = async () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            try {
                await actualizarAcordeSincronizado({
                    id_sincronia_acorde: acorde.id_sincronia_acorde,
                    tiempo_inicio: acorde.tiempo_inicio,
                    tiempo_fin: acorde.tiempo_fin
                });
                // Refresh both views to sync
                renderTimeline();
                renderLyrics();
            } catch (error) {
                console.error("Error updating chord:", error);
            }
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    handleL.onmousedown = (e) => onMouseDown(e, true);
    handleR.onmousedown = (e) => onMouseDown(e, false);
}

function animatePlayhead() {
    if (!isPlaying || !audioElement) return;
    updatePlayheadPosition();
    requestAnimationFrame(animatePlayhead);
}

function updatePlayheadPosition() {
    const playhead = document.getElementById('playhead');
    const tracks = document.getElementById('timeline-tracks');
    if (playhead && audioElement) {
        const x = audioElement.currentTime * zoomLevel;
        playhead.style.left = `${x}px`;

        // Auto-scroll if playhead goes off screen
        if (x > tracks.scrollLeft + tracks.clientWidth - 100) {
            tracks.scrollLeft = x - 100;
        }
    }
}

function getSongIdFromUrl() {
    const hash = window.location.hash;
    const match = hash.match(/\/(?:songeditor|sincronizador)(?:\/(\d+)|[?&]id=(\d+))/);
    if (match) return parseInt(match[1] || match[2]);
    return null;
}

>>>>>>> c82b7bf (feat(likes): Implementada funcionalidad de likes y rediseño de tarjetas. Actualizado project_structure.json)
