export function SongGrid() {
    return `
        <!-- Loading State -->
        <div id="loading-songs" class="loading-state">
            <svg class="animate-spin h-10 w-10 text-indigo-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p class="text-gray-400">Cargando tus canciones...</p>
        </div>

        <!-- Empty State -->
        <div id="empty-state" class="empty-state hidden">
            <div class="empty-icon">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
            </div>
            <h3 class="text-xl font-medium text-white mb-2">No tienes canciones aún</h3>
            <p class="text-gray-400 mb-6">Sube tu primera canción para empezar a sincronizar acordes.</p>
            <button onclick="document.getElementById('btn-new-song').click()" class="link-primary">Crear mi primera canción &rarr;</button>
        </div>

        <!-- Grid de Canciones -->
        <div id="songs-grid" class="songs-grid hidden">
            <!-- Las tarjetas se insertarán aquí -->
        </div>
    `;
}
