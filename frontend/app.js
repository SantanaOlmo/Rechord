import { nukeCache } from './reset.js';
nukeCache();
import { Home } from './pages/HomePage.js?v=3';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';
import { Profile, attachProfileEvents } from './pages/Profile.js';
import { render as Sincronizador, attachEditorEvents } from './pages/Sincronizador.js';
import { PlayerPage } from './pages/PlayerPage.js';
import { ComponentShowcase } from './pages/ComponentShowcase.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { authService } from './services/authService.js';
import { CONTENT_BASE_URL } from './config.js';

// Referencia al contenedor principal
const appRoot = document.getElementById('app-root');

console.log('%c RECHORD FRONTEND - VERSION: 2025-12-03 17:40 (Restored) ', 'background: #222; color: #bada55; font-size: 16px; padding: 10px;');

// Definición de Rutas Simples (nombre de ruta: función de la página)
const routes = {
    '/': Home,
    '/home': Home,

    '/auth/login': Login,
    '/auth/register': Register,

    '/profile': Profile,
    '/admin': AdminDashboard,
    '/components': ComponentShowcase,
};

/**
 * Actualiza la cabecera (Header) según el estado de autenticación
 */
function updateHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    // Limpiar clases antiguas y aplicar nuevas
    header.className = 'header-container';

    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    const isAdmin = authService.isAdmin();

    // Iconos SVG
    const iconHome = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>`;
    const iconSearch = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>`;
    const iconLogin = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>`;
    const iconAdmin = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>`;

    // Left Navigation (Home + Search)
    // Unified Search HTML
    const searchHtml = `
        <div class="search-container relative ml-4" id="unified-search-container">
             <div class="relative group">
                <input type="text" id="global-unified-search" 
                    class="w-full md:w-64 bg-gray-800 text-gray-200 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-gray-900 transition-all placeholder-gray-500 text-sm"
                    placeholder="Buscar..." autocomplete="off">
                <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             </div>
             <!-- Results Dropdown -->
             <div id="global-search-results" class="absolute top-full left-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl hidden max-h-96 overflow-y-auto scrollbar-hide z-50"></div>
        </div>
    `;

    // Left Navigation (Home + Search)
    const leftNav = `
        <div class="header-left flex items-center">
            <a href="#/" class="nav-icon-btn mr-2" title="Inicio">
                ${iconHome}
            </a>
            ${searchHtml}
            ${isAdmin ? `
            <a href="#/admin" class="nav-icon-btn text-purple-400 hover:text-purple-300 ml-4" title="Panel de Admin">
                ${iconAdmin}
            </a>` : ''}
        </div>
    `;

    // ... (Right Nav code remains same but I need to include it if I replace the whole block, or just target the search part)
    // Detailed replacement of leftNav construction:

    // Right Navigation (Auth) construction... (lines 74-98 unchanged in logic but need to be careful with replace tool)

    // Construct Header
    header.innerHTML = leftNav + rightNav;

    // Attach Unified Search Listeners
    attachGlobalSearchListeners();
}

// Function to attach listeners
function attachGlobalSearchListeners() {
    const input = document.getElementById('global-unified-search');
    const resultsContainer = document.getElementById('global-search-results');
    if (!input || !resultsContainer) return;

    let debounceTimer;

    import('./services/GlobalSearchService.js').then(({ GlobalSearchService }) => {
        input.addEventListener('input', (e) => {
            const term = e.target.value.trim();
            clearTimeout(debounceTimer);

            if (term.length < 2) {
                resultsContainer.classList.add('hidden');
                resultsContainer.innerHTML = '';
                return;
            }

            debounceTimer = setTimeout(async () => {
                const { songs, users } = await GlobalSearchService.searchAll(term);

                if (songs.length === 0 && users.length === 0) {
                    resultsContainer.innerHTML = '<div class="p-4 text-center text-gray-500 text-sm">Sin resultados</div>';
                } else {
                    let html = '';

                    // Songs Section
                    if (songs.length > 0) {
                        html += `<div class="p-2 pb-0 text-xs font-bold text-gray-500 uppercase tracking-wider">Canciones</div>`;
                        html += songs.map(s => `
                            <div onclick="window.playSong(${s.id_cancion}); document.getElementById('global-search-results').classList.add('hidden')" class="flex items-center p-3 hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-800/50 last:border-0">
                                <img src="${s.ruta_imagen ? CONTENT_BASE_URL + '/' + s.ruta_imagen : 'assets/images/default-album.png'}" class="w-10 h-10 rounded object-cover mr-3 bg-gray-800">
                                <div class="flex-1 overflow-hidden">
                                    <p class="text-white font-medium truncate">${s.titulo}</p>
                                    <p class="text-xs text-gray-400 truncate">${s.artista}</p>
                                </div>
                                <button class="text-indigo-400 hover:text-indigo-300"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
                            </div>
                        `).join('');
                    }

                    // Users Section
                    if (users.length > 0) {
                        html += `<div class="p-2 pb-0 pt-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Personas</div>`;
                        html += users.map(u => `
                            <div onclick="window.navigate('/profile/${u.id_usuario}'); document.getElementById('global-search-results').classList.add('hidden')" class="flex items-center p-3 hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-800/50 last:border-0">
                                <img src="${u.foto_perfil ? CONTENT_BASE_URL + '/' + u.foto_perfil : 'assets/images/default-avatar.png'}" class="w-10 h-10 rounded-full object-cover mr-3 bg-gray-800">
                                <div class="flex-1 overflow-hidden">
                                    <p class="text-white font-medium truncate">${u.nombre}</p>
                                    <p class="text-xs text-gray-400 truncate">@${u.nombre.replace(/\s+/g, '').toLowerCase()}</p>
                                </div>
                            </div>
                        `).join('');
                    }

                    resultsContainer.innerHTML = html;
                }
                resultsContainer.classList.remove('hidden');
            }, 300);
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !resultsContainer.contains(e.target)) {
                resultsContainer.classList.add('hidden');
            }
        });

        // Focus logic
        input.addEventListener('focus', () => {
            if (resultsContainer.innerHTML.trim() !== '') resultsContainer.classList.remove('hidden');
        });
    });

}

