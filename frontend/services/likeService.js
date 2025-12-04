import { API_BASE_URL } from '../config.js';

export const likeService = {
    async toggleLike(id_usuario, id_cancion) {
        // First check if liked
        const isLiked = await this.checkLike(id_usuario, id_cancion);

        if (isLiked) {
            await this.removeLike(id_usuario, id_cancion);
            return false;
        } else {
            await this.addLike(id_usuario, id_cancion);
            return true;
        }
    },

    async addLike(id_usuario, id_cancion) {
        const response = await fetch(`${API_BASE_URL}/likes.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_usuario, id_cancion })
        });
        if (!response.ok) throw new Error('Error adding like');
        return await response.json();
    },

    async removeLike(id_usuario, id_cancion) {
        const response = await fetch(`${API_BASE_URL}/likes.php?id_usuario=${id_usuario}&id_cancion=${id_cancion}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error removing like');
        return await response.json();
    },

    async checkLike(id_usuario, id_cancion) {
        const response = await fetch(`${API_BASE_URL}/likes.php?id_usuario=${id_usuario}&id_cancion=${id_cancion}`);
        if (!response.ok) return false;
        const data = await response.json();
        return data.liked;
    },

    async getUserLikes(id_usuario) {
        const response = await fetch(`${API_BASE_URL}/likes.php?id_usuario=${id_usuario}`);
        if (!response.ok) return [];
        return await response.json(); // Returns array of song IDs
    }
};
