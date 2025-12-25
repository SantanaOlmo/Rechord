import { API_BASE_URL } from '../config.js';

export const API_ROUTES = {
    CHORDS_SYNC: `${API_BASE_URL}/acorde_sincronizado`,
    CHORDS: `${API_BASE_URL}/acordes`,
    ADMIN_WS: `${API_BASE_URL}/admin_websocket`, // Confirm if this exists in node backend? - Keeping consistent for now
    SONG_FOLDERS: `${API_BASE_URL}/cancion_carpeta`, // Not explicitly in routes.js, might need check
    SONG_BACKGROUNDS: `${API_BASE_URL}/cancion_fondos`, // Not explicitly in routes.js
    SONGS: `${API_BASE_URL}/canciones`,
    FOLDERS: `${API_BASE_URL}/carpetas`,
    CHAT: `${API_BASE_URL}/chat`,
    TEMP_CONFIG: `${API_BASE_URL}/config_temporal`, // Not in routes yet
    VERSES: `${API_BASE_URL}/estrofas`, // Not in routes yet
    HERO: `${API_BASE_URL}/hero`, // Not in routes yet
    HOME_CONFIG: `${API_BASE_URL}/home_config`,
    LIKES: `${API_BASE_URL}/likes`,
    NOTIFICATIONS: `${API_BASE_URL}/notifications`,
    PATTERNS: `${API_BASE_URL}/patrones`, // Not in routes yet
    STRUMMING_SYNC: `${API_BASE_URL}/rasgueo_sincronizado`, // Not in routes yet
    FOLLOW: `${API_BASE_URL}/seguir`, // Not in routes yet
    USERS: `${API_BASE_URL}/usuarios`
};
