import { usuarioService } from '../services/usuarioService.js';
import { CONTENT_BASE_URL } from '../config.js';

export function UserSearchModal() {
    return `
        <div id="user-search-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300">
            <div id="search-modal-content" class="bg-gray-900 w-full max-w-lg rounded-2xl border border-gray-800 shadow-2xl transform scale-95 opacity-0 transition-all duration-300 p-6">
                <!-- Header -->
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-white">Buscar Usuarios</h3>
                    <button id="btn-close-search" class="text-gray-400 hover:text-white transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <!-- Search Input -->
                <div class="relative mb-6">
                    <input type="text" id="user-search-input" 
                        class="w-full bg-gray-800 text-white rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 transition-all"
                        placeholder="Nombre de usuario..." autocomplete="off">
                    <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>

                <!-- Results List -->
                <div id="search-results" class="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                    <p class="text-center text-gray-500 py-4">Escribe para buscar...</p>
                </div>
            </div>
        </div>
    `;
}

// Function to initialize logic (to be called from app.js or where modal is rendered)
export function initUserSearchLogic() {
    const modal = document.getElementById('user-search-modal');
    const content = document.getElementById('search-modal-content');
    const input = document.getElementById('user-search-input');
    const resultsContainer = document.getElementById('search-results');
    const btnClose = document.getElementById('btn-close-search');

    if (!modal) return;

    let debounceTimer;

    const performSearch = async (term) => {
        if (term.length < 2) {
            resultsContainer.innerHTML = '<p class="text-center text-gray-500 py-4">Escribe al menos 2 caracteres...</p>';
            return;
        }

        resultsContainer.innerHTML = '<div class="flex justify-center py-4"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div></div>'; // Loading

        const users = await usuarioService.search(term);

        if (users.length === 0) {
            resultsContainer.innerHTML = '<p class="text-center text-gray-500 py-4">No se encontraron usuarios.</p>';
        } else {
            resultsContainer.innerHTML = users.map(user => `
                <div class="flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors group cursor-pointer">
                    <div class="flex items-center gap-3">
                        <img src="${user.foto_perfil ? CONTENT_BASE_URL + '/' + user.foto_perfil : 'assets/images/default-avatar.png'}" 
                             class="w-10 h-10 rounded-full object-cover border border-gray-700">
                        <div>
                            <p class="text-white font-medium">${user.nombre}</p>
                            <p class="text-xs text-gray-400">@${user.nombre.toLowerCase().replace(/\s+/g, '')}</p>
                        </div>
                    </div>
                    <!-- Action Button (Future: Invite/Follow) -->
                    <button class="text-indigo-400 hover:text-indigo-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver
                    </button>
                </div>
            `).join('');
        }
    };

    input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => performSearch(e.target.value), 300);
    });

    // Close Logic
    const close = () => {
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            input.value = ''; // Reset
            resultsContainer.innerHTML = '<p class="text-center text-gray-500 py-4">Escribe para buscar...</p>';
        }, 300);
    };

    btnClose.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });

    // Determine how to open it? 
    // Usually via a global event or exposed function. For now, let's expose it.
    window.openUserSearch = () => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
            input.focus();
        }, 10);
    };
}
