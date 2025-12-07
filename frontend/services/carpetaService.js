import { API_BASE_URL } from '../config.js';
import { authService } from './authService.js';

const BASE_URL = `${API_BASE_URL}/carpetas.php`;

export const carpetaService = {
    async getFolders() {
        const user = authService.getCurrentUser();
        if (!user) return [];
        const response = await fetch(`${BASE_URL}`, {
            headers: { 'X-User-Id': user.id_usuario }
        });
        return await response.json();
    },

    async createFolder(nombre) {
        const user = authService.getCurrentUser();
        const response = await fetch(`${BASE_URL}?action=create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': user.id_usuario
            },
            body: JSON.stringify({ nombre })
        });
        return await response.json();
    },

    async renameFolder(id, nombre) {
        const user = authService.getCurrentUser();
        await fetch(`${BASE_URL}?action=rename`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id_usuario },
            body: JSON.stringify({ id, nombre })
        });
    },

    async deleteFolder(id) {
        const user = authService.getCurrentUser();
        await fetch(`${BASE_URL}?id=${id}`, {
            method: 'DELETE',
            headers: { 'X-User-Id': user.id_usuario }
        });
    },

    async addSong(idCarpeta, idCancion) {
        const user = authService.getCurrentUser();
        await fetch(`${BASE_URL}?action=add_song`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id_usuario },
            body: JSON.stringify({ id_carpeta: idCarpeta, id_cancion: idCancion })
        });
    },

    async getFolderSongs(idCarpeta) {
        const response = await fetch(`${BASE_URL}?action=contenido&id=${idCarpeta}`);
        return await response.json();
    },

    async reorderFolder(idCarpeta, items) {
        const user = authService.getCurrentUser();
        await fetch(`${BASE_URL}?action=reorder`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id_usuario },
            body: JSON.stringify({ id_carpeta: idCarpeta, items })
        });
    },

    async removeSongFromFolder(idCarpeta, idCancion) {
        const user = authService.getCurrentUser();
        await fetch(`${BASE_URL}?action=remove_song`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id_usuario },
            body: JSON.stringify({ id_carpeta: idCarpeta, id_cancion: idCancion })
        });
    }
};
