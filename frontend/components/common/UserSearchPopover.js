import { usuarioService } from '../../services/usuarioService.js';

import { CONTENT_BASE_URL } from '../../config.js';

export function UserSearchPopover() {
    // Only HTML, logic attaches later
    return `
        <div id="user-invite-popover" class="hidden absolute top-12 right-2 w-64 bg-gray-800 border border-gray-700 shadow-xl rounded-lg z-50 flex flex-col p-2">
            <input type="text" id="invite-search-input" placeholder="Buscar usuario..." 
                class="w-full bg-gray-900 text-white text-sm rounded border border-gray-600 px-3 py-2 outline-none focus:border-indigo-500 mb-2">
            
            <div id="invite-results" class="flex-1 max-h-48 overflow-y-auto space-y-1">
                <!-- Results injected here -->
                <p class="text-xs text-gray-500 text-center py-2">Escribe para buscar...</p>
            </div>
        </div>
    `;
}

export function initInvitePopoverLogic() {
    const input = document.getElementById('invite-search-input');
    const results = document.getElementById('invite-results');
    const popover = document.getElementById('user-invite-popover');

    if (!input || !results) return;

    let debounce;

    input.addEventListener('input', (e) => {
        const term = e.target.value.trim();
        clearTimeout(debounce);

        if (term.length < 2) {
            results.innerHTML = '<p class="text-xs text-gray-500 text-center py-2">Escribe para buscar...</p>';
            return;
        }

        debounce = setTimeout(async () => {
            const users = await usuarioService.search(term).catch(() => []);
            if (users.length === 0) {
                results.innerHTML = '<p class="text-xs text-gray-400 text-center py-2">No se encontraron usuarios.</p>';
                return;
            }

            results.innerHTML = users.map(u => `
                <div class="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer transition-colors"
                    onclick="window.inviteUser(${u.id_usuario})">
                    <img src="${u.foto_perfil ? CONTENT_BASE_URL + '/' + u.foto_perfil : 'assets/icons/profile.svg'}" 
                        class="w-6 h-6 rounded-full object-cover mr-2 bg-gray-600">
                    <span class="text-sm text-gray-200 truncate flex-1">${u.nombre}</span>
                    <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
            `).join('');
        }, 300);
    });

    window.inviteUser = (userId) => {
        // In a real implementation this would likely verify the user isn't already in
        console.log('Inviting user', userId);
        alert('Invitación enviada (Simulación)');
        popover.classList.add('hidden');
        input.value = '';
        results.innerHTML = '';
    };

    // Global click to close
    document.addEventListener('click', (e) => {
        const toggleBtn = document.getElementById('btn-invite-user'); // The button that opens it
        if (popover && !popover.classList.contains('hidden')) {
            if (!popover.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
                popover.classList.add('hidden');
            }
        }
    });

    window.toggleInvitePopover = () => {
        popover.classList.toggle('hidden');
        if (!popover.classList.contains('hidden')) input.focus();
    };
}
