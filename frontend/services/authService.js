/**
 * Servicio de Autenticación
 * Maneja el inicio de sesión, registro y gestión de tokens.
 */

import { API_ROUTES } from '../api/routes.js';
// API_URL removed, using API_ROUTES.USERS
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)

export const authService = {
    /**
     * Inicia sesión con email y contraseña
     */
    async login(email, password) {
        try {
            const response = await fetch(`${API_ROUTES.USERS}?action=login`, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
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
            const response = await fetch(`${API_ROUTES.USERS}?action=register`, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
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
    },

    async updateProfile(formData) {
        try {
            const response = await fetch(`${API_ROUTES.USERS}?action=update_profile`, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                method: 'POST',
                body: formData // FormData sets Content-Type automatically
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar perfil');
            }

            const data = await response.json();

            // Update local storage user if returned
            if (data.user) {
                localStorage.setItem('rechord_user', JSON.stringify(data.user));
            }

            return data;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    isAdmin() {
        const user = this.getCurrentUser();
        // Allow role 'admin' OR the specific hardcoded email
        return user && (user.rol === 'admin' || user.email === 'alberto16166@alumnos.ilerna.com');
    },

    async getAllUsers() {
        try {
            const response = await fetch(`${API_ROUTES.USERS}`);
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
            if (!response.ok) throw new Error('Error al obtener usuarios');
            const data = await response.json();
            return data.users;
        } catch (error) {
            console.error('Get all users error:', error);
            throw error;
        }
    },

    async impersonate(targetUserId) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) throw new Error('No estás autenticado');

        try {
            const response = await fetch(`${API_ROUTES.USERS}?action=impersonate`, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    admin_id: currentUser.id_usuario,
                    target_user_id: targetUserId
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al impersonar');

            if (data.token) {
                localStorage.setItem('rechord_token', data.token);
                localStorage.setItem('rechord_user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            console.error('Impersonate error:', error);
            throw error;
        }
    }
};
