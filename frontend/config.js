// frontend/config.js

/**
 * URL Base del backend de la API de ReChord.
 * * NOTA: Asegúrate de que esta URL coincida con la configuración de tu servidor (Docker/XAMPP).
 * Usamos la ruta local por defecto.
 */
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// Tu URL real de Render detectada
const RENDER_BACKEND_URL = 'https://api-central-bfm8.onrender.com';

export const API_BASE_URL = isProduction
    ? `${RENDER_BACKEND_URL}/api/rechord`
    : 'http://localhost:3000/api/rechord';

export const CONTENT_BASE_URL = isProduction
    ? RENDER_BACKEND_URL
    : 'http://localhost:3000';

export const WS_URL = isProduction
    ? RENDER_BACKEND_URL.replace('https', 'wss')
    : 'ws://localhost:8080';

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
export const ICON_PLAY = 'assets/icons/Fa7SolidPlay.svg';