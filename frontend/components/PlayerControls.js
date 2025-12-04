export function PlayerControls(songId, showChords) {
    return `
        <div class="bg-gray-900/90 backdrop-blur-md p-6 pb-8 border-t border-gray-800">
            
            <!-- Progress -->
            <div class="flex items-center space-x-4 mb-4">
                <span id="current-time" class="text-xs text-gray-400 w-10 text-right">0:00</span>
                <div class="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer group relative" id="progress-bar">
                    <div id="progress-fill" class="absolute top-0 left-0 h-full bg-green-500 rounded-full w-0"></div>
                    <div id="progress-handle" class="absolute top-1/2 -mt-1.5 h-3 w-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" style="left: 0%"></div>
                </div>
                <span id="total-time" class="text-xs text-gray-400 w-10">0:00</span>
            </div>

            <!-- Main Buttons -->
            <div class="flex items-center justify-between max-w-3xl mx-auto">
                
                <!-- Left Actions -->
                <div class="flex items-center space-x-6">
                    <button class="text-gray-400 hover:text-white" title="Volver">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                    </button>
                    <button id="btn-font-size" class="text-gray-400 hover:text-white font-serif font-bold text-xl" title="Tamaño Letra">Aa</button>
                </div>

                <!-- Playback Controls -->
                <div class="flex items-center space-x-8">
                    <button class="text-gray-400 hover:text-white">
                        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                    </button>
                    
                    <button id="btn-play" class="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-500 shadow-lg hover:scale-105 transition transform">
                        <svg id="icon-play" class="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        <svg id="icon-pause" class="w-8 h-8 hidden" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    </button>

                    <button class="text-gray-400 hover:text-white">
                        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                    </button>
                </div>

                <!-- Right Actions -->
                <div class="flex items-center space-x-6">
                    <button id="btn-toggle-chords" class="text-gray-400 hover:text-green-400 ${showChords ? 'text-green-400' : ''}" title="Mostrar/Ocultar Acordes">
                        <!-- Piano Icon -->
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5.6 16H13v-9h1.4v9zm-2.8 0H10.2v-9h1.4v9zm-2.8 0H7.4v-9h1.4v9zm8.4 0h-1.4v-9h1.4v9z"/></svg>
                    </button>
                    <a href="#/sincronizador/${songId}" class="text-gray-400 hover:text-white" title="Editar Canción">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </a>
                </div>

            </div>
        </div>
    `;
}
