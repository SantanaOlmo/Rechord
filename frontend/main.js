// frontend/main.js

import { Home } from './pages/Home.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';
import { Profile } from './pages/Profile.js';
import { render as SongEditor, attachEditorEvents } from './pages/SongEditor.js';

// Referencia al contenedor principal
const appRoot = document.getElementById('app-root');

// Definición de Rutas Simples (nombre de ruta: función de la página)
const routes = {
    '/': Home,
    '/home': Home,

    '/auth/login': Login,
    '/auth/register': Register,

    '/profile': Profile,
};

/**
 * Función principal del Router.
 */
function router() {
    // 1. Obtener la ruta del hash y normalizar
    let path = window.location.hash.slice(1) || '/';

    if (!path.startsWith('/')) {
        path = '/' + path;
    }

    // Check for dynamic routes (e.g., /songeditor/123)
    const songEditorMatch = path.match(/^\/songeditor(?:\/(\d+))?/);
    if (songEditorMatch) {
        const songId = songEditorMatch[1] ? parseInt(songEditorMatch[1]) : null;
        console.log('Navegando a SongEditor con ID:', songId);
        appRoot.innerHTML = SongEditor(songId);
        attachEditorEvents();
        return;
    }

    const targetPage = routes[path];

    // 2. Manejar ruta no encontrada (404)
    if (!targetPage) {
        console.error('404: Ruta no encontrada:', path);
        appRoot.innerHTML = '<div class="text-center p-10 text-red-500"><h1>404: Página no encontrada</h1></div>';
        return;
    }

    // 3. Renderizar el contenido
    console.log('Navegando a:', path);

    // Llamamos a la función de la página para obtener el HTML
    appRoot.innerHTML = targetPage();
}

/**
 * Función global para navegar (cambia el hash)
 */
window.navigate = function (path) {
    // Cambiar el hash dispara el evento 'hashchange'
    window.location.hash = path;
};


// Escuchar cambios en el hash
window.addEventListener('hashchange', router);

// Ejecutar el router al inicio de la carga
window.addEventListener('load', router);