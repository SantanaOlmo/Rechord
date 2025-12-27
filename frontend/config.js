// frontend/config.js

/**
 * URL Base del backend de la API de ReChord.
 * * NOTA: Asegúrate de que esta URL coincida con la configuración de tu servidor (Docker/XAMPP).
 * Usamos la ruta local por defecto.
 */
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

export const API_BASE_URL = isProduction
    ? 'https://api-central-rechord.onrender.com/api/rechord' // Placeholder: User must update this after Render deploy
    : 'http://localhost:3000/api/rechord';

export const CONTENT_BASE_URL = isProduction
    ? 'https://api-central-rechord.onrender.com'
    : 'http://localhost:3000';

export const WS_URL = isProduction
    ? 'wss://api-central-rechord.onrender.com'
    : 'ws://localhost:8080'; // Legacy fallback, though WS is removed

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