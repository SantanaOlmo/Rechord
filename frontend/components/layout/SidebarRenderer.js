import { CONTENT_BASE_URL } from '../../config.js';

export const SidebarRenderer = {
    renderFolders(folders) {
        if (folders.length === 0) {
            return '<p class="text-xs text-center text-gray-600 mt-4 italic">Sin carpetas</p>';
        }

        return folders.map(f => `
            <div class="folder-wrapper"
                 ondrop="window.handleFolderDrop(event, ${f.id_carpeta})"
                 ondragover="window.handleDragOver(event)"
                 ondragleave="window.handleDragLeave(event)">
                 
                <!-- Header -->
                <div class="folder-header flex items-center px-3 py-1.5 cursor-pointer hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-200"
                     onclick="window.toggleFolder(${f.id_carpeta}, this)"
                     oncontextmenu="window.onFolderContextMenu(event, ${f.id_carpeta})">
                     
                     <svg id="folder-arrow-${f.id_carpeta}" class="w-4 h-4 mr-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                     
                     <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                     
                     <span id="folder-name-${f.id_carpeta}" class="truncate font-medium flex-1">${f.nombre}</span>

                     <!-- Add Song Button -->
                     <!-- Add Song Button -->
                     <button class="text-gray-400 hover:text-white hover:bg-indigo-600 rounded-full p-1 transition-all ml-2 flex-shrink-0 z-10"
                             onclick="window.toggleAddSong(event, ${f.id_carpeta})"
                             title="Añadir canción">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                     </button>
                </div>

                <!-- Content -->
                <div id="folder-content-${f.id_carpeta}" class="hidden flex flex-col">
                    <!-- Injected via JS -->
                </div>
            </div>
        `).join('');
    },

    renderSongs(folderId, songs) {
        if (songs.length === 0) {
            return '<div class="pl-10 py-1 text-gray-600 italic text-xs">Vacío</div>';
        }

        const songsJson = encodeURIComponent(JSON.stringify(songs));

        return songs.map((s, idx) => `
            <div class="group flex items-center pl-4 pr-2 py-1 hover:bg-gray-800 cursor-pointer text-gray-400 hover:text-white"
                 title="${s.titulo} - ${s.artista}"
                 onclick="window.navigate('/song/${s.id_cancion}')"
                 oncontextmenu="window.onSongContextMenu(event, ${folderId}, ${s.id_cancion})">
                 
                 <span class="w-4 text-center mr-2 text-xs opacity-0 group-hover:opacity-100 flex-shrink-0">▶</span>

                 <!-- Thumbnail -->
                 <img src="${CONTENT_BASE_URL}/${s.ruta_imagen || 'assets/images/default-album.png'}" 
                      class="w-6 h-6 rounded object-cover mr-2 bg-gray-800 flex-shrink-0" 
                      onerror="this.src='assets/images/default-album.png'">
                 
                 <div class="flex-1 truncate text-xs">
                     <span class="text-gray-300 block truncate">${s.titulo}</span>
                     <span class="text-gray-600 truncate block text-[10px]">${s.artista}</span>
                 </div>
                 
                 <button class="ml-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity"
                        onclick="event.stopPropagation(); window.removeSongFromFolder(event, ${folderId}, ${s.id_cancion})"
                        title="Quitar de la carpeta">
                     <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 </button>
            </div>
        `).join('');
    }
};
