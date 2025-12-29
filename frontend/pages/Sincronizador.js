
import { attachEditorEvents } from '../components/synchronizer/SyncController.js';
import { SyncHeader } from '../components/synchronizer/layout/SyncHeader.js';
import { SyncSidebar } from '../components/synchronizer/layout/SyncSidebar.js';

export function render(songId) {
    // Schedule initialization
    setTimeout(attachEditorEvents, 0);

    return `
        <div class="h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans select-none overflow-hidden">
            
            <!-- 1. Top Header -->
            ${SyncHeader()}

            <!-- 2. Main Workspace (Split View) -->
            <div class="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 relative px-[5px] pt-[5px]">
                
                ${SyncSidebar()}

                <!-- Resizer Handle (Horizontal Movement) -->
                <div id="sidebar-resizer" class="w-[5px] cursor-col-resize hover:bg-blue-500/50 transition-colors z-50 shrink-0 hidden md:block"></div>

                <!-- Right: Verse Display -->
                <div class="flex-1 flex flex-col relative bg-[var(--bg-tertiary)] rounded-xl overflow-hidden border border-[var(--border-primary)] shadow-inner">
                    
                    <!-- Main Lyric Preview / Chord Carousel -->
                    <div class="flex-1 flex flex-col items-center justify-center text-center" id="active-verse-display">
                        
                        <!-- MODE: LYRICS (Default) -->
                        <div id="lyrics-mode" class="flex-1 flex flex-col items-center justify-center w-full h-full relative transition-opacity duration-300 p-8">
                            <!-- Global Time Display (Floating Top Right relative to display) -->
                            <div class="absolute top-6 right-8 text-right z-20 pointer-events-none select-none">
                                <span id="global-time" class="font-mono text-xl font-bold text-gray-300 tracking-tight drop-shadow-sm bg-gray-900/80 px-3 py-1.5 rounded-lg border border-gray-800">00:00.00</span>
                            </div>

                            <h2 id="preview-text" class="text-3xl md:text-5xl font-bold text-gray-500 mb-4 transition-all duration-200 leading-tight max-w-3xl">
                                Selecciona un verso...
                            </h2>
                            <div class="text-xl font-mono text-gray-400 opacity-0 transition-opacity flex items-center gap-3 bg-gray-950 px-3 py-1 rounded" id="preview-time">
                                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span id="preview-start" class="text-green-400">00:00</span>
                                <span class="text-gray-600">/</span>
                                <span id="preview-end" class="text-red-400">00:00</span>
                            </div>
                        </div>

                        <!-- MODE: CHORD PREVIEW (Hidden) -->
                        <div id="chord-preview-mode" class="hidden w-full h-full relative flex flex-col">
                            
                            <!-- Search Header -->
                            <div class="w-full flex items-center justify-center pt-2 pb-2 shrink-0 z-10">
                                <div class="relative w-48 group">
                                    <input type="text" placeholder="Buscar acorde..." class="w-full bg-gray-900/80 border border-gray-700 text-gray-300 text-xs rounded-full pl-8 pr-3 py-1.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-gray-600 transition-all shadow-sm group-hover:bg-gray-900">
                                    <div class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                                        <svg class="w-3.5 h-3.5 text-gray-500 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div class="chord-list-container flex-1 overflow-y-auto w-full flex flex-row flex-wrap items-start content-start gap-3 p-4">
                                <!-- Add New Chord Button (Ghost Card) -->
                                <button class="btn-add-chord" title="Crear nuevo acorde">
                                    <div class="flex flex-col items-center gap-2">
                                        <svg class="icon-add" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                        </svg>
                                        <span class="text-sm font-medium opacity-70">Nuevo Acorde</span>
                                    </div>
                                </button>
                                
                                <!-- List of existing chords will be injected here via JS -->
                            </div>
                        </div>

                    </div>

                    <!-- Global Playback Bar (Moved here to sit above timeline) -->
                     <div class="h-14 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] flex items-center px-4 justify-between z-10 gap-4">

                        <!-- Left: Song Info -->
                        <div class="flex-1 flex items-center gap-3 select-none min-w-0">
                            <img id="playback-song-img" class="w-10 h-10 rounded-md bg-gray-800 object-cover border border-gray-700 shadow-sm shrink-0" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="">
                            <div class="flex flex-col justify-center min-w-0">
                                <span id="playback-song-title" class="text-sm font-bold text-gray-200 leading-tight truncate">Cargando...</span>
                                <span id="playback-song-artist" class="text-xs text-gray-400 truncate">...</span>
                            </div>
                        </div>

                        <!-- Center: Play Controls -->
                        <div class="flex-none flex items-center justify-center">
                            <button id="btn-play-pause" class="w-10 h-10 flex items-center justify-center bg-white text-gray-900 rounded-full hover:scale-110 transition shadow-lg shadow-white/10">
                                 <svg id="icon-play" class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                 <svg id="icon-pause" class="w-5 h-5 hidden" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                            </button>
                        </div>

                        <!-- Right: Spacer/Balance -->
                        <div class="flex-1"></div>
                     </div>
                </div>
            </div>

            <!-- Resizer Handle (Vertical Movement) -->
            <div id="vertical-resizer" class="h-[5px] w-full cursor-row-resize hover:bg-blue-500/50 transition-colors z-50 shrink-0"></div>

            <!-- 3. Bottom Timeline -->
            <div class="shrink-0 relative bg-[var(--bg-primary)] flex flex-col z-50 shadow-inner m-[5px] rounded-xl overflow-hidden border border-[var(--border-primary)] h-[350px]" id="timeline-container">
                
                <!-- Time Ruler (Sticky) -->
                <div class="h-8 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] w-full flex shrink-0 z-50">
                     <div id="ruler-sidebar-spacer" class="w-[350px] border-r border-[var(--border-primary)] bg-[var(--bg-secondary)] shrink-0"></div>
                     <div class="flex-1 overflow-hidden relative" id="ruler-container">
                        <div id="ruler-content" class="h-full relative select-none pointer-events-auto cursor-pointer"></div>

                     </div>
                </div>
                
                <!-- Main Timeline Area -->
                <div class="flex-1 flex min-h-0 relative">
                    <!-- Vertical Icon Bar (Fixed Left) -->
                    <div class="w-10 flex flex-col items-center py-2 gap-3 border-r border-[var(--border-primary)] bg-gray-950 shrink-0 z-40">
                         <button class="view-mode-btn hover:text-white transition-colors text-cyan-400 p-1.5 rounded-lg hover:bg-gray-800" data-view="beat" title="Beat Markers">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                         </button>
                         <button class="view-mode-btn hover:text-white transition-colors text-gray-600 p-1.5 rounded-lg hover:bg-gray-800" data-view="sections" title="Secciones de Canción">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                         </button>
                    </div>

                    <!-- Tracks Scroll Area -->
                    <div class="flex-1 overflow-auto relative scrollbar-hide h-full" id="timeline-scroll-area">
                        <!-- Flex Wrapper for robust sticky layout -->
                        <div class="flex min-w-full min-h-full h-full relative">
                            
                            <!-- Track Controls (Sticky Left) -->
                            <div id="track-headers-sidebar" class="sticky left-0 w-[310px] bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] flex-none z-40 shadow-lg">
                                <!-- Track Headers Container -->
                                <div class="flex-1 flex flex-col relative" id="headers-container">
                                     <!-- Injected by rendering.js -->
                                </div>
                            </div>

                            <!-- Timeline Content (Dynamic Width) -->
                            <div id="timeline-content" class="flex-1 relative bg-[var(--bg-primary)] min-w-0">
                                 <div id="tracks-container">
                                     <!-- Tracks are injected dynamically by rendering.js -->
                                 </div>
                                 <!-- Playhead -->
                                 <div id="playhead" class="absolute top-0 bottom-0 w-2 -ml-1 z-20 cursor-grab group" style="left: 0px">
                                    <div class="w-3 h-3 bg-red-500 transform rotate-45 -ml-0.5 -mt-1.5 shadow-[0_0_8px_rgba(239,68,68,0.8)] border border-white/20"></div>
                                    <div class="w-px h-full bg-red-500/80 mx-auto shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>

                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
