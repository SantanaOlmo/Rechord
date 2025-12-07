import { carpetaService } from '../services/carpetaService.js';
import { search } from '../services/cancionService.js';
import { SidebarRenderer } from './SidebarRenderer.js';
import { Store, EVENTS } from '../core/StateStore.js';
import { CONTENT_BASE_URL } from '../config.js';

export function FolderSidebar() {
    setTimeout(initSidebar, 0);
    return `
        <div class="folder-sidebar w-64 bg-gray-950 border-r border-gray-800 flex flex-col h-full overflow-hidden flex-shrink-0 z-20">
            <div class="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-950">
                <h2 class="text-gray-300 font-bold text-sm uppercase tracking-wider">Biblioteca</h2>
                <button id="btn-add-folder" class="text-gray-500 hover:text-white transition" title="Nueva Carpeta">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </button>
            </div>
            <div id="folders-list" class="flex-1 overflow-y-auto p-0 space-y-0 text-sm select-none"></div>
            <!-- Context Menu -->
            <div id="folder-context-menu" class="fixed bg-gray-900 border border-gray-700 rounded shadow-xl hidden z-50 w-40 text-sm">
                <button id="ctx-rename" class="w-full text-left px-4 py-2 text-gray-300 hover:bg-indigo-600 hover:text-white">Renombrar</button>
                <button id="ctx-delete" class="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/50">Eliminar</button>
            </div>
        </div>
    `;
}

let folders = [];
let ctxFolderId = null;

