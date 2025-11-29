/**
 * Servicio para gestionar acordes con la API
 */

import { API_BASE_URL } from '../config.js';

const BASE_URL = `${API_BASE_URL}/acordes.php`;

/**
 * Obtiene todos los acordes disponibles
 * @returns {Promise<Array>} Lista de acordes
 */
export async function getAcordes() {
    try {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener acordes');
        }
        
        return data.acordes || data;
    } catch (error) {
        console.error('Error al obtener acordes:', error);
        throw error;
    }
}

/**
 * Obtiene un acorde por ID
 * @param {number} idAcorde ID del acorde
 * @returns {Promise<Object>} Datos del acorde
 */
export async function getAcorde(idAcorde) {
    try {
        const response = await fetch(`${BASE_URL}?id=${idAcorde}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener acorde');
        }
        
        return data.acorde || data;
    } catch (error) {
        console.error('Error al obtener acorde:', error);
        throw error;
    }
}


