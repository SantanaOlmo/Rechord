import { API_ROUTES } from '../api/routes.js';
import { authService } from './authService.js';

// HOME_CONFIG_URL removed
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)

/**
 * Admin: Obtener configuración completa (incluyendo inactivos)
 */
export async function getAdminHomeData() {
    try {
        const token = authService.getToken();
        const response = await fetch(`${API_ROUTES.HOME_CONFIG}?action=admin_list`, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
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
        const response = await fetch(API_ROUTES.HOME_CONFIG, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
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
        const response = await fetch(API_ROUTES.HOME_CONFIG, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
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
        const response = await fetch(API_ROUTES.HOME_CONFIG, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
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
        const response = await fetch(API_ROUTES.HOME_CONFIG, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
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
        const response = await fetch(API_ROUTES.HOME_CONFIG, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
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
