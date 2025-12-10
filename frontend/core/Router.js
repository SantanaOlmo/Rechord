import { Home } from '../pages/HomePage.js?v=3';


import { Login } from '../pages/Login.js';
import { Register } from '../pages/Register.js'; // This was importing from pages/Register.js
import { Profile, attachProfileEvents } from '../pages/Profile.js';
import { User, attachUserEvents } from '../pages/User.js';
import { NotificationsPage } from '../pages/NotificationsPage.js';
import { Header } from '../components/layout/Header.js';
import { AdminDashboard } from '../pages/AdminDashboard.js'; // Already added in previous step effectively (context), but ensuring order.
import { authService } from '../services/authService.js';
import { render as Sincronizador, attachEditorEvents } from '../pages/Sincronizador.js';
import { PlayerPage } from '../pages/PlayerPage.js';


import { SitemapPage } from '../pages/SitemapPage.js';
import { audioService } from '../services/audioService.js';

// Route Definitions
const routes = {
    '/': Home,
    '/home': Home,
    '/auth/login': Login,
    '/auth/register': Register,
    '/admin': AdminDashboard,
    '/sitemap': SitemapPage
};

// Define global navigate function
window.navigate = function (path) {
    window.location.hash = path;
};

// Router function
const router = () => {
    // Get App Root
    const appRoot = document.getElementById('app-root');
    if (!appRoot) {
        console.error('App Root not found');
        return;
    }

    // Update Header
    Header.render();

    let path = window.location.hash.slice(1) || '/';
    if (!path.startsWith('/')) path = '/' + path;

    // Route Guards (Moved to top)
    const isAuthenticated = authService.isAuthenticated();
    const publicRoutes = ['/', '/home', '/auth/login', '/auth/register', '/privacy-policy', '/data-protection', '/sitemap'];
    const isPublic = publicRoutes.includes(path) || path.startsWith('/player/');

    if (!isAuthenticated && !isPublic) {
        window.location.hash = '#/auth/login';
        return;
    }

    if (path === '/admin' && !authService.isAdmin()) {
        window.location.hash = '#/';
        return;
    }

    // EXCLUSIVE PLAYBACK LOGIC:
    // If we are NOT on the player page, stop audio.
    // We check if the path starts with /player
    if (!path.startsWith('/player')) {
        if (audioService.isPlaying()) {
            console.log('Navigated away from player, stopping audio.');
            audioService.stop();
        }
    }

    // Layout determination
    const isSincronizador = path.startsWith('/sincronizador') || path.startsWith('/songeditor');
    const isHome = path === '/' || path === '/home';
    const isSitemap = path === '/sitemap';
    const useFullLayout = isSincronizador || isHome || isSitemap;

    const header = document.querySelector('body > header');
    if (header) {
        header.style.display = isSincronizador ? 'none' : 'flex';
    }

    appRoot.className = '';
    if (useFullLayout) {
        appRoot.classList.add('flex-1', 'w-full', 'h-full', 'overflow-hidden', 'p-0', 'm-0', 'relative');
    } else {
        appRoot.classList.add('w-full', 'h-full', 'overflow-y-auto', 'scrollbar-hide', 'p-0', 'm-0');
    }

    // Dynamic Routes
    // Sincronizador
    const sincronizadorMatch = path.match(/^\/sincronizador(?:\/(\d+))?/);
    if (sincronizadorMatch) {
        const songId = sincronizadorMatch[1] ? parseInt(sincronizadorMatch[1]) : null;
        appRoot.innerHTML = Sincronizador(songId);
        attachEditorEvents();
        return;
    }

    // Song Editor Alias
    const editorMatch = path.match(/^\/songeditor(?:\/(\d+))?/);
    if (editorMatch) {
        const songId = editorMatch[1] ? parseInt(editorMatch[1]) : null;
        appRoot.innerHTML = Sincronizador(songId);
        attachEditorEvents();
        return;
    }

    // Player
    const playerMatch = path.match(/^\/player\/(\d+)/);
    if (playerMatch) {
        const songId = parseInt(playerMatch[1]);
        appRoot.innerHTML = PlayerPage(songId);
        return;
    }

    // User Profile
    const userMatch = path.match(/^\/user\/(\d+)/);
    if (userMatch) {
        const userId = parseInt(userMatch[1]);
        appRoot.innerHTML = User({ id_usuario: userId });
        attachUserEvents();
        return;
    }

    // My Profile
    if (path === '/profile') {
        appRoot.innerHTML = Profile();
        attachProfileEvents();
        return;
    }

    // Notifications
    if (path === '/notifications') {
        appRoot.innerHTML = NotificationsPage();
        return;
    }

    // Messages
    if (path === '/messages') {
        import('../pages/Messages.js').then(({ Messages }) => {
            appRoot.innerHTML = Messages();
        });
        return;
    }

    const targetPage = routes[path];

    // 404
    if (!targetPage) {
        console.error('404:', path);
        appRoot.innerHTML = '<div class="text-center p-10 text-red-500"><h1>404: Página no encontrada</h1></div>';
        return;
    }

    // Render
    appRoot.innerHTML = targetPage();

    // Page Events (Profile already handled above, but double check if route matched /profile could happen if hash is #/profile explicitly)
    if (path === '/profile') {
        attachProfileEvents();
    }
};

// Router Object
export const Router = {
    init: () => {
        window.addEventListener('hashchange', router);
        window.addEventListener('load', router);
        // Ensure router runs if load already fired
        if (document.readyState === 'complete') {
            router();
        }
    }
};
