import { sidebarState } from './state.js';

export function highlightFolder(id, active, isMobile) {
    const suffix = isMobile ? '-mobile' : '';
    const nameEl = document.getElementById(`folder-name-${id}${suffix}`);
    if (nameEl) {
        const header = nameEl.closest('.folder-header');
        if (header) {
            // "Celestito" -> Theme Accent with 20% opacity. Text matches accent for consistency.
            // Using !important to lock it against hover issues.
            /* 
               If the user preferred a specific color but left it blank `[]`, 
               this variable-based approach is the safest and most "premium" option.
               It adapts to whatever the main brand color is (usually blue-ish).
            */
            if (active) {
                header.classList.add('!bg-[var(--accent-primary)]', '!bg-opacity-20', '!text-[var(--text-primary)]');
                // Alternatively, force text to accent color: header.classList.add('!text-[var(--accent-primary)]');
                // But text-primary usually reads better on light backgrounds.
                header.querySelector('svg')?.classList.add('text-[var(--accent-primary)]');
            } else {
                header.classList.remove('!bg-[var(--accent-primary)]', '!bg-opacity-20', '!text-[var(--text-primary)]');
                header.querySelector('svg')?.classList.remove('text-[var(--accent-primary)]');
            }
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
    let initialSelection = new Set(); // Selection state when drag started

    listContainer.addEventListener('mousedown', (e) => {
        if (e.target.closest('button') || e.target.closest('input') || e.button !== 0) return;

        const folderHeader = e.target.closest('.folder-header');
        // If clicking a header directly, handle basic click selection
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

        // --- Start Drag Selection ---

        startX = e.layerX;
        startY = e.layerY + listContainer.scrollTop;

        // 1. Capture Initial State
        // If Ctrl is held, we start with the current selection.
        // If NOT held, we start with an EMPTY selection (we don't clear visuals immediately until move to allow click-clearing, 
        // but for simplicity, let's clear visuals if !ctrl now to imply new action start).
        if (e.ctrlKey) {
            initialSelection = new Set(sidebarState.selectedFolderIds);
        } else {
            initialSelection = new Set();
            clearSelection(isMobile); // Clear existing
        }

        selectionBox = document.createElement('div');
        selectionBox.className = 'absolute bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)] z-50 pointer-events-none';
        selectionBox.style.left = startX + 'px';
        selectionBox.style.top = startY + 'px';
        listContainer.appendChild(selectionBox);

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

            // 2. Determine "Currently In Box" set
            const idsInBox = new Set();

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
                        idsInBox.add(parseInt(nameId.split('-')[2]));
                    }
                }
            });

            // 3. Calculate Final Selection = Initial U InBox
            // Note: If NOT ctrl, Initial is empty.
            // Logic: NewState = Initial U InBox. 
            // Any ID not in NewState should be OFF. Any ID in NewState should be ON.

            const newTotal = new Set([...initialSelection, ...idsInBox]);

            // Update Visuals (Diffing for performance, or just brute force)
            // Brute force is O(N_Folders), Diff is O(N_Selected). Brute force is simpler if we track state.
            // Let's use the sidebarState sets to diff.

            // Add items that are new
            newTotal.forEach(id => {
                if (!sidebarState.selectedFolderIds.has(id)) {
                    addToSelection(id, isMobile);
                }
            });

            // Remove items that are no longer selected (e.g. dragged out)
            // We iterate a COPY of the current state because we modify it
            [...sidebarState.selectedFolderIds].forEach(id => {
                if (!newTotal.has(id)) {
                    removeFromSelection(id, isMobile); // Helper needed
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

export function removeFromSelection(id, isMobile) {
    sidebarState.removeSelection(id);
    highlightFolder(id, false, isMobile);
}

export function toggleSelection(id, isMobile) {
    if (sidebarState.selectedFolderIds.has(id)) {
        removeFromSelection(id, isMobile);
    } else {
        addToSelection(id, isMobile);
    }
}

export function clearSelection(isMobile) {
    sidebarState.selectedFolderIds.forEach(id => highlightFolder(id, false, isMobile));
    sidebarState.clearSelection();
}