/**
 * Función principal del Router.
 */
function router() {
    // Actualizar header en cada navegación
    updateHeader();

    // 1. Obtener la ruta del hash y normalizar
    let path = window.location.hash.slice(1) || '/';

    if (!path.startsWith('/')) {
        path = '/' + path;
    }

    // Hide global header and reset app-root for Sincronizador AND Home (Dashboard Layout)
    const isSincronizador = path.startsWith('/sincronizador') || path.startsWith('/songeditor');
    const isHome = path === '/' || path === '/home';
    const useFullLayout = isSincronizador || isHome;

    const header = document.querySelector('body > header');
    if (header) {
        header.style.display = isSincronizador ? 'none' : 'flex';
    }

    if (useFullLayout) {
        appRoot.classList.remove('container', 'mx-auto', 'p-4');
        appRoot.classList.add('flex-1', 'w-full', 'overflow-hidden', 'p-0', 'm-0', 'relative');
    } else {
        appRoot.classList.add('container', 'mx-auto', 'p-4', 'overflow-y-auto', 'scrollbar-hide');
        appRoot.classList.remove('flex-1', 'w-full', 'overflow-hidden', 'p-0', 'm-0', 'relative');
    }

    // Check for dynamic routes (e.g., /sincronizador/123)
    const sincronizadorMatch = path.match(/^\/sincronizador(?:\/(\d+))?/);
    if (sincronizadorMatch) {
        const songId = sincronizadorMatch[1] ? parseInt(sincronizadorMatch[1]) : null;
        console.log('Navegando a Sincronizador con ID:', songId);
        appRoot.innerHTML = Sincronizador(songId);
        attachEditorEvents();
        return;
    }

    // Check for Song Editor route (alias for Sincronizador)
    const editorMatch = path.match(/^\/songeditor(?:\/(\d+))?/);
    if (editorMatch) {
        const songId = editorMatch[1] ? parseInt(editorMatch[1]) : null;
        console.log('Navegando a Editor (Alias) con ID:', songId);
        appRoot.innerHTML = Sincronizador(songId);
        attachEditorEvents();
        return;
    }

    // Check for Player route (e.g., /player/123)
    const playerMatch = path.match(/^\/player\/(\d+)/);
    if (playerMatch) {
        const songId = parseInt(playerMatch[1]);
        console.log('Navegando a Player con ID:', songId);
        appRoot.innerHTML = PlayerPage(songId);
        return;
    }

    const targetPage = routes[path];

    // 2. Manejar ruta no encontrada (404)
    if (!targetPage) {
        console.error('404: Ruta no encontrada:', path);
        appRoot.innerHTML = '<div class="text-center p-10 text-red-500"><h1>404: Página no encontrada</h1></div>';
        return;
    }

    // 2.5. Route Guard (Protección de rutas)
    const isAuthenticated = authService.isAuthenticated();
    const isAdmin = authService.isAdmin();

    const publicRoutes = ['/auth/login', '/auth/register'];

    // Auth Guard
    if (!isAuthenticated && !publicRoutes.includes(path)) {
        console.log('Usuario no autenticado. Redirigiendo a registro...');
        window.location.hash = '#/auth/register';
        return;
    }

    // Admin Guard
    if (path === '/admin' && !isAdmin) {
        console.log('Acceso denegado a ruta admin.');
        window.location.hash = '#/';
        return;
    }

    // 3. Renderizar el contenido
    console.log('Navegando a:', path);

    // Llamamos a la función de la página para obtener el HTML
    appRoot.innerHTML = targetPage();

    // 4. Attach events for specific pages
    if (path === '/profile') {
        attachProfileEvents();
    }
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

// Global Playback Queue Handler
import { Store, EVENTS } from './core/StateStore.js';

Store.subscribe(EVENTS.PLAYER.PLAY_QUEUE, (data) => {
    const { queue, startIndex } = data;
    localStorage.setItem('playbackQueue', JSON.stringify(queue));
    const songToPlay = queue[startIndex];
    if (songToPlay) {
        window.navigate('/player/' + songToPlay.id);
    }
});

// Demo: Subscribe to Auth Event
Store.subscribe(EVENTS.USER.AUTH_SUCCESS, (user) => {
    console.log('⚡ Event Received: AUTH_SUCCESS for user', user);
    updateHeader();
});
