
import { SyncShortcuts } from './SyncShortcuts.js';

export const SyncSidebar = () => `
    <!-- Left Sidebar: Preferences / Navigation -->
    <div id="editor-sidebar" class="w-full md:w-[350px] md:flex-none bg-[var(--bg-secondary)] flex flex-col z-30 rounded-xl overflow-hidden border border-[var(--border-primary)] shadow-inner">
        <div class="flex flex-1 overflow-hidden">
            <!-- Navigation Rail -->
            <div class="w-16 bg-[var(--bg-tertiary)] flex flex-col items-center py-4 border-r border-[var(--border-primary)] gap-4 shrink-0 z-20 justify-evenly">
                <!-- Lyrics Tab (Active Default) -->
                <button class="sidebar-nav-btn w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-all" data-panel="lyrics" title="Letras">
                    <svg class="w-6 h-6" viewBox="0 0 512 512"><path d="M384 112V84.4c0-29-24.5-52.4-54.8-52.4H182.9C152.5 32 128 55.4 128 84.4V112h152v37H128v43h152v37H128v43h152v37H128v41.8c0 29 24.5 52.2 54.9 52.2H213v77h86v-77h30.2c30.3 0 54.8-23.2 54.8-52.2V309h-56v-37h56v-43h-56v-37h56v-43h-56v-37h56z" fill="currentColor"/></svg>
                </button>
                <!-- Chords Tab -->
                <button class="sidebar-nav-btn w-10 h-10 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-gray-800 flex items-center justify-center transition-all" data-panel="chords" title="Acordes">
                    <svg class="w-6 h-6" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12.408 26.66h3.746m15.692 0h3.746m-23.877-7.78h4.1m16.37 0h4.1M11.07 11.096h4.125m17.61 0h4.125m-1.337 13.72v3.69m-23.186-3.69v3.69m23.88-11.472v3.69m-24.574-3.69v3.69M36.932 9.251v3.689M11.068 9.25v3.69m7.501 24.506h10.864M18.707 32.18h10.588m-2.463-22.055v15.858m-5.664-15.858v15.858M31.791 5.752c.723.216 1.256.8 1.37 1.263c-.602 7.252-1.216 12.292-1.359 21.642l-2.517 3.073l.27 10.38c.016.655-.742 1.39-1.403 1.39h-8.304c-.66 0-1.42-.735-1.402-1.39l.269-10.38l-2.517-3.073c-.143-9.35-.757-14.39-1.36-21.642c.115-.463.648-1.047 1.37-1.263c0 0 2.562-1.252 7.792-1.252s7.791 1.252 7.791 1.252"/></svg>
                </button>
                <!-- Strumming Tab -->
                <button class="sidebar-nav-btn w-10 h-10 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-gray-800 flex items-center justify-center transition-all" data-panel="strumming" title="Rasgueo">
                    <svg class="w-6 h-6" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c-1.613 0-2.882.104-3.825.323l-.23.057C4.926 3.088 3 4.883 3 8c0 3.367 1.939 8.274 4.22 11.125q.48.6 1.03 1.158l.367.36a4.904 4.904 0 0 0 6.752.011a15 15 0 0 0 1.41-1.528C19.27 16.013 21 11.832 21 8c0-3.025-1.813-4.806-4.71-5.562l-.266-.066C15.088 2.122 13.743 2 12 2"/></svg>
                </button>
                <!-- Tabs Tab (New) -->
                <button class="sidebar-nav-btn w-10 h-10 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-gray-800 flex items-center justify-center transition-all" data-panel="tabs" title="Tabs">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </button>
                <!-- Song Sections Tab (New) -->
                <button class="sidebar-nav-btn w-10 h-10 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-gray-800 flex items-center justify-center transition-all" data-panel="song-sections" title="Secciones">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-8a2 2 0 012-2h14a2 2 0 012 2v8M3 13V6a2 2 0 012-2h14a2 2 0 012 2v7m-9-3h2m-2 9h2m-2-4h2"></path></svg>
                </button>
                <!-- Settings Tab -->
                <button class="sidebar-nav-btn w-10 h-10 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-gray-800 flex items-center justify-center transition-all" data-panel="settings" title="Ajustes">
                    <svg class="w-6 h-6" viewBox="0 0 16 16"><path fill="currentColor" d="M6 9.5A2 2 0 0 1 7.937 11H13.5a.5.5 0 0 1 .09.992L13.5 12l-5.563.001a2 2 0 0 1-3.874 0L2.5 12a.5.5 0 0 1-.09-.992L2.5 11h1.563A2 2 0 0 1 6 9.5m0 1a1 1 0 1 0 0 2a1 1 0 0 0 0-2m4-8A2 2 0 0 1 11.937 4H13.5a.5.5 0 0 1 .09.992L13.5 5l-1.563.001a2 2 0 0 1-3.874 0L2.5 5a.5.5 0 0 1-.09-.992L2.5 4h5.563A2 2 0 0 1 10 2.5m0 1a1 1 0 1 0 0 2a1 1 0 0 0 0-2"/></svg>
                </button>
                <!-- Shortcuts Tab -->
                <button class="sidebar-nav-btn w-10 h-10 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-gray-800 flex items-center justify-center transition-all" data-panel="shortcuts" title="Atajos">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            </div>

            <!-- Panel Content Area -->
            <div class="flex-1 flex flex-col bg-[var(--bg-secondary)] overflow-hidden relative">
                
                <!-- PANEL: LYRICS (Default) -->
                <div id="panel-lyrics" class="editor-panel flex flex-col h-full">
                    <div class="px-4 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] shrink-0">
                        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Editor de Letra</h3>
                        
                        <!-- Lyrics/Verses Toggle -->
                        <div class="flex p-1 bg-gray-800 rounded-lg">
                            <button class="lyrics-mode-btn flex-1 py-1 text-xs font-medium rounded-md text-white bg-gray-700 shadow" data-mode="raw">
                                Texto
                            </button>
                            <button class="lyrics-mode-btn flex-1 py-1 text-xs font-medium rounded-md text-gray-400 hover:text-white" data-mode="verses">
                                Versos
                            </button>
                        </div>
                    </div>

                    <div class="flex-1 overflow-hidden relative group">
                        <!-- Mode: RAW TEXT -->
                        <div id="lyrics-mode-raw" class="absolute inset-0 flex flex-col p-4">
                            <div class="flex-1 relative group">
                                <textarea id="editor-lyrics-raw" class="w-full h-full bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-[var(--border-primary)] shadow-inner overflow-y-auto scrollbar-hide transition-colors placeholder-[var(--text-muted)]" placeholder="Escribe o pega la letra aquí...\n\nUsa líneas en blanco para separar estrofas."></textarea>
                                
                                <!-- Scroll Hint (Fade at bottom) -->
                                <div class="absolute bottom-0 left-1 right-3 h-8 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none opacity-50 group-hover:opacity-0 transition-opacity"></div>
                            </div>

                            <div class="text-center py-2 mt-2">
                                <button id="btn-process-lyrics" class="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/20 transition hover:scale-105 active:scale-95 w-full">
                                    Procesar a Versos &rarr;
                                </button>
                            </div>
                        </div>

                        <!-- Mode: VERSES LIST -->
                        <div id="lyrics-mode-verses" class="absolute inset-0 hidden overflow-y-auto scrollbar-hide p-2 space-y-2">
                            <!-- Header for list -->
                            <div class="flex justify-between items-center px-1 pb-2 border-b border-gray-800 mb-2">
                                <span class="text-xs text-gray-500">Versos detectados</span>
                                <span class="text-[10px] text-gray-600">Click para seleccionar</span>
                            </div>
                            <div id="editor-verses-list" class="space-y-1 pb-10">
                                <!-- Verses injected here via JS -->
                                <div class="text-xs text-gray-500 text-center py-4">No hay versos procesados.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PANEL: CHORDS -->
                <div id="panel-chords" class="editor-panel hidden h-full relative flex-col items-center justify-center p-4">
                    
                    <!-- Editor Card (Single Instance in Sidebar) -->
                    <div class="chord-card">
                        
                        <!-- Editable Chord Name -->
                        <h3 id="chord-name" class="chord-title" title="Doble click para editar">Cm/ Do menor</h3>
                        
                        <div class="editor-container">
                            
                            <!-- Fret Selector (Left) -->
                            <div id="fret-selector-container" class="fret-selector">
                                <div id="fret-selector-list" class="fret-selector-list">
                                    <!-- Injected by JS -->
                                </div>
                            </div>

                            <!-- Guitar Grid (Center) -->
                            <div class="guitar-grid-container">
                                <div id="guitar-grid" class="guitar-grid-inner">
                                    <!-- Injected by JS: Strings, Frets, Dots -->
                                </div>
                            </div>

                            <!-- Right Tools (Removed) -->
                        </div>

                    </div>
                    <!-- End Editor Card -->

                    <!-- Save Chord Button - Floating Bottom Right -->
                    <button id="btn-save-chord" class="absolute bottom-2 right-4 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg transition-all transform hover:scale-110 z-10" title="Guardar Acorde">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                    </button>

                </div>

                <!-- PANEL: STRUMMING (Hidden) -->
                <div id="panel-strumming" class="editor-panel hidden flex-col h-full p-4">
                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Rasgueo</h3>
                    <div class="text-center">
                        <div class="text-gray-500 text-sm italic mb-2">Editor de Rasgueo en desarrollo</div>
                        <button class="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs">Cargar Patrón</button>
                    </div>
                </div>


                <!-- PANEL: TABS (Hidden) -->
                <div id="panel-tabs" class="editor-panel hidden flex-col h-full p-4">
                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Tabs</h3>
                    <div class="text-center">
                        <div class="text-gray-500 text-sm italic mb-2">Editor de Tabs en desarrollo</div>
                        <button class="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs">Cargar Tablatura</button>
                    </div>
                </div>

                <!-- PANEL: SONG SECTIONS (Hidden) -->
                <div id="panel-song-sections" class="editor-panel hidden flex-col h-full bg-[var(--bg-secondary)] overflow-y-auto scrollbar-hide">
                    <div class="px-3 py-2 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] shrink-0 sticky top-0 z-10">
                        <h3 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Secciones de Canción</h3>
                    </div>
                    <div class="p-2 space-y-1">
                            <div class="flex flex-col group hover:bg-gray-800 px-1 rounded py-1">
                                <div class="flex items-center justify-between h-6">
                                <label class="text-[10px] text-gray-400 group-hover:text-gray-200 transition cursor-default">Gestionar Secciones</label>
                                <div class="flex items-center space-x-2">
                                    <span id="song-section-count-val" class="text-[10px] text-gray-600 font-mono">0 Secciones</span>
                                    <button id="song-section-add-btn" class="text-[10px] text-gray-500 hover:text-indigo-400 transition font-medium">
                                        Crear
                                    </button>
                                </div>
                                </div>
                                <!-- Container for List of Sections -->
                                <div id="song-sections-list-container" class="mt-1 flex flex-col gap-1 w-full empty:hidden"></div>
                            </div>
                    </div>
                </div>

                <!-- PANEL: SETTINGS (Hidden) -->
                <div id="panel-settings" class="editor-panel hidden flex-col h-full bg-[var(--bg-secondary)] overflow-y-auto scrollbar-hide">
                    <div class="px-3 py-2 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] shrink-0 sticky top-0 z-10">
                        <h3 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ajustes</h3>
                    </div>
                    <div class="p-2 space-y-1">
                        
                        <!-- Tempo -->
                        <div class="flex items-center justify-between group h-6 hover:bg-gray-800 px-1 rounded">
                                <label class="text-[10px] text-gray-400 group-hover:text-gray-200 transition cursor-default">Tempo</label>
                                <input type="number" id="setting-tempo" class="w-16 bg-transparent border-b border-transparent hover:border-gray-600 focus:border-indigo-500 rounded-none px-1 text-right text-gray-300 text-[10px] focus:outline-none transition font-mono" value="120">
                        </div>

                        <!-- Metrica -->
                        <div class="flex items-center justify-between group h-6 hover:bg-gray-800 px-1 rounded">
                                <label class="text-[10px] text-gray-400 group-hover:text-gray-200 transition cursor-default">Métrica</label>
                                <div class="flex items-center space-x-1">
                                    <input type="number" id="setting-time-num" class="w-6 bg-transparent text-center text-gray-300 text-[10px] focus:outline-none focus:text-indigo-400 font-mono" value="4">
                                    <span class="text-gray-600 text-[10px]">/</span>
                                    <input type="number" id="setting-time-den" class="w-6 bg-transparent text-center text-gray-300 text-[10px] focus:outline-none focus:text-indigo-400 font-mono" value="4">
                                </div>
                        </div>

                        <!-- Beat marker -->
                        <div class="flex flex-col group hover:bg-gray-800 px-1 rounded py-1">
                                <div class="flex items-center justify-between h-6">
                                <label class="text-[10px] text-gray-400 group-hover:text-gray-200 transition cursor-default">Beat marker</label>
                                <div class="flex items-center space-x-2">
                                    <span id="setting-beat-marker-val" class="text-[10px] text-gray-600 font-mono">--:--</span>
                                    <button id="setting-beat-marker-btn" class="text-[10px] text-gray-500 hover:text-indigo-400 transition font-medium">
                                        Crear
                                    </button>
                                </div>
                                </div>
                                <!-- Container for List of Sections -->
                                <div id="beat-markers-list-container" class="mt-1 flex flex-col gap-1 w-full empty:hidden"></div>
                        </div>

                        <!-- Snapping -->
                        <div class="flex items-center justify-between group h-6 hover:bg-gray-800 px-1 rounded">
                                <label class="text-[10px] text-gray-400 group-hover:text-gray-200 transition cursor-default">Snapping</label>
                                <input type="checkbox" id="setting-snapping" class="w-3 h-3 rounded-sm border-gray-600 bg-gray-700 text-indigo-500 focus:ring-0 cursor-pointer accent-indigo-500"/>
                        </div>

                        <!-- Grid -->
                        <div class="flex items-center justify-between group h-6 hover:bg-gray-800 px-1 rounded">
                                <label class="text-[10px] text-gray-400 group-hover:text-gray-200 transition cursor-default">Grid</label>
                                <input type="checkbox" id="setting-grid" class="w-3 h-3 rounded-sm border-gray-600 bg-gray-700 text-indigo-500 focus:ring-0 cursor-pointer accent-indigo-500"/>
                        </div>

                        <!-- Subdivision -->
                        <div class="flex items-center justify-between group h-6 hover:bg-gray-800 px-1 rounded">
                                <label class="text-[10px] text-gray-400 group-hover:text-gray-200 transition cursor-default">Subdivision</label>
                                <select id="setting-subdivision" class="bg-transparent text-gray-300 text-[10px] focus:outline-none cursor-pointer border-none p-0 text-right w-12">
                                <option value="1/1">1/1</option>
                                <option value="1/2">1/2</option>
                                <option value="1/4" selected>1/4</option>
                                <option value="1/8">1/8</option>
                                <option value="1/16">1/16</option>
                                </select>
                        </div>

                        <!-- Velocity -->
                        <div class="pt-2 px-1">
                            <div class="flex items-center justify-between mb-1">
                                <label class="text-[10px] text-gray-400">Velocity</label>
                                <span id="velocity-val" class="text-[9px] text-gray-500 font-mono">100</span>
                            </div>
                            <input type="range" id="setting-velocity" min="0" max="127" value="100" class="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500">
                        </div>
                    </div>
                </div>

                ${SyncShortcuts()}
                
            </div>
        </div>
    </div>
`;
