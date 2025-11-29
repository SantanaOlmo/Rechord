/**
 * Servicio de Autenticación
 * Maneja el inicio de sesión, registro y gestión de tokens.
 */

const API_URL = '/rechord/backend/api'; // Ajusta según tu estructura

export const authService = {
    /**
     * Inicia sesión con email y contraseña
     */
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/usuarios.php?action=login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }

            if (data.token) {
                localStorage.setItem('rechord_token', data.token);
                localStorage.setItem('rechord_user', JSON.stringify(data.user));
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    /**
     * Registra un nuevo usuario
     */
    async register(username, email, password) {
        try {
            const response = await fetch(`${API_URL}/usuarios.php?action=register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre: username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrarse');
            }

            return data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    /**
     * Cierra la sesión actual
     */
    logout() {
        localStorage.removeItem('rechord_token');
        localStorage.removeItem('rechord_user');
        window.location.hash = '#/auth/login';
    },

    /**
     * Obtiene el usuario actual almacenado
     */
    getCurrentUser() {
        const userStr = localStorage.getItem('rechord_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Verifica si el usuario está autenticado
     */
    isAuthenticated() {
        return !!localStorage.getItem('rechord_token');
    },

    /**
     * Obtiene el token de autenticación
     */
    getToken() {
        return localStorage.getItem('rechord_token');
    }
};
