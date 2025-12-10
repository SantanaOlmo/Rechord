import { API_BASE_URL } from '../config.js';

export const usuarioService = {
    async getProfile(id, viewerId) {
        try {
            let url = `${API_BASE_URL}/usuarios.php?id=${id}`;
            if (viewerId) url += `&viewer_id=${viewerId}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error cargando perfil');
            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error('GetProfile error:', error);
            throw error;
        }
    },

    async follow(idSeguidor, idSeguido) {
        const response = await fetch(`${API_BASE_URL}/seguir.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_seguidor: idSeguidor, id_seguido: idSeguido })
        });
        if (!response.ok) throw new Error('Error al seguir');
        return await response.json();
    },

    async unfollow(idSeguidor, idSeguido) {
        const response = await fetch(`${API_BASE_URL}/seguir.php?id_seguidor=${idSeguidor}&id_seguido=${idSeguido}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al dejar de seguir');
        return await response.json();
    },

    async search(term) {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios.php?search=${encodeURIComponent(term)}`);
            if (!response.ok) throw new Error('Error buscando usuarios');
            const data = await response.json();
            return data.users || [];
        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    },
    async deleteUser(id) {
        const response = await fetch(`${API_BASE_URL}/usuarios.php?id=${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar usuario');
        return await response.json();
    },

    async updateProfile(formData) {
        const response = await fetch(`${API_BASE_URL}/usuarios.php`, {
            method: 'POST', // Assuming POST handles updates via body data
            body: formData
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar perfil');
        }
        return await response.json();
    }
};
