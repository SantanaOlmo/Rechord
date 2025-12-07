import { API_BASE_URL } from '../config.js';

export const usuarioService = {
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
    }
};
