import { sidebarState } from './state.js';
import { carpetaService } from '../../../services/carpetaService.js';
import { SidebarRenderer } from '../SidebarRenderer.js';
import { startInlineRename, loadFolders, setupCreateFolder } from './actions.js';
import { addToSelection, clearSelection } from './selection.js';

export function setupContextMenu(isMobile) {
    // Inject HTML if needed
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
            
             <div id="confirm-modal" class="fixed inset-0 z-[70] flex items-center justify-center hidden opacity-0 transition-opacity duration-200 pointer-events-none">
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="confirm-backdrop"></div>
                <div class="relative bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-2xl w-80 text-center transform scale-95 transition-transform duration-200" id="confirm-content">
                    <div class="w-12 h-12 rounded-full bg-red-900/20 text-red-500 flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </div>
                    <h3 class="text-[var(--text-primary)] font-bold text-lg mb-2">¿Eliminar Carpeta?</h3>
                    <p class="text-[var(--text-secondary)] text-sm mb-6">Esta acción es irreversible.</p>
                    <div class="flex justify-center space-x-3">
                        <button id="btn-cancel-modal" class="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] text-sm font-medium transition cursor-pointer">Cancelar</button>
                        <button id="btn-confirm-delete" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-bold transition shadow-lg cursor-pointer hover:scale-105">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', menuHtml);

        document.addEventListener('click', (e) => {
            const cx = document.getElementById('folder-context-menu');
            if (cx && !cx.contains(e.target)) cx.classList.add('hidden');
        });
    }

    // Handlers
    window.onFolderContextMenu = (e, folderId) => {
        e.preventDefault(); e.stopPropagation();
        if (!sidebarState.selectedFolderIds.has(folderId)) {
            clearSelection(isMobile);
            addToSelection(folderId, isMobile);
        }
        sidebarState.setCtxFolderId(folderId);
        showContextMenu(e, 'folder');
    };

    window.onBackgroundContextMenu = (e) => {
        e.preventDefault();
        // showContextMenu(e, 'bg'); 
    };

    setupContextActions(isMobile);
}

function showContextMenu(e, type) {
    const ctxMenu = document.getElementById('folder-context-menu');
    if (!ctxMenu) return;

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
            const count = sidebarState.selectedFolderIds.size;
            delLabel.textContent = count > 1 ? `Eliminar ${count} Carpetas` : 'Eliminar Carpeta';
        }
        if (sidebarState.selectedFolderIds.size > 1) {
            document.getElementById('ctx-rename')?.classList.add('hidden');
        }
    }

    ctxMenu.style.left = `${e.pageX}px`;
    ctxMenu.style.top = `${e.pageY}px`;
    ctxMenu.classList.remove('hidden');
}

function setupContextActions(isMobile) {
    const btnNewFolder = document.getElementById('ctx-new-folder');
    if (btnNewFolder) {
        btnNewFolder.onclick = async () => {
            // Re-use logic from button, but here we can prompt or just create
            // The user wanted prompt for ctx menu? Logic in original code used prompt.
            // But user dislikes alerts. We might want to use the same inline logic.
            // For now, let's call the same consistent logic: Create Default + Inline Rename
            // We can reuse action logic if we had exported it cleanly, or just copy "Create Default" approach
            // Simulating click on add button or calling similar logic
            const count = sidebarState.folders.filter(f => f.nombre && f.nombre.startsWith('Nueva Carpeta')).length;
            const name = `Nueva Carpeta ${count + 1}`;
            const result = await carpetaService.createFolder(name);
            await loadFolders(isMobile);
            if (result?.id) setTimeout(() => startInlineRename(result.id, isMobile), 50);
        };
    }

    const btnRename = document.getElementById('ctx-rename');
    if (btnRename) {
        btnRename.onclick = () => {
            if (sidebarState.selectedFolderIds.size !== 1) return;
            const target = sidebarState.ctxFolderId || [...sidebarState.selectedFolderIds][0];
            startInlineRename(target); // No need for isMobile, it's auto-detected
        };
    }

    // Delete Logic
    const btnDelete = document.getElementById('ctx-delete');
    if (btnDelete) {
        btnDelete.onclick = () => {
            const count = sidebarState.selectedFolderIds.size;
            if (count === 0 && !sidebarState.ctxFolderId) return;
            if (count === 0 && sidebarState.ctxFolderId) sidebarState.addSelection(sidebarState.ctxFolderId);

            const modalTitle = document.querySelector('#confirm-content h3');
            const modalText = document.querySelector('#confirm-content p');
            if (modalTitle) modalTitle.textContent = sidebarState.selectedFolderIds.size > 1 ? `¿Eliminar ${sidebarState.selectedFolderIds.size} Carpetas?` : '¿Eliminar Carpeta?';

            showConfirmModal(async () => {
                const oldFolders = [...sidebarState.folders];
                const idsToDelete = [...sidebarState.selectedFolderIds];

                // Optimistic
                sidebarState.setFolders(sidebarState.folders.filter(f => !idsToDelete.includes(f.id_carpeta)));

                ['folders-list', 'folders-list-mobile'].forEach(id => {
                    const list = document.getElementById(id);
                    if (list) {
                        const suffix = id.includes('mobile') ? 'mobile' : '';
                        list.innerHTML = SidebarRenderer.renderFolders(sidebarState.folders, suffix);
                    }
                });

                try {
                    await Promise.all(idsToDelete.map(id => carpetaService.deleteFolder(id)));
                    sidebarState.clearSelection();
                } catch (e) {
                    console.error(e);
                    sidebarState.setFolders(oldFolders);
                    if (list) list.innerHTML = SidebarRenderer.renderFolders(sidebarState.folders, suffix);
                    // alert("Error"); // User dislikes alerts, maybe toast?
                }
            });
        };
    }
}

function showConfirmModal(onConfirm) {
    const modal = document.getElementById('confirm-modal');
    if (!modal) return;

    const backdrop = document.getElementById('confirm-backdrop');
    const content = document.getElementById('confirm-content');
    const btnCancel = document.getElementById('btn-cancel-modal');
    const btnConfirm = document.getElementById('btn-confirm-delete');

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        content.classList.remove('scale-95'); content.classList.add('scale-100');
    }, 10);

    const close = () => {
        modal.classList.add('opacity-0', 'pointer-events-none');
        content.classList.remove('scale-100'); content.classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 200);
        btnConfirm.onclick = null; btnCancel.onclick = null;
    };

    btnCancel.onclick = close;
    backdrop.onclick = close;
    btnConfirm.onclick = () => { close(); if (onConfirm) onConfirm(); };
}
