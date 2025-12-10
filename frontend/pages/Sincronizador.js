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
