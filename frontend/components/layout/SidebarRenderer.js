import { CONTENT_BASE_URL } from '../../config.js';

export const SidebarRenderer = {
    renderFolders(folders, suffix = '') {
        if (folders.length === 0) {
            return '<p class="text-xs text-center text-[var(--text-muted)] mt-4 italic">Sin carpetas</p>';
        }

        const s = suffix ? `-${suffix}` : '';


        return folders.map(f => `
            <div class="folder-wrapper"
                 ondrop="window.handleFolderDrop(event, ${f.id_carpeta})"
                 ondragover="window.handleDragOver(event)"
                 ondragleave="window.handleDragLeave(event)">
                 
                <!-- Header -->
                <div class="folder-header flex items-center px-3 py-1.5 cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                     onclick="window.toggleFolder(${f.id_carpeta}, this, '${suffix}')"
                     oncontextmenu="window.onFolderContextMenu(event, ${f.id_carpeta})">
                     
                     <svg id="folder-arrow-${f.id_carpeta}${s}" class="w-4 h-4 mr-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                     
                     <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                     
                     <span id="folder-name-${f.id_carpeta}${s}" class="truncate font-medium flex-1">${f.nombre}</span>

                     <!-- Add Song Button -->
                     <button class="text-[var(--text-muted)] hover:text-white hover:bg-[var(--accent-primary)] rounded-full p-1 transition-all ml-2 flex-shrink-0 z-10"
                             onclick="window.toggleAddSong(event, ${f.id_carpeta}, '${suffix}')"

                             title="Añadir canción">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                     </button>
                </div>

                <!-- Content -->
                <div id="folder-content-${f.id_carpeta}${s}" class="hidden flex flex-col">

                    <!-- Injected via JS -->
                </div>
            </div>
        `).join('');
    },

    renderSongs(folderId, songs, suffix = '') {
        if (songs.length === 0) {
            return '<div class="pl-10 py-1 text-[var(--text-muted)] italic text-xs">Vacío</div>';
        }

        return songs.map((s, idx) => `
            <div class="group flex items-center pl-4 pr-2 py-1 hover:bg-[var(--bg-tertiary)] cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]"

                 title="${s.titulo} - ${s.artista}"
                 onclick="window.navigate('/song/${s.id_cancion}')"
                 oncontextmenu="window.onSongContextMenu(event, ${folderId}, ${s.id_cancion})">
                 
                 <span class="w-4 text-center mr-2 text-xs opacity-0 group-hover:opacity-100 flex-shrink-0">▶</span>

                 <!-- Thumbnail -->
                 <!-- Thumbnail -->
                 ${s.ruta_imagen
                ? `<img src="${CONTENT_BASE_URL}/${s.ruta_imagen}" class="w-6 h-6 rounded object-cover mr-2 bg-[var(--bg-tertiary)] flex-shrink-0" onerror="this.style.display='none'; this.parentNode.querySelector('.fallback-icon').style.display='flex'">`
                : ''}
                 <div class="fallback-icon w-6 h-6 rounded mr-2 bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-muted)] flex-shrink-0 ${s.ruta_imagen ? 'hidden' : 'flex'}">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                 </div>
                 
                 <div class="flex-1 truncate text-xs">
                     <span class="text-[var(--text-secondary)] block truncate">${s.titulo}</span>
                     <span class="text-[var(--text-muted)] truncate block text-[10px]">${s.artista}</span>
                 </div>
                 
                 <button class="ml-2 text-[var(--text-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity"

                        onclick="event.stopPropagation(); window.removeSongFromFolder(event, ${folderId}, ${s.id_cancion})"
                        title="Quitar de la carpeta">
                     <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 </button>
            </div>
        `).join('');
    }
};
