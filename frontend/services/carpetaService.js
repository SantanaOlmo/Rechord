import { API_ROUTES } from '../api/routes.js';
import { authService } from './authService.js';

// BASE_URL removed
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)

export const carpetaService = {
    async getFolders() {
        const user = authService.getCurrentUser();
        if (!user) return [];
        const response = await fetch(`${API_ROUTES.FOLDERS}`, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
            headers: { 'X-User-Id': user.id_usuario }
        });
        return await response.json();
    },

    async createFolder(nombre) {
        const user = authService.getCurrentUser();
        const response = await fetch(`${API_ROUTES.FOLDERS}?action=create`, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
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
        await fetch(`${API_ROUTES.FOLDERS}?action=rename`, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id_usuario },
            body: JSON.stringify({ id, nombre })
        });
    },

    async deleteFolder(id) {
        const user = authService.getCurrentUser();
        await fetch(`${API_ROUTES.FOLDERS}?id=${id}`, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
            method: 'DELETE',
            headers: { 'X-User-Id': user.id_usuario }
        });
    },

    async addSong(idCarpeta, idCancion) {
        const user = authService.getCurrentUser();
        await fetch(`${API_ROUTES.FOLDERS}?action=add_song`, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id_usuario },
            body: JSON.stringify({ id_carpeta: idCarpeta, id_cancion: idCancion })
        });
    },

    async getFolderSongs(idCarpeta) {
        const response = await fetch(`${API_ROUTES.FOLDERS}?action=contenido&id=${idCarpeta}`);
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
        return await response.json();
    },

    async reorderFolder(idCarpeta, items) {
        const user = authService.getCurrentUser();
        await fetch(`${API_ROUTES.FOLDERS}?action=reorder`, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id_usuario },
            body: JSON.stringify({ id_carpeta: idCarpeta, items })
        });
    },

    async removeSongFromFolder(idCarpeta, idCancion) {
        const user = authService.getCurrentUser();
        await fetch(`${API_ROUTES.FOLDERS}?action=remove_song`, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id_usuario },
            body: JSON.stringify({ id_carpeta: idCarpeta, id_cancion: idCancion })
        });
    }
};
