/**
 * Servicio para gestionar acordes sincronizados con la API
 */

import { API_BASE_URL } from '../config.js';

const BASE_URL = `${API_BASE_URL}/acorde_sincronizado.php`;

/**
 * Obtiene todos los acordes sincronizados de una canción
 * @param {number} idCancion ID de la canción
 * @returns {Promise<Array>} Lista de acordes sincronizados
 */
export async function getAcordesCancion(idCancion) {
    try {
        const response = await fetch(`${BASE_URL}?id_cancion=${idCancion}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener acordes');
        }
        
        return data.acordes || [];
    } catch (error) {
        console.error('Error al obtener acordes sincronizados:', error);
        throw error;
    }
}

/**
 * Agrega un nuevo acorde sincronizado
 * @param {Object} acordeData Datos del acorde sincronizado
 * @returns {Promise<Object>} Acorde creado
 */
export async function agregarAcorde(acordeData) {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(acordeData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al agregar acorde');
        }
        
        return data;
    } catch (error) {
        console.error('Error al agregar acorde sincronizado:', error);
        throw error;
    }
}

/**
 * Actualiza un acorde sincronizado existente
 * @param {Object} acordeData Datos actualizados del acorde
 * @returns {Promise<Object>} Resultado de la actualización
 */
export async function actualizarAcorde(acordeData) {
    try {
        const response = await fetch(BASE_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(acordeData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar acorde');
        }
        
        return data;
    } catch (error) {
        console.error('Error al actualizar acorde sincronizado:', error);
        throw error;
    }
}

/**
 * Elimina un acorde sincronizado
 * @param {number} idSincronia ID del acorde sincronizado
 * @returns {Promise<Object>} Resultado de la eliminación
 */
export async function eliminarAcorde(idSincronia) {
    try {
        const response = await fetch(`${BASE_URL}?id_sincronia=${idSincronia}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al eliminar acorde');
        }
        
        return data;
    } catch (error) {
        console.error('Error al eliminar acorde sincronizado:', error);
        throw error;
    }
}


