// frontend/config.js

/**
 * URL Base del backend de la API de ReChord.
 * * NOTA: Asegúrate de que esta URL coincida con la configuración de tu servidor (Docker/XAMPP).
 * Usamos la ruta local por defecto.
 */
export const API_BASE_URL = '../backend/api';
export const CONTENT_BASE_URL = '../backend';
export const WS_URL = 'ws://localhost:8080'; // WebSocket Server configuration

/**
 * Variables del Administrador (Solo para la demostración de la gestión de usuarios).
 * NOTA: En una aplicación real, estas credenciales DEBERÍAN verificarse
 * mediante un token JWT al hacer login en el perfil de Admin.
 */
export const ADMIN_EMAIL = 'admin@rechord.com';

// Path a los iconos estáticos
export const ICON_LOGIN = 'assets/icons/MaterialSymbolsLogin.svg';
export const ICON_LOGOUT = 'assets/icons/MaterialSymbolsLogout.svg';
export const ICON_EDIT = 'assets/icons/MaterialSymbolsEdit.svg';
export const ICON_PLAY = 'assets/icons/play.svg';