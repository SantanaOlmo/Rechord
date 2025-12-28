import { sidebarState } from './state.js';

export function highlightFolder(id, active, isMobile) {
    const suffix = isMobile ? '-mobile' : '';
    const nameEl = document.getElementById(`folder-name-${id}${suffix}`);
    if (nameEl) {
        const header = nameEl.closest('.folder-header');
        if (header) {
            if (active) header.classList.add('bg-[var(--accent-primary)]', 'text-white');
            else header.classList.remove('bg-[var(--accent-primary)]', 'text-white');
        }
    }
}

export function setupSelection(isMobile) {
    const listId = isMobile ? 'folders-list-mobile' : 'folders-list';
    const listContainer = document.getElementById(listId);

    if (!listContainer) return;

    listContainer.style.position = 'relative';

    let selectionBox = null;
    let startX, startY;

    listContainer.addEventListener('mousedown', (e) => {
        if (e.target.closest('button') || e.target.closest('input') || e.button !== 0) return;

        const folderHeader = e.target.closest('.folder-header');
        if (folderHeader) {
            const folderWrapper = folderHeader.closest('.folder-wrapper');
            const nameId = folderWrapper.querySelector('[id^="folder-name-"]')?.id;
            if (nameId) {
                const id = parseInt(nameId.split('-')[2]);
                if (!e.ctrlKey && !e.shiftKey && !sidebarState.selectedFolderIds.has(id)) {
                    clearSelection(isMobile);
                    addToSelection(id, isMobile);
                } else if (e.ctrlKey) {
                    toggleSelection(id, isMobile);
                }
            }
            return;
        }

        startX = e.layerX;
        startY = e.layerY + listContainer.scrollTop;

        selectionBox = document.createElement('div');
        selectionBox.className = 'absolute bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)] z-50 pointer-events-none';
        selectionBox.style.left = startX + 'px';
        selectionBox.style.top = startY + 'px';
        listContainer.appendChild(selectionBox);

        if (!e.ctrlKey) clearSelection(isMobile);

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

            const boxRect = { left, top, right: left + width, bottom: top + height };
            const headers = listContainer.querySelectorAll('.folder-header');

            headers.forEach(header => {
                const headerRect = {
                    left: header.offsetLeft,
                    top: header.offsetTop,
                    right: header.offsetLeft + header.offsetWidth,
                    bottom: header.offsetTop + header.offsetHeight
                };

                if (boxRect.left < headerRect.right && boxRect.right > headerRect.left &&
                    boxRect.top < headerRect.bottom && boxRect.bottom > headerRect.top) {
                    const wrapper = header.closest('.folder-wrapper');
                    const nameId = wrapper.querySelector('[id^="folder-name-"]')?.id;
                    if (nameId) {
                        const id = parseInt(nameId.split('-')[2]);
                        addToSelection(id, isMobile);
                    }
                }
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

export function addToSelection(id, isMobile) {
    sidebarState.addSelection(id);
    highlightFolder(id, true, isMobile);
}

export function toggleSelection(id, isMobile) {
    if (sidebarState.selectedFolderIds.has(id)) {
        sidebarState.removeSelection(id);
        highlightFolder(id, false, isMobile);
    } else {
        addToSelection(id, isMobile);
    }
}

export function clearSelection(isMobile) {
    sidebarState.selectedFolderIds.forEach(id => highlightFolder(id, false, isMobile));
    sidebarState.clearSelection();
}
