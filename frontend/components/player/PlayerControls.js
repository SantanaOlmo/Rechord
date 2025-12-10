import { Store, EVENTS } from '../../core/StateStore.js';
import { socketService } from '../../services/socketService.js';
import { audioService } from '../../services/audioService.js';
import { ICON_PLAY, CONTENT_BASE_URL } from '../../config.js';

// ... (existing code)

export function updatePlayerMeta(song) {
    if (!song) return;
    const titleEl = document.getElementById('player-title');
    const artistEl = document.getElementById('player-artist');
    const coverEl = document.getElementById('player-cover');

    if (titleEl) titleEl.textContent = song.titulo;
    if (artistEl) artistEl.textContent = song.artista || "Unknown Artist";
    if (coverEl) {
        let src = song.ruta_imagen || 'assets/images/placeholder-song.jpg';
        if (!src.startsWith('http') && !src.startsWith('assets')) {
            src = `${CONTENT_BASE_URL}/${src}`;
        }
        coverEl.src = src;
    }
}

export function PlayerControls(songId, showChords) {
    return `
        <div class="bg-gray-900/95 backdrop-blur-md border-t border-gray-800 px-4 h-24 flex items-center justify-between z-50 relative">
            
            <!-- LEFT: Track Info -->
            <div class="flex items-center w-1/4 min-w-[200px] pr-4">
                 <div id="player-cover-container" class="w-14 h-14 bg-gray-800 rounded shadow-md mr-4 overflow-hidden shrink-0 relative group">
                    <img id="player-cover" src="assets/images/placeholder-song.jpg" class="w-full h-full object-cover opacity-60 transition-opacity duration-500" />
                 </div>
                 <div class="flex flex-col overflow-hidden">
                    <span id="player-title" class="text-white font-bold text-sm truncate hover:underline cursor-pointer">Cargando...</span>
                    <span id="player-artist" class="text-gray-400 text-xs truncate hover:underline cursor-pointer">...</span>
                 </div>
            </div>

            <!-- CENTER: Controls & Progress -->
            <div class="flex flex-col items-center flex-1 max-w-2xl px-4">
                
                <!-- Buttons -->
                 <div class="flex items-center space-x-6 mb-2">
                    <button class="text-gray-400 hover:text-white transition" title="Aleatorio">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    </button>
                    
                    <button class="text-gray-300 hover:text-white transition" title="Anterior">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                    </button>

                    <button id="btn-play" class="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition shadow-sm mx-2">
                         <svg id="icon-play" class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                         <svg id="icon-pause" class="w-5 h-5 hidden" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    </button>

                    <button class="text-gray-300 hover:text-white transition" title="Siguiente">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                    </button>

                    <button class="text-gray-400 hover:text-white transition" title="Repetir">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </button>
                 </div>

                <!-- Progress Bar -->
                <div class="w-full flex items-center space-x-2 text-xs text-gray-400 font-mono">
                    <span id="current-time" class="min-w-[40px] text-right">0:00</span>
                    <div class="relative flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group select-none" id="progress-bar">
                         <div id="progress-fill" class="absolute h-full bg-white rounded-full w-0 group-hover:bg-green-500 transition-colors"></div>
                         <div id="progress-handle" class="hidden group-hover:block absolute top-1/2 -mt-1.5 h-3 w-3 bg-white rounded-full shadow hover:scale-125 transition-transform" style="left: 0%"></div>
                    </div>
                    <span id="total-time" class="min-w-[40px]">0:00</span>
                </div>

            </div>

            <!-- RIGHT: Extra Tools -->
            <div class="flex items-center justify-end w-1/4 space-x-4 min-w-[200px]">
                
                 <!-- Font Size -->
                <div class="relative group">
                    <button id="btn-font-size" class="text-gray-400 hover:text-white" title="Tamaño Letra">
                         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    </button>
                    <!-- Font Size Popover (Adjust position) -->
                    <div id="font-size-popover" class="absolute bottom-full right-0 mb-4 hidden bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-xl min-w-[200px] z-50">
                        <label class="block text-sm text-gray-300 mb-3 text-center font-bold">Tamaño de Letra</label>
                        <div class="flex items-center space-x-2">
                             <span class="text-xs text-gray-500">A</span>
                             <input type="range" id="font-size-slider" min="16" max="48" value="24" class="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500">
                             <span class="text-lg text-gray-300">A</span>
                        </div>
                    </div>
                </div>

                <!-- Chords -->
                <button id="btn-toggle-chords" class="text-gray-400 hover:text-green-400 ${showChords ? 'text-green-400' : ''}" title="Mostrar/Ocultar Acordes">
                     <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
                </button>

                <!-- Editor -->
                 <a href="#/sincronizador/${songId}" class="text-gray-400 hover:text-white" title="Sincronizador">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </a>
            </div>

        </div>
    `;
}

