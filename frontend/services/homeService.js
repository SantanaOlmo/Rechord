import { API_ROUTES } from '../api/routes.js';
import { authService } from './authService.js';

// BASE_URL removed


/**
 * Obtiene los datos para la Home Page (secciones configuradas)
 */
export async function getHomeData() {
    try {
        const user = authService.getCurrentUser();
        const headers = {};
        if (user) headers['X-User-Id'] = user.id_usuario;

        const endpoint = `${API_ROUTES.SONGS}?action=home_data`;

        console.log('homeService: getHomeData calling', endpoint);

        const response = await fetch(endpoint, { headers });
        console.log('homeService: getHomeData response status', response.status);

        if (!response.ok) {
            const text = await response.text();
            console.error('homeService: Server Error', text);
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('homeService: getHomeData data', data);

        if (data && data.sections) {
            return data.sections;
        } else if (Array.isArray(data)) {
            return data;
        } else {
            console.warn('homeService: Unexpected data format', data);
            return [];
        }
    } catch (error) {
        console.error('homeService: getHomeData failed', error);
        throw error;
    }
}
