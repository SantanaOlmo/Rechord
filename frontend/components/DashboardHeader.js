export function DashboardHeader(user) {
    // Inject logic later via app.js or separate init file, but for now structure
    return `
        <header class="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0 relative z-20">
            <!-- Unified Search -->
            <div class="flex-1 max-w-xl relative group">
                 <div class="relative">
                    <input type="text" id="unified-search-input" 
                        class="w-full bg-gray-800 text-gray-200 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-gray-900 transition-all placeholder-gray-500"
                        placeholder="Buscar canciones, personas..." autocomplete="off">
                    <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                 </div>

                 <!-- Dropdown Results -->
                 <div id="unified-search-results" class="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl hidden max-h-96 overflow-y-auto scrollbar-hide z-50">
                    <!-- Results injected here -->
                 </div>
            </div>

            <div id="room-indicator-container"></div>
            
            <div class="ml-4 flex items-center gap-4">
                 ${user ? `
                    <div onclick="window.navigate('/profile')" class="cursor-pointer">
                        <img src="${user.foto_perfil || 'assets/images/default-avatar.png'}" class="w-8 h-8 rounded-full border border-gray-700 hover:border-indigo-500 transition-colors">
                    </div>
                 ` : `
                    <button onclick="window.navigate('/login')" class="text-sm font-bold text-white hover:text-indigo-400">Login</button>
                 `}
            </div>
        </header>
    `;
}

// Logic to attach listeners (exported to be called by app.js)
export function initUnifiedSearch() {
    const input = document.getElementById('unified-search-input');
    const resultsContainer = document.getElementById('unified-search-results');
    if (!input || !resultsContainer) return;

    let debounceTimer;
    const CONTENT_BASE_URL = window.CONTENT_BASE_URL || '.';

    import('../services/GlobalSearchService.js').then(({ GlobalSearchService }) => {
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
                            <div onclick="window.playSong(${s.id_cancion})" class="flex items-center p-3 hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-800/50 last:border-0">
                                <img src="${s.ruta_imagen ? CONTENT_BASE_URL + '/' + s.ruta_imagen : 'assets/images/default-album.png'}" class="w-10 h-10 rounded object-cover mr-3 bg-gray-800">
                                <div class="flex-1 overflow-hidden">
                                    <p class="text-white font-medium truncate">${s.titulo}</p>
                                    <p class="text-xs text-gray-400 truncate">${s.artista}</p>
                                </div>
                                <button class="text-indigo-400 hover:text-indigo-300"><svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
                            </div>
                        `).join('');
                    }

                    // Users Section
                    if (users.length > 0) {
                        html += `<div class="p-2 pb-0 pt-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Personas</div>`;
                        html += users.map(u => `
                            <div onclick="window.navigate('/profile/${u.id_usuario}'); document.getElementById('unified-search-results').classList.add('hidden')" class="flex items-center p-3 hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-800/50 last:border-0">
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
}