export function updatePlayerMeta(song) {
    if (!song) return;
    const titleEl = document.getElementById('player-title');
    const artistEl = document.getElementById('player-artist');
    const coverEl = document.getElementById('player-cover');

    if (titleEl) titleEl.textContent = song.titulo;
    if (artistEl) artistEl.textContent = song.artista || "Unknown Artist";
    if (coverEl) {
        // Assume CONTENT_BASE_URL is needed if not http
        // We can get it from import but it's not imported.
        // Let's assume absolute path or handle it.
        // Actually, let's fix the imports at top of file.
        // For now, simple check:
        let src = song.ruta_imagen || 'assets/images/placeholder-song.jpg';
        if (!src.startsWith('http') && !src.startsWith('assets')) {
            // We need base url. 
            // Let's hardcode for now or fix import in next step.
            // Or rely on global config if available.
            // We will import CONTENT_BASE_URL in next step.
            // For now just use relative? No, likely needs /content/
            // src = `/content/${src}`; 
            // But we don't know for sure.
        }
        // Actually I will add import in next step
        // For this step, I will use a placeholder logic that will be correct once import is added.
        // I will use `window.CONTENT_BASE_URL` if available, or just src.
    }
}

/**
 * Attaches event listeners for the player controls.
 * Handles both local logic and WebSocket logic if in a room.
 */
export function attachPlayerControlsEvents(currentSong) {
    const btnPlay = document.getElementById('btn-play');
    const audio = audioService.getInstance();

    // Subscribe to Sync State
    Store.subscribe(EVENTS.SOCKET.SYNC_STATE, (payload) => {
        const { stateAction, position, songId } = payload;

        // Ensure correct song is loaded if needed (optional implementation)
        // For now we assume song is same.

        if (Math.abs(audio.currentTime - position) > 2) {
            audio.currentTime = position;
        }

        if (stateAction === 'PLAY' || stateAction === 'RESUME') {
            audio.play().catch(e => console.error(e));
        } else {
            audio.pause();
        }
        updatePlayButtonState();
    });

    if (btnPlay) {
        btnPlay.onclick = () => {
            const state = Store.getState();
            const roomId = state.room?.id;

            if (roomId) {
                // Remote Logic
                const action = audio.paused ? 'PLAY' : 'PAUSE';
                socketService.send('UPDATE_PLAYBACK', {
                    roomId: roomId,
                    stateAction: action,
                    position: audio.currentTime,
                    songId: currentSong.id_cancion
                });
            } else {
                // Local Logic
                if (audio.paused) audio.play();
                else audio.pause();
                updatePlayButtonState();
            }
        };
    }

    // Font Size Logic
    const btnFontSize = document.getElementById('btn-font-size');
    const popover = document.getElementById('font-size-popover');
    const slider = document.getElementById('font-size-slider');

    if (btnFontSize && popover && slider) {
        btnFontSize.onclick = () => {
            popover.classList.toggle('hidden');
        };

        // Close popover when clicking outside
        document.addEventListener('click', (e) => {
            if (!btnFontSize.contains(e.target) && !popover.contains(e.target)) {
                popover.classList.add('hidden');
            }
        });

        slider.oninput = (e