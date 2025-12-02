/**
 * Servicio para gestionar canciones con la API
 */

import { API_BASE_URL } from '../config.js';
import { authService } from './auth.js';

const BASE_URL = `${API_BASE_URL}/canciones.php`;

/**
 * Obtiene una canción por ID
 * @param {number} idCancion ID de la canción
 * @returns {Promise<Object>} Datos de la canción
 */
export async function getCancion(idCancion) {
    try {
        const response = await fetch(`${BASE_URL}?id=${idCancion}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener canción');
        }

        return data.cancion || data;
    } catch (error) {
        console.error('Error al obtener canción:', error);
        throw error;
    }
}

/**
 * Obtiene las canciones del usuario actual
 */
export async function getCancionesUsuario() {
    try {
        const token = authService.getToken();
        if (!token) throw new Error('No autenticado');

        const user = authService.getCurrentUser();
        const response = await fetch(`${BASE_URL}?action=mis_canciones`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-User-Id': user ? user.id_usuario : ''
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener canciones');
        }

        return data.canciones || [];
    } catch (error) {
        console.error('Error al obtener canciones:', error);
        throw error;
    }
}

/**
 * Crea una nueva canción
 */
export async function createCancion(formData) {
    try {
        const token = authService.getToken();
        if (!token) throw new Error('No autenticado');

        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear canción');
        }

        return data;
    } catch (error) {
        console.error('Error al crear canción:', error);
        throw error;
    }
}

/**
 * Da o quita like a una canción
 */
export async function toggleLike(idCancion) {
    try {
        const user = authService.getCurrentUser();
        if (!user) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}?action=toggle_like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_usuario: user.id_usuario,
                id_cancion: idCancion
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al dar like');
        }

        return data;
    } catch (error) {
        console.error('Error al dar like:', error);
        throw error;
    }
}
