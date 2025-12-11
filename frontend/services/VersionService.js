// import { api } from '../services/api.js'; // API service not yet implemented
import { API_BASE_URL } from '../config.js'; // For future use


export const versionService = {
    /**
     * Obtiene todas las versiones de una canción ordenadas por likes.
     * @param {number} songId
     * @returns {Promise<Array>}
     */
    async getVersionsBySongId(songId) {
        // TODO: Conectar con backend real cuando el endpoint esté listo.
        // Simulamos datos por ahora para probar la UI.
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        id_version: 1,
                        usuario: { nombre: 'alberto', foto_perfil: 'uploads/avatars/default.png' },
                        titulo_version: 'Acústica suave',
                        likes: 120,
                        fecha_creacion: '2023-10-01'
                    },
                    {
                        id_version: 2,
                        usuario: { nombre: 'mariaguitar', foto_perfil: 'uploads/avatars/default.png' },
                        titulo_version: 'Versión Rock',
                        likes: 85,
                        fecha_creacion: '2023-10-05'
                    },
                    {
                        id_version: 3,
                        usuario: { nombre: 'pianoman', foto_perfil: 'uploads/avatars/default.png' },
                        titulo_version: 'Piano Cover',
                        likes: 45,
                        fecha_creacion: '2023-10-10'
                    }
                ]);
            }, 300);
        });
        // Cuando esté el backend:
        // return api.get(`/versions?songId=${songId}`);
    },

    /**
     * Crea una nueva versión.
     * @param {Object} versionData
     * @returns {Promise<Object>}
     */
    async createVersion(versionData) {
        // return api.post('/versions', versionData);
        console.log('Creando versión:', versionData);
        return { success: true };
    }
};
