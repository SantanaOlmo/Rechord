
import { attachEditorEvents } from '../components/synchronizer/SyncController.js';
import { SyncHeader } from '../components/synchronizer/layout/SyncHeader.js';
import { SyncSidebar } from '../components/synchronizer/layout/SyncSidebar.js';

export function render(songId) {
    // Schedule initialization
    setTimeout(attachEditorEvents, 0);

    return `
        <div class="h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans select-none overflow-hidden max-[820px]:p-2 max-[820px]:gap-2">
            
            <!-- 1. Top Header -->
            ${SyncHeader()}

            <!-- 2. Main Workspace (Split View) -->
            <!-- max-[820px]:contents -> Removes the wrapper on mobile so children become flex items of the Root -->
            <!-- Changed px-[5px] pt-[5px] to p-2 gap-2 to ensure uniform spacing -->
            <div class="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 relative p-2 gap-2 max-[820px]:contents">
                
                ${SyncSidebar()}

                <!-- Resizer Handle (Horizontal Movement) -->
                <!-- Removed z-50 to avoid overlapping issues if not needed, or keep it. Keeping z-50. -->
                <div id="sidebar-resizer" class="w-[5px] cursor-col-resize hover:bg-blue-500/50 transition-colors z-50 shrink-0 hidden md:block -ml-1 mr-1 opacity-0 hover:opacity-100"></div>

                <!-- Right: Verse Display -->
                <!-- Order 3 on mobile (Bottom) -->
                <div class="flex-1 flex flex-col relative bg-[var(--bg-tertiary)] rounded-xl overflow-hidden border border-[var(--border-primary)] shadow-inner max-[820px]:order-3 max-[820px]:flex-none max-[820px]:h-auto max-[820px]:w-full max-[820px]:border-none max-[820px]:shadow-none max-[820px]:bg-transparent max-[820px]:rounded-none">
                    
                    <!-- Main Lyric Preview / Chord Carousel -->
                    <div class="flex-1 flex flex-col items-center justify-center text-center max-[820px]:hidden max-[820px]:h-[175px] max-[820px]:min-h-[175px] max-[820px]:max-h-[175px] max-[820px]:w-full max-[820px]:bg-[var(--bg-tertiary)] max-[820px]:border max-[820px]:border-[var(--border-primary)] max-[820px]:rounded-xl max-[820px]:shadow-lg max-[820px]:mb-2 max-[820px]:shrink-0" id="active-verse-display">
                        
                        <!-- MODE: LYRICS (Default) -->
                        <div id="lyrics-mode" class="flex-1 flex flex-col items-center justify-center w-full h-full relative transition-opacity duration-300 p-8">
                            
                            <!-- Clip Time Info (Moved to Top Left, Minimalist) -->
                            <div class="absolute top-4 left-4 font-mono text-sm font-bold text-gray-500 opacity-0 transition-opacity select-none" id="preview-time">
                                <span id="preview-start" class="text-gray-400">00:00</span>
                                <span class="text-gray-600">/</span>
                                <span id="preview-end" class="text-gray-400">00:00</span>
                            </div>

                            <h2 id="preview-text" class="text-3xl md:text-5xl font-bold text-gray-500 mb-4 transition-all duration-200 leading-tight max-w-3xl line-clamp-3">
                                Selecciona un verso...
                            </h2>
                        </div>

                        <!-- MODE: CHORD PREVIEW (Desktop Only) -->
                        <div id="chord-preview-mode" class="hidden w-full h-full relative flex-col items-center justify-start p-6 bg-[var(--bg-secondary)] overflow-y-auto scrollbar-hide">
                             
                             <!-- Desktop Search & Header -->
                             <div class="w-full max-w-4xl flex items-center justify-between mb-8 shrink-0">
                                 <div>
                                     <h2 class="text-3xl font-bold text-white mb-1">Acordes</h2>
                                     <p class="text-sm text-gray-500">Gestiona los acordes de la canción</p>
                                 </div>
                                 
                                 <!-- Search Bar -->
                                 <div class="relative group w-64">
                                    <input type="text" id="desktop-chord-search-input" placeholder="Buscar..." class="w-full bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-gray-600 transition-all shadow-sm">
                                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>
                                 </div>
                             </div>

                             <!-- Desktop Chord Grid -->
                             <div id="desktop-chord-list" class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full max-w-6xl pb-20">
                                 <!-- Chords injected here -->
                                 <div class="col-span-full text-center py-10 text-gray-600 italic">No hay acordes.</div>
                             </div>

                        </div>

                    </div>

                    <!-- Global Playback Bar (Moved here to sit above timeline) -->
                     <!-- Changed bg-[var(--bg-secondary)] to bg-[var(--bg-primary)] per user request -->
                     <!-- Removed border-t and border-[var(--border-primary)] -->
                     <div class="h-14 bg-[var(--bg-primary)] flex items-center px-4 justify-between z-10 gap-4 transition-all">

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

                        <!-- Right: Toggle Display Btn -->
                        <div class="flex-1 flex justify-end">
                            <button id="toggle-display-btn" class="hidden max-[820px]:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                <svg class="w-5 h-5 transform transition-transform" id="icon-toggle-display" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                                </svg>
                            </button>
                        </div>
                     </div>
                </div>
            </div>

            <!-- 3. Bottom Timeline -->
            <!-- Order 2 on mobile (Middle) -->
            <!-- Removed m-[5px], margins are managed by parent gap/padding now. Added mx-2 mb-2 for mobile specific spacing if not handled by Grid/Flex gap. Wait, flex gap handles spacing between siblings, but if 'contents' is used, the gap falls back to the parent. -->
            <!-- The root currently: <div class="h-screen flex flex-col ... overflow-hidden"> -->
            <!-- It has no gap. So on Mobile we might need explicit margins. -->
            <!-- For mobile, simpler to keep consistent margins on the items. -->
            
            <div class="shrink-0 relative bg-[var(--bg-primary)] flex flex-col z-50 shadow-inner rounded-xl overflow-hidden border border-[var(--border-primary)] h-[350px] max-[820px]:h-[175px] max-[820px]:order-2 max-[820px]:w-full" id="timeline-container">
                
                <!-- Time Ruler (Sticky) -->
                <div class="h-8 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] w-full flex shrink-0 z-50">
                     <div id="ruler-sidebar-spacer" class="w-[25vw] min-w-[240px] border-r border-[var(--border-primary)] bg-[var(--bg-secondary)] shrink-0 flex items-center justify-center">
                        <span id="global-time" class="font-mono text-xl font-bold text-gray-300 tracking-tight drop-shadow-sm select-none">00:00.00</span>
                     </div>
                     <div class="flex-1 overflow-hidden relative" id="ruler-container">
                        <div id="ruler-content" class="h-full relative select-none pointer-events-auto cursor-pointer"></div>
                     </div>
                </div>
                
                <!-- Main Timeline Area -->
                <div class="flex-1 flex min-h-0 relative">
                    <!-- Vertical Icon Bar (Fixed Left) -->
                    <div class="w-10 flex flex-col items-center py-2 gap-3 border-r border-[var(--border-primary)] bg-gray-950 shrink-0 z-40">
                         <!-- MOBILE ONLY: Save & Metronome -->
                         <button id="btn-save-sync-mobile" class="hidden max-[820px]:flex text-indigo-400 p-1.5 rounded-lg hover:bg-gray-800 transition-colors" title="Guardar">
                             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                         </button>
                         <button id="toggle-metronome-mobile" class="hidden max-[820px]:flex text-gray-400 hover:text-cyan-400 p-1.5 rounded-lg hover:bg-gray-800 transition-colors" title="Metrónomo">
                             <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.153 8.188l-.72-3.236a2.493 2.493 0 0 0-4.867 0L5.541 18.566A2 2 0 0 0 7.493 21h7.014a2 2 0 0 0 1.952-2.434l-.524-2.357M11 18l9-13m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/></svg>
                         </button>
                         <div class="h-px w-6 bg-gray-800 hidden max-[820px]:block"></div>

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
                            <!-- Width: calc(25vw - 2.5rem) -> Matches 25vw of Spacer minus 2.5rem of Icon Bar -->
                            <div id="track-headers-sidebar" class="sticky left-0 w-[calc(25vw-2.5rem)] min-w-[calc(240px-2.5rem)] bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] flex-none z-40 shadow-lg">
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
