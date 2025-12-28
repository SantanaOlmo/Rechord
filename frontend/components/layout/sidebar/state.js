
export const sidebarState = {
    folders: [],
    selectedFolderIds: new Set(),
    ctxFolderId: null,
    ctxSongId: null,
    ctxSongFolderId: null,

    // Setters
    setFolders(newFolders) { this.folders = newFolders; },
    addSelection(id) { this.selectedFolderIds.add(id); },
    removeSelection(id) { this.selectedFolderIds.delete(id); },
    clearSelection() { this.selectedFolderIds.clear(); },
    setCtxFolderId(id) { this.ctxFolderId = id; },
    setCtxSongId(id) { this.ctxSongId = id; }
};
