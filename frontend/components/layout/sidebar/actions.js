import { SidebarRenderer } from '../SidebarRenderer.js';
import { sidebarState } from './state.js';
import { carpetaService } from '../../../services/carpetaService.js';
import { authService } from '../../../services/authService.js';

export async function loadFolders(isMobile) {
    try {
        const folders = await carpetaService.getFolders();
        sidebarState.setFolders(folders);

        // Render BOTH lists if present, to ensure sync (desktop/mobile switch or both loaded)
        // If we strictly check isMobile, we might check the wrong one if state is ambiguous
        // The safest is to try rendering both if elements exist.

        ['folders-list', 'folders-list-mobile'].forEach(id => {
            const list = document.getElementById(id);
            if (list) {
                const suffix = id.includes('mobile') ? 'mobile' : '';
                list.innerHTML = SidebarRenderer.renderFolders(folders, suffix);
            }
        });

    } catch (e) { console.error(e); }
}

export function setupCreateFolder(isMobile) {
    const btnAdd = document.getElementById('btn-add-folder');
    if (btnAdd) {
        btnAdd.onclick = async () => {
            if (!authService.isAuthenticated()) return window.location.hash = '#/auth/login';

            const count = sidebarState.folders.filter(f => f.nombre && f.nombre.startsWith('Nueva Carpeta')).length;
            const name = `Nueva Carpeta ${count + 1}`;

            const result = await carpetaService.createFolder(name);
            await loadFolders(isMobile);

            const newId = result?.id_carpeta || result?.id;
            if (newId) {
                setTimeout(() => startInlineRename(newId, isMobile), 50);
            }
        };
    }
}

export function startInlineRename(folderId) {
    // Try to find the element with or without suffix (Desktop vs Mobile)
    // We check both possibilities because the context menu might triggered from ANY mode state
    let span = document.getElementById(`folder-name-${folderId}`);
    if (!span) span = document.getElementById(`folder-name-${folderId}-mobile`);

    // If still not found, we can't rename (maybe hidden sidebar?)
    if (!span) return;

    const currentName = span.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.className = 'w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded px-1 outline-none border border-[var(--accent-primary)] text-xs py-0.5';

    span.replaceWith(input);
    input.focus();
    input.select();

    const save = async () => {
        const newName = input.value.trim();
        if (newName && newName !== currentName) {
            await carpetaService.renameFolder(folderId, newName);
            loadFolders(isMobile);
        } else {
            input.replaceWith(span);
        }
    };

    input.addEventListener('blur', save);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        } else if (e.key === 'Escape') {
            input.removeEventListener('blur', save);
            input.replaceWith(span);
        }
    });

    // Important: Stop propagation so we don't trigger folder open/close
    input.addEventListener('click', (e) => e.stopPropagation());
    // Also stop context menu on input
    input.addEventListener('contextmenu', (e) => e.stopPropagation());
}
