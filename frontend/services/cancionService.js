/**
 * Servicio para gestionar canciones con la API
 */

import { API_BASE_URL } from '../config.js';
import { authService } from './authService.js';

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

/**
 * Obtiene los datos para la Home Page (secciones configuradas)
 */
export async function getHomeData() {
    try {
        const user = authService.getCurrentUser();
        const headers = {};
        if (user) headers['X-User-Id'] = user.id_usuario;

        const endpoint = `${BASE_URL}?action=home_data`;
        console.log('cancionService: getHomeData calling', endpoint);

        const response = await fetch(endpoint, { headers });
        console.log('cancionService: getHomeData response status', response.status);

        if (!response.ok) {
            const text = await response.text();
            console.error('cancionService: Server Error', text);
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('cancionService: getHomeData data', data);

        if (data && data.sections) {
            return data.sections;
        } else if (Array.isArray(data)) {
            return data;
        } else {
            console.warn('cancionService: Unexpected data format', data);
            return [];
        }
    } catch (error) {
        console.error('cancionService: getHomeData failed', error);
        throw error;
    }
}

/**
 * Actualiza los datos de una canción
 */
export async function updateCancion(songData) {
    try {
        const token = authService.getToken();
        const isFormData = songData instanceof FormData;

        const headers = {
            'Authorization': `Bearer ${token}`
        };
        if (!isFormData) headers['Content-Type'] = 'application/json';

        const response = await fetch(`${BASE_URL}?action=update`, {
            method: 'POST',
            headers: headers,
            body: isFormData ? songData : JSON.stringify(songData)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al actualizar');
        return data;
    } catch (error) {
        console.error('Update error:', error);
        throw error;
    }
}

const HOME_CONFIG_URL = `${API_BASE_URL}/home_config.php`;

/**
 * Admin: Obtener configuración completa (incluyendo inactivos)
 */
export async function getAdminHomeData() {
    try {
        const token = authService.getToken();
        const response = await fetch(`${HOME_CONFIG_URL}?action=admin_list`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('getAdminHomeData error:', text);
            throw new Error(`Error ${response.status}: ${text}`);
        }

        const data = await response.json();
        return data.configs || data.sections || data;
    } catch (error) {
        console.error('Error fetching admin home data:', error);
        throw error;
    }
}

/**
 * Admin: Añadir categoría a Home
 */
export async function addHomeCategory(categoryData) {
    try {
        const token = authService.getToken();
        const response = await fetch(HOME_CONFIG_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'add', ...categoryData })
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Admin: Eliminar categoría
 */
export async function deleteHomeCategory(idConfig) {
    try {
        const token = authService.getToken();
        const response = await fetch(HOME_CONFIG_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'delete', id: idConfig })
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Admin: Actualizar orden de categorías
 */
export async function updateHomeConfigOrder(items) {
    try {
        const token = authService.getToken();
        const response = await fetch(HOME_CONFIG_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'reorder', items })
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Admin: Actualizar categoría
 */
export async function updateHomeCategory(categoryData) {
    try {
        const token = authService.getToken();
        const response = await fetch(HOME_CONFIG_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'update', ...categoryData })
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Admin: Toggle Visibilidad
 */
export async function toggleHomeVisibility(idConfig, active) {
    try {
        const token = authService.getToken();
        const response = await fetch(HOME_CONFIG_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'toggle', id: idConfig, active: active ? 1 : 0 })
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Busca canciones por término
 */
export async function search(term) {
    try {
        const response = await fetch(`${BASE_URL}?search=${encodeURIComponent(term)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error en búsqueda');
        return data.canciones || [];
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}
