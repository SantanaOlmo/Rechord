import { authService } from '../../services/authService.js';
import { CONTENT_BASE_URL } from '../../config.js';

export const Header = {
    render: () => {
        const header = document.querySelector('header');
        if (!header) return;

        // Limpiar clases antiguas y aplicar nuevas
        header.className = 'header-container';
        header.removeAttribute('style'); // Reset inline styles (e.g. from Profile page)



        const user = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();
        const isAdmin = authService.isAdmin();

        // Iconos SVG
        const iconHome = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>`;
        const iconSearch = `<svg class="w-5 h-5 text-[var(--text-muted)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>`;


        const iconAdmin = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>`;
        const iconCreateRoom = `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3s1.34 3 3 3m-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5S5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5m8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5"/></svg>`;
        const iconJoinRoom = `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><circle cx="10" cy="8" r="4"/><path d="M10.35 14.01C7.62 13.91 2 15.27 2 18v2h9.54c-2.47-2.76-1.23-5.89-1.19-5.99m9.08 4.01c.36-.59.57-1.28.57-2.02c0-2.21-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4c.74 0 1.43-.22 2.02-.57L20.59 22L22 20.59zM16 18c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2"/></svg>`;

        // Center: Expanded Search
        const centerNav = `
            <div class="header-center">
                <div class="search-container relative flex items-center w-full max-w-lg" id="unified-search-container">
                     <div id="search-input-wrapper" class="w-full relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            ${iconSearch}
                        </div>
                        <input type="text" id="global-unified-search" 
                            class="search-input pl-10"
                            placeholder="Buscar en Rechord..." autocomplete="off">
                     </div>
                     <!-- Results Dropdown -->
                     <div id="global-search-results" class="absolute top-14 left-0 w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl shadow-2xl hidden max-h-96 overflow-y-auto scrollbar-hide z-50"></div>
                </div>
            </div>
        `;



        // Burger Icon
        const iconBurger = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>`;

        // Mobile Burger Button (Added to header-container start)
        const burgerBtn = `
            <button id="burger-btn" class="nav-icon-btn mr-4 md:hidden" onclick="window.toggleMobileMenu()">
                ${iconBurger}
            </button>
        `;

        // Left Navigation (Home + Shared Sessions + Search + Admin)
        const leftNav = `
            <div class="header-left hidden md:flex">
                <a href="#/" class="nav-icon-btn" title="Inicio">


                    ${iconHome}
                </a>

                ${isAdmin ? `
                <a href="#/admin" class="nav-icon-btn" title="Panel de Admin">
                    ${iconAdmin}
                </a>` : ''}


                <button onclick="window.socketService.send('CREATE_ROOM')" class="nav-icon-btn" title="Crear Sala (Modo Fiesta)">
                    ${iconCreateRoom}
                </button>
                <button onclick="document.getElementById('room-modal').classList.remove('hidden')" class="nav-icon-btn" title="Unirse a Sala">
                    ${iconJoinRoom}
                </button> 
                -->

                <!-- Messaging Icon -->
                <a href="#/messages" class="nav-icon-btn relative group" title="Mensajes">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    <div id="header-unread-dot" class="absolute top-1 right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-black hidden"></div>
                </a>


            </div>
        `;

        // Right Navigation (Auth)
        let rightNav = '';
        if (isAuthenticated && user) {
            const avatarUrl = user.foto_perfil
                ? (user.foto_perfil.startsWith('http') ? user.foto_perfil : CONTENT_BASE_URL + '/' + user.foto_perfil)
                : 'assets/icons/profile.svg';
            rightNav = `
                <div class="header-right">
                     <button onclick="window.navigate('/profile')" class="flex items-center focus:outline-none hover:opacity-80 transition group" title="Mi Perfil">
                        <span class="mr-3 text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] hidden md:block">${user.nombre}</span>
                        <img src="${avatarUrl}" alt="Perfil" class="user-avatar-img">


                     </button>
                </div>
            `;
        } else {
            rightNav = `
                <div class="header-right">
                    <button onclick="window.navigate('/auth/login')" class="flex items-center focus:outline-none hover:opacity-80 transition group" title="Iniciar Sesión">
                        <div class="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center border-2 border-transparent group-hover:border-[var(--border-primary)] transition-colors">
                            <svg class="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>
                    </button>


                </div>
            `;
        }

        header.innerHTML = burgerBtn + leftNav + centerNav + rightNav;

        // Load Mobile Menu
        import('./MobileMenu.js').then(({ MobileMenu }) => {
            const existingMenu = document.getElementById('mobile-menu-drawer');
            if (!existingMenu) {
                header.insertAdjacentHTML('beforeend', MobileMenu());
            }
        });



        // Attach Unified Search Listeners
        Header.attachEvents();
    },

    attachEvents: () => {
        const input = document.getElementById('global-unified-search');
        const resultsContainer = document.getElementById('global-search-results');

        if (!input || !resultsContainer) return;

        // Note: Removed Expand/Collapse Logic as it's now always expanded static

        // Close results when clicking outside
        document.addEventListener('click', (e) => {
            const container = document.getElementById('unified-search-container');
            if (container && !container.contains(e.target)) {
                // Hide results only, input stays visible
                resultsContainer.classList.add('hidden');
            }
        });



        let debounceTimer;

        import('../../services/GlobalSearchService.js').then(({ GlobalSearchService }) => {
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
                        resultsContainer.innerHTML = '<div class="p-4 text-center text-[var(--text-muted)] text-sm">Sin resultados</div>';


                    } else {
                        let html = '';

                        // Songs Section
                        if (songs.length > 0) {
                            html += `<div class="p-2 pb-0 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Canciones</div>`;
                            html += songs.map(s => `
                                <div onclick="window.playSong(${s.id_cancion}); document.getElementById('global-search-results').classList.add('hidden')" class="flex items-center p-3 hover:bg-[var(--bg-tertiary)] cursor-pointer transition-colors border-b border-[var(--border-primary)] last:border-0">
                                    <img src="${s.ruta_imagen ? (s.ruta_imagen.startsWith('http') ? s.ruta_imagen : CONTENT_BASE_URL + '/' + s.ruta_imagen) : 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%239ca3af\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Crect x=\'2\' y=\'2\' width=\'20\' height=\'20\' rx=\'2\' ry=\'2\' fill=\'%231f2937\' stroke=\'none\'/%3E%3Cpath d=\'M9 18V5l12-2v13\'/%3E%3Ccircle cx=\'6\' cy=\'18\' r=\'3\'/%3E%3Ccircle cx=\'18\' cy=\'16\' r=\'3\'/%3E%3C/svg%3E'}" class="w-10 h-10 rounded object-cover mr-3 bg-gray-800">
                                    <div class="flex-1 overflow-hidden">
                                        <p class="text-[var(--text-primary)] font-medium truncate">${s.titulo}</p>
                                        <p class="text-xs text-[var(--text-secondary)] truncate">${s.artista}</p>


                                    </div>
                                    <button class="text-indigo-400 hover:text-indigo-300">
                                        <img src="assets/icons/Fa7SolidPlay.svg" class="w-6 h-6" alt="Play">
                                    </button>
                                </div>
                            `).join('');
                        }

                        // Users Section
                        if (users.length > 0) {
                            html += `<div class="p-2 pb-0 pt-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Personas</div>`;
                            html += users.map(u => `
                                <div onclick="window.navigate('/user/${u.id_usuario}'); document.getElementById('global-search-results').classList.add('hidden')" class="flex items-center p-3 hover:bg-[var(--bg-tertiary)] cursor-pointer transition-colors border-b border-[var(--border-primary)] last:border-0">
                                    <img src="${u.foto_perfil ? (u.foto_perfil.startsWith('http') ? u.foto_perfil : CONTENT_BASE_URL + '/' + u.foto_perfil) : 'assets/icons/profile.svg'}" class="w-10 h-10 rounded-full object-cover mr-3 bg-gray-800">
                                    <div class="flex-1 overflow-hidden">
                                        <p class="text-[var(--text-primary)] font-medium truncate">${u.nombre}</p>
                                        <p class="text-xs text-[var(--text-secondary)] truncate">@${u.nombre.replace(/\s+/g, '').toLowerCase()}</p>


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

        // Initialize Unread Count
        import('../../services/chatService.js').then(({ chatService }) => {
            import('../../services/authService.js').then(({ authService }) => {
                const user = authService.getCurrentUser();
                if (user) {
                    chatService.getUnreadCount(user.id_usuario).then(count => {
                        const dot = document.getElementById('header-unread-dot');
                        if (dot) {
                            if (count > 0) dot.classList.remove('hidden');
                            else dot.classList.add('hidden');
                        }
                    });
                }
            });
        });
    }
};
