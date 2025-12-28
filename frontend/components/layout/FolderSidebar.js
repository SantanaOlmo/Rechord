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

    if (!list) return;

    const suffix = isMobile ? 'mobile' : '';

    // Inject Context Menu & Modal if not exists
    if (!document.getElementById('folder-context-menu')) {
        const menuHtml = `
            <div id="folder-context-menu" class="fixed z-50 bg-[var(--bg-secondary)] border border-[var(--border-primary)] shadow-xl rounded-md py-1 hidden w-48 text-sm select-none">
                <div id="ctx-new-folder" class="px-4 py-2 hover:bg-[var(--bg-tertiary)] cursor-pointer text-[var(--text-primary)] hidden">Nueva Carpeta</div>
                <div id="ctx-add-song" class="px-4 py-2 hover:bg-[var(--bg-tertiary)] cursor-pointer text-[var(--text-primary)] hidden">Añadir Canción</div>
                <div id="ctx-rename" class="px-4 py-2 hover:bg-[var(--bg-tertiary)] cursor-pointer text-[var(--text-primary)] hidden">Renombrar</div>
                <div id="ctx-separator" class="border-t border-[var(--border-primary)] my-1 hidden"></div>
                <div id="ctx-delete" class="px-4 py-2 hover:bg-red-900/30 text-red-400 cursor-pointer hidden">Eliminar Carpeta</div>
                <div id="ctx-remove-song" class="px-4 py-2 hover:bg-red-900/30 text-red-400 cursor-pointer hidden">Quitar de Carpeta</div>
            </div>

            <!-- Custom Confirm Modal -->
             <div id="confirm-modal" class="fixed inset-0 z-[70] flex items-center justify-center hidden opacity-0 transition-opacity duration-200 pointer-events-none">
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="confirm-backdrop"></div>
                <div class="relative bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-2xl w-80 text-center transform scale-95 transition-transform duration-200" id="confirm-content">
                    <div class="w-12 h-12 rounded-full bg-red-900/20 text-red-500 flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </div>
                    <h3 class="text-[var(--text-primary)] font-bold text-lg mb-2">¿Eliminar Carpeta?</h3>
                    <p class="text-[var(--text-secondary)] text-sm mb-6">Esta acción es irreversible y eliminará el contenido de la carpeta.</p>
                    <div class="flex justify-center space-x-3">
                        <button id="btn-cancel-modal" class="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] text-sm font-medium transition cursor-pointer">Cancelar</button>
                        <button id="btn-confirm-delete" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-bold transition shadow-lg cursor-pointer hover:scale-105">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', menuHtml);

        // Close on click outside context menu
        document.addEventListener('click', (e) => {
            const cx = document.getElementById('folder-context-menu');
            if (cx && !cx.contains(e.target)) cx.classList.add('hidden');
        });
    }
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


    // Inject Context Menu if not exists
    if (!document.getElementById('folder-context-menu')) {
        const menuHtml = `
            <div id="folder-context-menu" class="fixed z-50 bg-[var(--bg-secondary)] border border-[var(--border-primary)] shadow-xl rounded-md py-1 hidden w-48 text-sm">
                <div id="ctx-new-folder" class="px-4 py-2 hover:bg-[var(--bg-tertiary)] cursor-pointer text-[var(--text-primary)] hidden">Nueva Carpeta</div>
                <div id="ctx-add-song" class="px-4 py-2 hover:bg-[var(--bg-tertiary)] cursor-pointer text-[var(--text-primary)] hidden">Añadir Canción</div>
                <div id="ctx-rename" class="px-4 py-2 hover:bg-[var(--bg-tertiary)] cursor-pointer text-[var(--text-primary)] hidden">Renombrar</div>
                <div id="ctx-separator" class="border-t border-[var(--border-primary)] my-1 hidden"></div>
                <div id="ctx-delete" class="px-4 py-2 hover:bg-red-900/30 text-red-400 cursor-pointer hidden">Eliminar Carpeta</div>
                <div id="ctx-remove-song" class="px-4 py-2 hover:bg-red-900/30 text-red-400 cursor-pointer hidden">Quitar de Carpeta</div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', menuHtml);

        // Close on click outside
        document.addEventListener('click', () => {
            document.getElementById('folder-context-menu')?.classList.add('hidden');
        });
    }

    const btnAdd = document.getElementById('btn-add-folder');
    if (btnAdd) {
        // Use .onclick to prevent duplicates
        btnAdd.onclick = async () => {
            if (!authService.isAuthenticated()) return window.location.hash = '#/auth/login';

            // Count existing "Nueva Carpeta" to suggest a number
            const count = folders ? folders.filter(f => f.nombre && f.nombre.startsWith('Nueva Carpeta')).length : 0;
            const name = `Nueva Carpeta ${count + 1}`;

            // Create immediately
            const result = await carpetaService.createFolder(name);

            // Reload UI to show it
            await loadFolders();

            // Check both id_carpeta (DB) and id
            const newId = result?.id_carpeta || result?.id;

            if (newId) {
                setTimeout(() => window.startInlineRename(newId), 50);
            }
        };
    }

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

        c?.classList.toggle('hidden');
        if (!c?.classList.contains('hidden')) c?.querySelector('input')?.focus();
    }

    // Search Logic
    let searchTimeout;
    window.handleFolderSearch = (e, folderId, suffix = '') => {

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

        if (!authService.isAuthenticated()) return window.location.hash = '#/auth/login';
        try {
            await carpetaService.addSong(folderId, songId);
            const songs = await carpetaService.getFolderSongs(folderId);
            const s = suffix ? `-${suffix}` : '';
            const list = document.getElementById(`song-list-${folderId}${s}`);
            if (list) list.innerHTML = SidebarRenderer.renderSongs(folderId, songs, suffix);
            toggleSearch(folderId, suffix); // Close search

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

    };

    window.removeSongFromFolder = async (e, folderId, songId) => {
        if (!authService.isAuthenticated()) return window.location.hash = '#/auth/login';
        if (!confirm('¿Quitar?')) return;
        await carpetaService.removeSongFromFolder(folderId, songId);
        const songs = await carpetaService.getFolderSongs(folderId);
        document.getElementById(`song-list-${folderId}`).innerHTML = SidebarRenderer.renderSongs(folderId, songs);



        // Selection State
        let selectedFolderIds = new Set();
        let selectionBox = null;
        let startX, startY;

        // Determine the correct list container ID
        const listId = isMobile ? 'folders-list-mobile' : 'folders-list';
        // Selection Handling
        const listContainer = document.getElementById(listId);
        if (listContainer) {
            listContainer.style.position = 'relative'; // Ensure relative for absolute box

            listContainer.addEventListener('mousedown', (e) => {
                // Ignore if clicking interactive elements or right click
                if (e.target.closest('button') || e.target.closest('input') || e.button !== 0) return;

                // Check if clicking a folder header
                const folderHeader = e.target.closest('.folder-header');
                if (folderHeader) {
                    const folderWrapper = folderHeader.closest('.folder-wrapper');
                    // Extract ID from wrapper onclick or similar? 
                    // SidebarRenderer renders: oncontextmenu="window.onFolderContextMenu(event, ${f.id_carpeta})"
                    // We can parse ID from the ID attribute of elements inside? 
                    // folder-name-${id} exists.
                    const nameId = folderWrapper.querySelector('[id^="folder-name-"]')?.id;
                    if (nameId) {
                        const id = parseInt(nameId.split('-')[2]);
                        if (!e.ctrlKey && !e.shiftKey && !selectedFolderIds.has(id)) {
                            clearSelection();
                            addToSelection(id);
                        } else if (e.ctrlKey) {
                            toggleSelection(id);
                        }
                        // Shift logic omitted for brevity, user asked for drag
                    }
                    return;
                }

                // Start Drag Selection
                startX = e.layerX; // relative to container
                startY = e.layerY + listContainer.scrollTop;

                // Create Box
                selectionBox = document.createElement('div');
                selectionBox.className = 'absolute bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)] z-50 pointer-events-none';
                selectionBox.style.left = startX + 'px';
                selectionBox.style.top = startY + 'px';
                listContainer.appendChild(selectionBox);

                if (!e.ctrlKey) clearSelection();

                const onMouseMove = (ev) => {
                    const currentX = ev.layerX;
                    const currentY = ev.layerY + listContainer.scrollTop;

                    const width = Math.abs(currentX - startX);
                    const height = Math.abs(currentY - startY);
                    const left = Math.min(currentX, startX);
                    const top = Math.min(currentY, startY);

                    selectionBox.style.width = width + 'px';
                    selectionBox.style.height = height + 'px';
                    selectionBox.style.left = left + 'px';
                    selectionBox.style.top = top + 'px';

                    // Check Collisions
                    const boxRect = { left: left, top: top, right: left + width, bottom: top + height };

                    // We need to check against folder headers specifically
                    const headers = listContainer.querySelectorAll('.folder-header');
                    headers.forEach(header => {
                        const headerRect = {
                            left: header.offsetLeft,
                            top: header.offsetTop,
                            right: header.offsetLeft + header.offsetWidth,
                            bottom: header.offsetTop + header.offsetHeight
                        };

                        // Simple AABB collision inside the scrollable container logic is tricky due to scroll.
                        // Using standard rects usually easier, but let's try relative logic matching
                        if (boxRect.left < headerRect.right && boxRect.right > headerRect.left &&
                            boxRect.top < headerRect.bottom && boxRect.bottom > headerRect.top) {
                            const wrapper = header.closest('.folder-wrapper');
                            const nameId = wrapper.querySelector('[id^="folder-name-"]')?.id;
                            if (nameId) {
                                const id = parseInt(nameId.split('-')[2]);
                                addToSelection(id);
                            }
                        }
                        // Note: Deselecting items that leave the box typically requires tracking "pre-drag selection"
                        // For simplicity, this additive drag is standard "add to selection".
                    });
                };

                const onMouseUp = () => {
                    selectionBox?.remove();
                    selectionBox = null;
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }

        function addToSelection(id) {
            selectedFolderIds.add(id);
            highlightFolder(id, true);
        }
        function toggleSelection(id) {
            if (selectedFolderIds.has(id)) {
                selectedFolderIds.delete(id);
                highlightFolder(id, false);
            } else {
                addToSelection(id);
            }
        }
        function clearSelection() {
            selectedFolderIds.forEach(id => highlightFolder(id, false));
            selectedFolderIds.clear();
        }
        function highlightFolder(id, active) {
            const s = isMobile ? '-mobile' : '';
            // SidebarRenderer uses folder-name-ID but wrapper doesn't have ID. 
            // We can find the header via the name element
            const nameEl = document.getElementById(`folder-name-${id}${s}`);
            if (nameEl) {
                const header = nameEl.closest('.folder-header');
                if (header) {
                    if (active) header.classList.add('bg-[var(--accent-primary)]', 'text-white');
                    else header.classList.remove('bg-[var(--accent-primary)]', 'text-white');
                }
            }
        }

        // Global Context Menu Handlers (Updated for Multi-Select)
        window.onFolderContextMenu = (e, folderId) => {
            e.preventDefault();
            e.stopPropagation();

            // If clicking outside selection, reset selection into single
            if (!selectedFolderIds.has(folderId)) {
                clearSelection();
                addToSelection(folderId);
            }

            ctxFolderId = folderId; // Primary target for single actions
            ctxSongId = null;
            showContextMenu(e, 'folder');
        };

        window.onBackgroundContextMenu = (e) => {
            e.preventDefault();
            // showContextMenu(e, 'bg'); // Optional: Right click on empty space
        };

        function showContextMenu(e, type) {
            const ctxMenu = document.getElementById('folder-context-menu');
            if (!ctxMenu) return;

            // Reset visibility
            ['ctx-new-folder', 'ctx-add-song', 'ctx-rename', 'ctx-remove-song', 'ctx-delete', 'ctx-separator'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('hidden');
            });

            if (type === 'bg') {
                document.getElementById('ctx-new-folder')?.classList.remove('hidden');
            } else if (type === 'folder') {
                document.getElementById('ctx-rename')?.classList.remove('hidden');
                document.getElementById('ctx-separator')?.classList.remove('hidden');

                const delLabel = document.getElementById('ctx-delete');
                if (delLabel) {
                    delLabel.classList.remove('hidden');
                    delLabel.textContent = selectedFolderIds.size > 1 ? `Eliminar ${selectedFolderIds.size} Carpetas` : 'Eliminar Carpeta';
                }

                // Disable Rename if multiple
                if (selectedFolderIds.size > 1) {
                    document.getElementById('ctx-rename')?.classList.add('hidden');
                }

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
                // Cannot rename multiple at once efficiently nicely, restrict to 1
                if (selectedFolderIds.size !== 1) return;
                // Use the one in set or the context target
                const target = ctxFolderId || [...selectedFolderIds][0];
                window.startInlineRename(target);
            };
        }


        window.startInlineRename = (folderId) => {
            const span = document.getElementById(`folder-name-${folderId}`);
            if (!span) return;

            const currentName = span.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentName;
            input.className = 'w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded px-1 outline-none border border-[var(--accent-primary)] text-xs py-0.5';


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
            btnDelete.onclick = () => {
                if (selectedFolderIds.size === 0 && !ctxFolderId) return;

                // If nothing selected but context used (should resolve to single select), force sync
                if (selectedFolderIds.size === 0 && ctxFolderId) selectedFolderIds.add(ctxFolderId);

                const count = selectedFolderIds.size;

                // Custom Text for Modal
                const modalTitle = document.querySelector('#confirm-content h3');
                const modalText = document.querySelector('#confirm-content p');
                if (modalTitle) modalTitle.textContent = count > 1 ? `¿Eliminar ${count} Carpetas?` : '¿Eliminar Carpeta?';
                if (modalText) modalText.textContent = 'Esta acción no se puede deshacer.';

                showConfirmModal(async () => {
                    // Optimistic UI Update: Remove ALL IDs
                    const oldFolders = [...folders];
                    const idsToDelete = [...selectedFolderIds];

                    folders = folders.filter(f => !idsToDelete.includes(f.id_carpeta));

                    const list = document.getElementById(isMobile ? 'folders-list-mobile' : 'folders-list');
                    const suffix = isMobile ? 'mobile' : '';
                    if (list) list.innerHTML = SidebarRenderer.renderFolders(folders, suffix);

                    try {
                        // Execute all deletes
                        await Promise.all(idsToDelete.map(id => carpetaService.deleteFolder(id)));
                        selectedFolderIds.clear();
                    } catch (e) {
                        console.error("Delete failed", e);
                        folders = oldFolders;
                        if (list) list.innerHTML = SidebarRenderer.renderFolders(folders, suffix);
                        alert("Error al eliminar alguna carpeta");
                    }
                });
            };
        }

        // Modal Logic Helper
        function showConfirmModal(onConfirm) {
            const modal = document.getElementById('confirm-modal');
            const backdrop = document.getElementById('confirm-backdrop');
            const content = document.getElementById('confirm-content');
            const btnCancel = document.getElementById('btn-cancel-modal');
            const btnConfirm = document.getElementById('btn-confirm-delete');

            if (!modal) return;

            // Show
            modal.classList.remove('hidden');
            // Small delay for transition
            setTimeout(() => {
                modal.classList.remove('opacity-0', 'pointer-events-none');
                content.classList.remove('scale-95');
                content.classList.add('scale-100');
            }, 10);

            const close = () => {
                modal.classList.add('opacity-0', 'pointer-events-none');
                content.classList.remove('scale-100');
                content.classList.add('scale-95');
                setTimeout(() => modal.classList.add('hidden'), 200);

                // Cleanup listeners to avoid duplicates
                btnConfirm.onclick = null;
                btnCancel.onclick = null;
            };

            btnCancel.onclick = close;
            backdrop.onclick = close;

            btnConfirm.onclick = () => {
                close();
                if (onConfirm) onConfirm();
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


        loadFolders();
    }
