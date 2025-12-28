
export const SyncHeader = () => `
    <header class="h-14 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] flex items-center justify-between px-4 shrink-0 z-40 relative shadow-sm">
        <!-- Left: Back Button -->
        <button onclick="window.history.back()" class="text-gray-400 hover:text-white flex items-center transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            <span class="font-medium">Volver</span>
        </button>

        <!-- Center: Title (Optional placeholder) -->
        <div class="font-bold text-gray-500 text-sm uppercase tracking-widest hidden md:block">Sincronizador</div>

        <!-- Right: Controls -->
        <div class="flex items-center space-x-3">
            <!-- Metronome Toggle -->
            <button id="toggle-metronome" class="p-2 text-gray-400 hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/10" title="Metronome">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.153 8.188l-.72-3.236a2.493 2.493 0 0 0-4.867 0L5.541 18.566A2 2 0 0 0 7.493 21h7.014a2 2 0 0 0 1.952-2.434l-.524-2.357M11 18l9-13m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/></svg>
            </button>

            <!-- Zoom Controls Removed -->

            <div class="h-6 w-px bg-gray-800 mx-2"></div>

            <button id="btn-save-sync" class="flex items-center space-x-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded font-bold shadow transition-all hover:shadow-indigo-500/20 active:scale-95">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                <span>Guardar</span>
            </button>
        </div>
    </header>
`;
