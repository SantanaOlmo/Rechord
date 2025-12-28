import { API_ROUTES } from '../api/routes.js';
import { authService } from './authService.js';

// BASE_URL removed


export const carpetaService = {
    async getFolders() {
        const user = authService.getCurrentUser();
        if (!user) return [];
        const response = await fetch(`${API_ROUTES.FOLDERS}`, {

            headers: { 'X-User-Id': user.id_usuario }
        });
        return await response.json();
    },

    async createFolder(nombre) {
        const user = authService.getCurrentUser();
        const response = await fetch(`${API_ROUTES.FOLDERS}?action=create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': user.id_usuario
            },
            body: JSON.stringify({ nombre })
        });
        if (!response.ok) throw new Error('Error creating folder');
        return await response.json();
    },

    async renameFolder(id, nombre) {
        const user = authService.getCurrentUser();
        const response = await fetch(`${API_ROUTES.FOLDERS}?action=rename`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id_usuario },
            body: JSON.stringify({ id, nombre })
        });
        if (!response.ok) throw new Error('Error renaming folder');
    },

    async deleteFolder(id) {
        const user = authService.getCurrentUser();
        const response = await fetch(`${API_ROUTES.FOLDERS}?id=${id}`, {
            method: 'DELETE',
            headers: { 'X-User-Id': user.id_usuario }
        });
        if (!response.ok) throw new Error('Error deleting folder');
    },

    async addSong(idCarpeta, idCancion) {
        const user = authService.getCurrentUser();
        const response = await fetch(`${API_ROUTES.FOLDERS}?action=add_song`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id_usuario },
            body: JSON.stringify({ id_carpeta: idCarpeta, id_cancion: idCancion })
        });
        if (!response.ok) throw new Error('Error adding song');
    },

    async getFolderSongs(idCarpeta) {
        const user = authService.getCurrentUser();
        const response = await fetch(`${API_ROUTES.FOLDERS}?action=contenido&id=${idCarpeta}`, {
            headers: { 'X-User-Id': user.id_usuario }
        });

        return await response.json();
    },

    async reorderFolder(idCarpeta, items) {
        const user = authService.getCurrentUser();
        await fetch(`${API_ROUTES.FOLDERS}?action=reorder`, {

            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id_usuario },
            body: JSON.stringify({ id_carpeta: idCarpeta, items })
        });
    },

    async removeSongFromFolder(idCarpeta, idCancion) {
        const user = authService.getCurrentUser();
        await fetch(`${API_ROUTES.FOLDERS}?action=remove_song`, {

            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id_usuario },
            body: JSON.stringify({ id_carpeta: idCarpeta, id_cancion: idCancion })
        });
    }
};
