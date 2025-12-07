import { search as searchSongs } from '../services/cancionService.js';
import { usuarioService } from '../services/usuarioService.js';

export const GlobalSearchService = {
    /**
     * Searches both songs and users.
     * @param {string} term 
     * @returns {Promise<{songs: Array, users: Array}>}
     */
    async searchAll(term) {
        if (!term || term.length < 2) return { songs: [], users: [] };

        const [songs, users] = await Promise.all([
            searchSongs(term).catch(e => []),
            usuarioService.search(term).catch(e => [])
        ]);

        return { songs, users };
    }
};
