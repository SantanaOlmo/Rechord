import { carpetaService } from '../../services/carpetaService.js';
import { search } from '../../services/cancionService.js';
import { SidebarRenderer } from './SidebarRenderer.js';
import { Store, EVENTS } from '../../core/StateStore.js';
import { CONTENT_BASE_URL } from '../../config.js';
import { authService } from '../../services/authService.js';

export function FolderSidebar(isMobile = false) {
    // If mobile, use different ID for list
    const listId = isMobile ? 'folders-list-mobile' : 'folders-list';

    // Defer initialization
    setTimeout(() => initSidebar(isMobile), 0);

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
            
            <!-- Context Menu (Only needed once globally, but structure here is duplicated. It's hidden/fixed so it doesn't matter much unless IDs conflict.) -->
            <!-- Actually, context menu IDs are unique. We should NOT render it twice or we get duplicates. -->
            <!-- Render context menu ONLY if not mobile OR handle duplicates. best to check if exists. -->
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
        </div>
    `;
}

let folders = [];
let ctxFolderId = null;
let ctxSongId = null;
let ctxSongFolderId = null;

async function initSidebar(isMobile) {
    const listId = isMobile ? 'folders-list-mobile' : 'folders-list';
    const list = document.getElementById(listId);

    // Only init context menu listeners ONCE globally
    if (!window.sidebarContextInitialized) {
        window.sidebarContextInitialized = true;
        // Context Menu Logic
        const ctxMenu = document.getElementById('folder-context-menu'); // This assumes context menu is in DOM. 
        // Strategy: Put context menu in Main Layout or ensure it's rendered by Desktop sidebar.
        // If mobile renders first/only, it might be missing?
        // For now, assuming Desktop sidebar exists invisible or we put it in root.
    }

    if (!list) return;

    const suffix = isMobile ? 'mobile' : '';

<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
    // Load
    const loadFolders = async () => {
        try {
            folders = await carpetaService.getFolders();
            // Pass suffix to renderer
            list.innerHTML = SidebarRenderer.renderFolders(folders, suffix);
        } catch (e) { console.error(e); }
    };

    // Add (Only for Desktop usually, but if mobile button exists...)
    // Shared ID btn-add-folder might be an issue if duplicated. Mobile uses different layout?
    // Mobile view doesn't have the add button in this simplified code.

<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
    document.getElementById('btn-add-folder')?.addEventListener('click', async () => {
        if (!authService.isAuthenticated()) return window.location.hash = '#/auth/login';
        const name = prompt('Carpeta:', 'Nueva');
        if (name) { await carpetaService.createFolder(name); loadFolders(); }
    });

    // Expose Global Loader for other components to trigger refresh
    window.loadSidebarFolders = loadFolders;

    // Expand/Collapse - Suffix Aware
    window.toggleFolder = async (folderId, el, suffix = '') => {
        if (el && (el.closest('.folder-search-container') || el.closest('.search-result-item'))) return;

        const s = suffix ? `-${suffix}` : '';
        const content = document.getElementById(`folder-content-${folderId}${s}`);
        const arrow = document.getElementById(`folder-arrow-${folderId}${s}`);

        if (content && content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            arrow?.classList.add('rotate-90');

            // Simplified content structure
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
                // Render Songs with Suffix too
                document.getElementById(`song-list-${folderId}${s}`).innerHTML = SidebarRenderer.renderSongs(folderId, songs, suffix);
            } catch (e) { /* Error UI */ }
        } else if (content) {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
            content.classList.add('hidden');
            arrow?.classList.remove('rotate-90');
        }
    };

    // Toggle Search
    window.toggleAddSong = (e, folderId, suffix = '') => {
        e.stopPropagation();
        if (!authService.isAuthenticated()) return window.location.hash = '#/auth/login';

        const s = suffix ? `-${suffix}` : '';
        const content = document.getElementById(`folder-content-${folderId}${s}`);

        if (content && content.classList.contains('hidden')) {
            window.toggleFolder(folderId, null, suffix).then(() => toggleSearch(folderId, suffix));
        } else toggleSearch(folderId, suffix);
    };

    function toggleSearch(id, suffix = '') {
        const s = suffix ? `-${suffix}` : '';
        const c = document.getElementById(`search-container-${id}${s}`);
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
        c?.classList.toggle('hidden');
        if (!c?.classList.contains('hidden')) c?.querySelector('input')?.focus();
    }

    // Search Logic
    let searchTimeout;
    window.handleFolderSearch = (e, folderId, suffix = '') => {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
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
                    <div class="search-result-item flex items-center p-2 hover:bg-[var(--bg-tertiary)] cursor-pointer rounded border-b border-[var(--border-primary)] last:border-0"
                         onclick="window.addSongToFolder(${folderId}, ${s.id_cancion}, '${suffix}')">
                        <div class="w-8 h-8 rounded mr-2 bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-muted)]">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                        </div>
                        <div class="flex-1 overflow-hidden">
                            <p class="text-xs text-[var(--text-primary)] font-medium truncate">${s.titulo}</p>
                            <p class="text-[10px] text-[var(--text-muted)] truncate">${s.artista}</p>
                        </div>
                        <span class="ml-2 text-[var(--accent-light)] hover:text-[var(--accent-hover)] transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        </span>
                    </div>
                `).join('') : '<div class="p-2 text-center text-[var(--text-muted)] text-xs italic">Sin resultados</div>';
            }
        }, 300);
    };

    window.addSongToFolder = async (folderId, songId, suffix = '') => {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
        if (!authService.isAuthenticated()) return window.location.hash = '#/auth/login';
        try {
            await carpetaService.addSong(folderId, songId);
            const songs = await carpetaService.getFolderSongs(folderId);
            const s = suffix ? `-${suffix}` : '';
            const list = document.getElementById(`song-list-${folderId}${s}`);
            if (list) list.innerHTML = SidebarRenderer.renderSongs(folderId, songs, suffix);
            toggleSearch(folderId, suffix); // Close search
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
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
        e.currentTarget.querySelector('.folder-header')?.classList.add('bg-[var(--accent-primary)]/50');
    };
    window.handleDragLeave = (e) => {
        if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return;
        e.currentTarget.querySelector('.folder-header')?.classList.remove('bg-[var(--accent-primary)]/50');
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
    };

    window.removeSongFromFolder = async (e, folderId, songId) => {
        if (!authService.isAuthenticated()) return window.location.hash = '#/auth/login';
        if (!confirm('¿Quitar?')) return;
        await carpetaService.removeSongFromFolder(folderId, songId);
        const songs = await carpetaService.getFolderSongs(folderId);
        document.getElementById(`song-list-${folderId}`).innerHTML = SidebarRenderer.renderSongs(folderId, songs);
    };


<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)

    function showContextMenu(e, type) {
        // Reset visibility
        ['ctx-new-folder', 'ctx-add-song', 'ctx-rename', 'ctx-remove-song', 'ctx-delete', 'ctx-separator'].forEach(id => {
            document.getElementById(id)?.classList.add('hidden');
        });

        if (type === 'bg') {
            document.getElementById('ctx-new-folder')?.classList.remove('hidden');
        } else if (type === 'folder') {
            document.getElementById('ctx-add-song')?.classList.remove('hidden');
            document.getElementById('ctx-rename')?.classList.remove('hidden');
            document.getElementById('ctx-separator')?.classList.remove('hidden');
            document.getElementById('ctx-delete')?.classList.remove('hidden');
        } else if (type === 'song') {
            document.getElementById('ctx-remove-song')?.classList.remove('hidden');
        }

        ctxMenu.style.left = `${e.pageX}px`;
        ctxMenu.style.top = `${e.pageY}px`;
        ctxMenu.classList.remove('hidden');
    }

    // Actions
    const btnNewFolder = document.getElementById('ctx-new-folder');
    if (btnNewFolder) {
        btnNewFolder.onclick = async () => {
            const name = prompt('Nombre de la carpeta:', 'Nueva Carpeta');
            if (name) { await carpetaService.createFolder(name); loadFolders(); }
        };
    }

    const btnRename = document.getElementById('ctx-rename');
    if (btnRename) {
        btnRename.onclick = () => {
            if (!ctxFolderId) return;
            window.startInlineRename(ctxFolderId);
        };
    }
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)

    window.startInlineRename = (folderId) => {
        const span = document.getElementById(`folder-name-${folderId}`);
        if (!span) return;

        const currentName = span.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentName;
        input.className = 'w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded px-1 outline-none border border-[var(--accent-primary)] text-xs py-0.5';
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)

        // Replace span with input
        span.replaceWith(input);
        input.focus();
        input.select();

        const save = async () => {
            const newName = input.value.trim();
            if (newName && newName !== currentName) {
                await carpetaService.renameFolder(folderId, newName);
                loadFolders(); // Reload to restore UI state
            } else {
                input.replaceWith(span); // Revert if empty or unchanged
            }
        };

        input.addEventListener('blur', save);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                input.blur(); // Triggers save
            } else if (e.key === 'Escape') {
                input.removeEventListener('blur', save); // Prevent saving on blur
                input.replaceWith(span);
            }
        });

        // Prevent click propagation to folder toggle
        input.addEventListener('click', (e) => e.stopPropagation());
    };

    const btnAddCtx = document.getElementById('ctx-add-song');
    if (btnAddCtx) {
        btnAddCtx.onclick = () => {
            if (ctxFolderId) window.toggleAddSong({ stopPropagation: () => { } }, ctxFolderId);
        };
    }

    const btnDelete = document.getElementById('ctx-delete');
    if (btnDelete) {
        btnDelete.onclick = async () => {
            if (ctxFolderId && confirm('¿Borrar carpeta permanentemente?')) {
                await carpetaService.deleteFolder(ctxFolderId);
                loadFolders();
            }
        };
    }

    const btnRemoveSong = document.getElementById('ctx-remove-song');
    if (btnRemoveSong) {
        btnRemoveSong.onclick = async () => {
            if (ctxSongFolderId && ctxSongId && confirm('¿Quitar canción de la carpeta?')) {
                await carpetaService.removeSongFromFolder(ctxSongFolderId, ctxSongId);
                const songs = await carpetaService.getFolderSongs(ctxSongFolderId);
                document.getElementById(`song-list-${ctxSongFolderId}`).innerHTML = SidebarRenderer.renderSongs(ctxSongFolderId, songs);
            }
        };
    }
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)

    loadFolders();
}