async function initSidebar() {
    const list = document.getElementById('folders-list');
    const ctxMenu = document.getElementById('folder-context-menu');
    if (!list) return;

    // Load
    const loadFolders = async () => {
        try {
            folders = await carpetaService.getFolders();
            list.innerHTML = SidebarRenderer.renderFolders(folders);
        } catch (e) { console.error(e); }
    };

    // Add
    document.getElementById('btn-add-folder').addEventListener('click', async () => {
        const name = prompt('Carpeta:', 'Nueva');
        if (name) { await carpetaService.createFolder(name); loadFolders(); }
    });

    // Expand/Collapse
    window.toggleFolder = async (folderId, el) => {
        if (el && (el.closest('.folder-search-container') || el.closest('.search-result-item'))) return;
        const content = document.getElementById(`folder-content-${folderId}`);
        const arrow = document.getElementById(`folder-arrow-${folderId}`);

        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            arrow?.classList.add('rotate-90');
            // Simplified content structure
            content.innerHTML = `
                <div class="px-3 py-2 bg-gray-900/50 folder-search-container hidden" id="search-container-${folderId}">
                    <input type="text" class="w-full bg-gray-800 text-gray-300 text-xs rounded px-2 py-1 outline-none border border-gray-700 focus:border-indigo-500"
                        placeholder="Buscar canción..." oninput="window.handleFolderSearch(event, ${folderId})">
                    <div id="search-results-${folderId}" class="mt-1 space-y-1 max-h-40 overflow-y-auto hidden"></div>
                </div>
                <div id="song-list-${folderId}"><div class="pl-8 py-1 text-gray-500 text-xs">Cargando...</div></div>
            `;
            try {
                const songs = await carpetaService.getFolderSongs(folderId);
                document.getElementById(`song-list-${folderId}`).innerHTML = SidebarRenderer.renderSongs(folderId, songs);
            } catch (e) { /* Error UI */ }
        } else {
            content.classList.add('hidden');
            arrow?.classList.remove('rotate-90');
        }
    };

    // Toggle Search
    window.toggleAddSong = (e, folderId) => {
        e.stopPropagation();
        const content = document.getElementById(`folder-content-${folderId}`);
        if (content.classList.contains('hidden')) {
            window.toggleFolder(folderId, null).then(() => toggleSearch(folderId));
        } else toggleSearch(folderId);
    };

    function toggleSearch(id) {
        const c = document.getElementById(`search-container-${id}`);
        c?.classList.toggle('hidden');
        if (!c?.classList.contains('hidden')) c?.querySelector('input')?.focus();
    }

    // Search Logic
    let searchTimeout;
    window.handleFolderSearch = (e, folderId) => {
        const term = e.target.value.trim();
        clearTimeout(searchTimeout);
        if (term.length < 2) return;

        searchTimeout = setTimeout(async () => {
            const results = await search(term);
            const rDiv = document.getElementById(`search-results-${folderId}`);
            rDiv.classList.remove('hidden');
            rDiv.innerHTML = results.length ? results.map(s => `
                <div class="search-result-item flex items-center p-2 hover:bg-gray-800 cursor-pointer rounded border-b border-gray-800/50 last:border-0"
                     onclick="window.addSongToFolder(${folderId}, ${s.id_cancion})">
                    <img src="${CONTENT_BASE_URL}/${s.ruta_imagen || 'assets/images/default-album.png'}" 
                         class="w-8 h-8 rounded object-cover mr-2 bg-gray-800" 
                         onerror="this.src='assets/images/default-album.png'">
                    <div class="flex-1 overflow-hidden">
                        <p class="text-xs text-white font-medium truncate">${s.titulo}</p>
                        <p class="text-[10px] text-gray-400 truncate">${s.artista}</p>
                    </div>
                    <span class="ml-2 text-indigo-400 hover:text-indigo-300 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    </span>
                </div>
            `).join('') : '<div class="p-2 text-center text-gray-500 text-xs italic">Sin resultados</div>';
        }, 300);
    };

    window.addSongToFolder = async (folderId, songId) => {
        try {
            await carpetaService.addSong(folderId, songId);
            const songs = await carpetaService.getFolderSongs(folderId);
            document.getElementById(`song-list-${folderId}`).innerHTML = SidebarRenderer.renderSongs(folderId, songs);
            toggleSearch(folderId); // Close search
        } catch (e) { console.error(e); }
    };

    // Playback using Store
    window.playFolderSong = (folderId, songsJson, startIndex) => {
        const songs = JSON.parse(decodeURIComponent(songsJson));
        const queue = songs.map(s => ({
            id: s.id_cancion,
            title: s.titulo,
            artist: s.artista,
            src: `${CONTENT_BASE_URL}/${s.ruta_mp3 || s.ruta_archivo}`,
            img: `${CONTENT_BASE_URL}/${s.ruta_imagen}`,
            duration: s.duracion
        }));
        Store.publish(EVENTS.PLAYER.PLAY_QUEUE, { queue, startIndex });
    };

    // Drag & Drop
    window.handleFolderDrop = async (e, folderId) => {
        e.preventDefault(); e.stopPropagation();
        e.currentTarget.querySelector('.folder-header')?.classList.remove('bg-indigo-900/50');
        const songId = e.dataTransfer.getData('text/plain');
        if (songId) await window.addSongToFolder(folderId, songId);
    };

    window.handleDragOver = (e) => {
        e.preventDefault(); e.dataTransfer.dropEffect = 'copy';
        e.currentTarget.querySelector('.folder-header')?.classList.add('bg-indigo-900/50');
    };
    window.handleDragLeave = (e) => {
        if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return;
        e.currentTarget.querySelector('.folder-header')?.classList.remove('bg-indigo-900/50');
    };

    window.removeSongFromFolder = async (e, folderId, songId) => {
        if (!confirm('¿Quitar?')) return;
        await carpetaService.removeSongFromFolder(folderId, songId);
        const songs = await carpetaService.getFolderSongs(folderId);
        document.getElementById(`song-list-${folderId}`).innerHTML = SidebarRenderer.renderSongs(folderId, songs);
    };

    // Context Menu
    document.addEventListener('click', () => ctxMenu?.classList.add('hidden'));
    window.onFolderContextMenu = (e, id) => {
        e.preventDefault(); e.stopPropagation();
        ctxFolderId = id;
        ctxMenu.style.left = `${e.pageX}px`; ctxMenu.style.top = `${e.pageY}px`;
        ctxMenu.classList.remove('hidden');
    };
    document.getElementById('ctx-rename').onclick = async () => {
        if (!ctxFolderId) return;
        const newName = prompt('Nombre:');
        if (newName) { await carpetaService.renameFolder(ctxFolderId, newName); loadFolders(); }
    };
    document.getElementById('ctx-delete').onclick = async () => {
        if (ctxFolderId && confirm('¿Borrar?')) { await carpetaService.deleteFolder(ctxFolderId); loadFolders(); }
    };

    loadFolders();
}
