
import { loadFolders, startInlineRename, setupCreateFolder } from './sidebar/actions.js';
import { setupSelection } from './sidebar/selection.js';
import { setupContextMenu } from './sidebar/contextMenu.js';
import { SidebarRenderer } from './SidebarRenderer.js';
import { carpetaService } from '../../../services/carpetaService.js';
import { search } from '../../../services/cancionService.js';
import { authService } from '../../../services/authService.js';
import { Store, EVENTS } from '../../../core/StateStore.js';
import { CONTENT_BASE_URL } from '../../config.js';

// Re-export specific handlers for inline HTML event attributes
// These need to be attached to window because HTML strings generate 'onclick="window.xxx"'
// We must attach them in initSidebar (or imports if side-effect)

export function FolderSidebar(isMobile = false) {
    setTimeout(() => initSidebar(isMobile), 0);
    const listId = isMobile ? 'folders-list-mobile' : 'folders-list';

    return `
        <div id="resizable-sidebar${isMobile ? '-mobile' : ''}" class="bg-[var(--sidebar-bg)] flex flex-col w-full h-full overflow-hidden z-10 relative" 
             oncontextmenu="window.onBackgroundContextMenu(event)">
            <div class="p-4 flex justify-between items-center bg-[var(--sidebar-bg)]">
                <h2 class="text-[var(--text-secondary)] font-bold text-sm uppercase tracking-wider">Biblioteca</h2>
                ${!isMobile ? `
                <button id="btn-add-folder" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition flex-shrink-0" title="Nueva Carpeta">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </button>` : ''}
            </div>
            <div id="${listId}" class="flex-1 overflow-y-auto p-0 space-y-0 text-sm select-none"></div>
        </div>
    `;
}

function initSidebar(isMobile) {
    loadFolders(isMobile);
    setupCreateFolder(isMobile);
    setupSelection(isMobile);
    setupContextMenu(isMobile);

    // Global expose of functions used in HTML strings
    // Ideally we'd remove inline handlers in future refactors too
    window.toggleFolder = toggleFolder;
    window.handleFolderSearch = handleFolderSearch;
    window.addSongToFolder = addSongToFolder;
    window.removeSongFromFolder = removeSongFromFolder;
    window.playFolderSong = playFolderSong;
    window.handleFolderDrop = handleFolderDrop;
    window.handleDragOver = handleDragOver;
    window.handleDragLeave = handleDragLeave;
    window.toggleAddSong = toggleAddSong;
}


// These functions are "Leaf" logic that were inside FolderSidebar.
// They are specific enough to stay here or move to another file if this file exceeds 200 lines.
// Currently this file is very short (~100 lines), so we can keep them or split "search/dnd".

// ... (Search, DragDrop, Toggle logic) ...
// To be strict, let's put them in 'search.js' and 'dragDrop.js' etc, but simple ones here.

async function toggleFolder(folderId, el, suffix = '') {
    if (el && (el.closest('.folder-search-container') || el.closest('.search-result-item'))) return;

    const s = suffix ? `-${suffix}` : '';
    const content = document.getElementById(`folder-content-${folderId}${s}`);
    const arrow = document.getElementById(`folder-arrow-${folderId}${s}`);

    if (content && content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        arrow?.classList.add('rotate-90');
        content.innerHTML = `
            <div class="px-3 py-2 bg-[var(--bg-tertiary)] folder-search-container hidden" id="search-container-${folderId}${s}">
                <input type="text" class="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs rounded px-2 py-1 outline-none border border-[var(--border-primary)] focus:border-[var(--accent-primary)]"
                    placeholder="Buscar canción..." oninput="window.handleFolderSearch(event, ${folderId}, '${suffix}')">
                <div id="search-results-${folderId}${s}" class="mt-1 space-y-1 max-h-40 overflow-y-auto hidden"></div>
            </div>
            <div id="song-list-${folderId}${s}"><div class="pl-8 py-1 text-[var(--text-muted)] text-xs">Cargando...</div></div>
        `;
        try {
            const songs = await carpetaService.getFolderSongs(folderId);
            document.getElementById(`song-list-${folderId}${s}`).innerHTML = SidebarRenderer.renderSongs(folderId, songs, suffix);
        } catch (e) { /* Error UI */ }
    } else if (content) {
        content.classList.add('hidden');
        arrow?.classList.remove('rotate-90');
    }
}

let searchTimeout;
function handleFolderSearch(e, folderId, suffix = '') {
    const term = e.target.value.trim();
    clearTimeout(searchTimeout);
    if (term.length < 2) return;
    const s = suffix ? `-${suffix}` : '';
    searchTimeout = setTimeout(async () => {
        const results = await search(term);
        const rDiv = document.getElementById(`search-results-${folderId}${s}`);
        if (rDiv) {
            rDiv.classList.remove('hidden');
            rDiv.innerHTML = results.length ? results.map(s => `
                <div class="search-result-item flex items-center p-2 hover:bg-[#237BFF]/20 hover:text-[#237BFF] cursor-pointer rounded border-b border-[var(--border-primary)] last:border-0"
                        onclick="window.addSongToFolder(${folderId}, '${s.id_cancion}', '${suffix}')">
                    <img src="${s.ruta_imagen ? (s.ruta_imagen.startsWith('http') ? s.ruta_imagen : CONTENT_BASE_URL + '/' + s.ruta_imagen) : 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%239ca3af\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Crect x=\'2\' y=\'2\' width=\'20\' height=\'20\' rx=\'2\' ry=\'2\' fill=\'%231f2937\' stroke=\'none\'/%3E%3Cpath d=\'M9 18V5l12-2v13\'/%3E%3Ccircle cx=\'6\' cy=\'18\' r=\'3\'/%3E%3Ccircle cx=\'18\' cy=\'16\' r=\'3\'/%3E%3C/svg%3E'}" 
                         class="w-8 h-8 rounded mr-2 bg-[var(--bg-tertiary)] object-cover flex-shrink-0">
                    <div class="flex-1 overflow-hidden">
                        <p class="text-xs font-medium truncate">${s.titulo}</p>
                        <p class="text-[10px] opacity-70 truncate">${s.artista}</p>
                    </div>
                </div>
            `).join('') : '<div class="p-2 text-center text-[var(--text-muted)] text-xs italic">Sin resultados</div>';
        }
    }, 300);
}

async function addSongToFolder(folderId, songId, suffix = '') {
    if (!authService.isAuthenticated()) return window.location.hash = '#/auth/login';
    try {
        await carpetaService.addSong(folderId, songId);
        const songs = await carpetaService.getFolderSongs(folderId);
        const s = suffix ? `-${suffix}` : '';
        const list = document.getElementById(`song-list-${folderId}${s}`);
        if (list) list.innerHTML = SidebarRenderer.renderSongs(folderId, songs, suffix);
        toggleSearch(folderId, suffix);
    } catch (e) { console.error(e); }
}

function toggleSearch(id, suffix = '') {
    const s = suffix ? `-${suffix}` : '';
    const c = document.getElementById(`search-container-${id}${s}`);
    c?.classList.toggle('hidden');
    if (!c?.classList.contains('hidden')) c?.querySelector('input')?.focus();
}

function toggleAddSong(e, folderId, suffix = '') {
    e.stopPropagation();
    if (!authService.isAuthenticated()) return window.location.hash = '#/auth/login';
    const s = suffix ? `-${suffix}` : '';
    const content = document.getElementById(`folder-content-${folderId}${s}`);
    if (content && content.classList.contains('hidden')) {
        toggleFolder(folderId, null, suffix).then(() => toggleSearch(folderId, suffix));
    } else toggleSearch(folderId, suffix);
}

async function removeSongFromFolder(e, folderId, songId) {
    if (!authService.isAuthenticated()) return window.location.hash = '#/auth/login';
    if (!confirm('¿Quitar?')) return;
    // Wait, reusing confirm for Remove Song? User didn't specify strictness here, only Delete Folder. 
    // But keeping consistent is good.
    await carpetaService.removeSongFromFolder(folderId, songId);
    const songs = await carpetaService.getFolderSongs(folderId);
    document.getElementById(`song-list-${folderId}`).innerHTML = SidebarRenderer.renderSongs(folderId, songs);
}

function playFolderSong(folderId, songsJson, startIndex) {
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
}

// DnD
async function handleFolderDrop(e, folderId) {
    e.preventDefault(); e.stopPropagation();
    e.currentTarget.querySelector('.folder-header')?.classList.remove('bg-indigo-900/50');
    const songId = e.dataTransfer.getData('text/plain');
    if (songId) await addSongToFolder(folderId, songId);
}
function handleDragOver(e) {
    e.preventDefault(); e.dataTransfer.dropEffect = 'copy';
    e.currentTarget.querySelector('.folder-header')?.classList.add('bg-[var(--accent-primary)]/50');
}
function handleDragLeave(e) {
    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return;
    e.currentTarget.querySelector('.folder-header')?.classList.remove('bg-[var(--accent-primary)]/50');
}
