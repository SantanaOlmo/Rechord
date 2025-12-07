import { carpetaService } from '../services/carpetaService.js';
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
            
            <div id="folders-list" class="flex-1 overflow-y-auto p-0 space-y-0 text-sm select-none">
                <!-- Folders injected here -->
            </div>
            
            <!-- Context Menu (Hidden) -->
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
    const btnAdd = document.getElementById('btn-add-folder');
    const ctxMenu = document.getElementById('folder-context-menu');

    if (!list) return;

    // Load Folders
    const loadFolders = async () => {
        try {
            folders = await carpetaService.getFolders();
            renderFolders(list);
        } catch (e) {
            console.error(e);
        }
    };

    // Add Folder
    btnAdd.addEventListener('click', async () => {
        const name = prompt('Nombre de la carpeta:', 'Nueva Carpeta');
        if (name) {
            await carpetaService.createFolder(name);
            loadFolders();
        }
    });

    // Global Functions for inline interaction
    window.toggleFolder = async (folderId, el) => {
        const content = document.getElementById(`folder-content-${folderId}`);
        const arrow = document.getElementById(`folder-arrow-${folderId}`);

        if (content.classList.contains('hidden')) {
            // Expand
            content.classList.remove('hidden');
            arrow.classList.add('rotate-90');
            // Fetch songs if empty or always? Let's refresh.
            content.innerHTML = '<div class="pl-8 py-1 text-gray-500 text-xs">Cargando...</div>';

            try {
                const songs = await carpetaService.getFolderSongs(folderId);
                renderFolderSongs(folderId, songs, content);
            } catch (e) {
                content.innerHTML = '<div class="pl-8 py-1 text-red-500 text-xs">Error</div>';
            }

        } else {
            // Collapse
            content.classList.add('hidden');
            arrow.classList.remove('rotate-90');
        }
    };

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
        window.dispatchEvent(new CustomEvent('play-queue', { detail: { queue, startIndex } }));
    };

    // Context Menu Logic
    document.addEventListener('click', () => ctxMenu?.classList.add('hidden'));

    window.onFolderContextMenu = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        ctxFolderId = id;
        ctxMenu.style.left = `${e.pageX}px`;
        ctxMenu.style.top = `${e.pageY}px`;
        ctxMenu.classList.remove('hidden');
    };

    document.getElementById('ctx-rename').onclick = async () => {
        if (!ctxFolderId) return;
        const newName = prompt('Nuevo nombre:');
        if (newName) {
            await carpetaService.renameFolder(ctxFolderId, newName);
            loadFolders();
        }
    };

    document.getElementById('ctx-delete').onclick = async () => {
        if (!ctxFolderId || !confirm('¿Eliminar carpeta?')) return;
        await carpetaService.deleteFolder(ctxFolderId);
        loadFolders();
    };

    // Initialize
    loadFolders();
}

function renderFolders(container) {
    if (folders.length === 0) {
        container.innerHTML = '<p class="text-xs text-center text-gray-600 mt-4 italic">Sin carpetas</p>';
        return;
    }

    container.innerHTML = folders.map(f => `
        <div class="folder-wrapper"
             ondrop="window.handleFolderDrop(event, ${f.id_carpeta})"
             ondragover="event.preventDefault(); this.querySelector('.folder-header').classList.add('bg-indigo-900/50')"
             ondragleave="this.querySelector('.folder-header').classList.remove('bg-indigo-900/50')">
             
            <!-- Header -->
            <div class="folder-header flex items-center px-3 py-1.5 cursor-pointer hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-200"
                 onclick="window.toggleFolder(${f.id_carpeta}, this)"
                 oncontextmenu="window.onFolderContextMenu(event, ${f.id_carpeta})">
                 
                 <svg id="folder-arrow-${f.id_carpeta}" class="w-4 h-4 mr-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                 
                 <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                 
                 <span class="truncate font-medium">${f.nombre}</span>
            </div>

            <!-- Content -->
            <div id="folder-content-${f.id_carpeta}" class="hidden flex flex-col">
                <!-- Songs go here -->
            </div>
        </div>
    `).join('');
}

function renderFolderSongs(folderId, songs, container) {
    if (songs.length === 0) {
        container.innerHTML = '<div class="pl-10 py-1 text-gray-600 italic text-xs">Vacío</div>';
        return;
    }

    // Encoding songs for passing to JS function
    const songsJson = encodeURIComponent(JSON.stringify(songs));

    container.innerHTML = songs.map((s, idx) => `
        <div class="group flex items-center pl-8 pr-2 py-1 hover:bg-gray-800 cursor-pointer text-gray-400 hover:text-white"
             title="${s.titulo} - ${s.artista}"
             onclick="window.playFolderSong(${folderId}, '${songsJson}', ${idx})">
             
             <span class="w-4 text-center mr-2 text-xs opacity-0 group-hover:opacity-100">▶</span>
             <div class="flex-1 truncate text-xs">
                 <span class="text-gray-300">${s.titulo}</span>
                 <span class="text-gray-600 ml-1">- ${s.artista}</span>
             </div>
             
             <button class="ml-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100"
                    onclick="event.stopPropagation(); window.removeSongFromFolder(event, ${folderId}, ${s.id_cancion})">
                 <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
        </div>
    `).join('');

    // Add logic for removeSongFromFolder to refresh specific folder content? 
    // We need to override the global remove to refresh THIS folder's UI, not the whole list.
    // Or we can rely on toggling off/on.
}

window.removeSongFromFolder = async (e, folderId, songId) => {
    if (!confirm('¿Quitar canción?')) return;
    try {
        await carpetaService.removeSongFromFolder(folderId, songId);
        // Refresh UI: simply toggle twice (close, open) to reload
        const el = document.querySelector(`.folder-header[onclick*="${folderId}"]`);
        if (el) {
            window.toggleFolder(folderId, null); // Close
            setTimeout(() => window.toggleFolder(folderId, null), 50); // Open
        }
    } catch (err) { console.error(err); }
};
