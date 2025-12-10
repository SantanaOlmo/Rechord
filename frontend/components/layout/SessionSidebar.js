import { UserSearchPopover, initInvitePopoverLogic } from '../common/UserSearchPopover.js';
import { Store, EVENTS } from '../../core/StateStore.js';
import { CONTENT_BASE_URL } from '../../config.js';

export function SessionSidebar() {
    setTimeout(initSessionLogic, 0);

    const inviteIcon = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m-9-2V7H4v3H1v2h3v3h2v-3h3v-2zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4"/></svg>`; // IcSharpPersonAdd

    return `
        <div class="flex flex-col h-full text-gray-300 relative">
            <!-- Room Header -->
            <div class="flex items-center p-4 border-b border-gray-800 bg-gray-950 flex-shrink-0">
                 <!-- Room Image (Click to Edit) -->
                <div class="relative group mr-3 cursor-pointer" onclick="window.editRoomImage()">
                    <img id="session-room-img" src="assets/images/default-album.png" class="w-12 h-12 rounded bg-gray-800 object-cover">
                    <div class="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center rounded">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </div>
                </div>
                
                <div class="flex-1 overflow-hidden">
                    <h3 id="session-room-name" class="font-bold text-white text-sm truncate cursor-pointer hover:border-b hover:border-gray-500 inline-block" onclick="window.editRoomName()">
                        Mi Sala
                    </h3>
                    <p class="text-xs text-green-400 flex items-center mt-1">
                        <span class="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span> En vivo
                    </p>
                </div>

                <!-- Invite Button -->
                <button id="btn-invite-user" class="text-indigo-400 hover:text-white p-2 rounded-full hover:bg-indigo-600 transition-colors ml-2 relative" 
                    title="Invitar a la sala" onclick="window.toggleInvitePopover()">
                    ${inviteIcon}
                </button>
                <!-- Popover Anchor -->
                ${UserSearchPopover()}
            </div>

            <!-- Tabs -->
            <div class="flex border-b border-gray-800 text-xs font-medium bg-gray-950 flex-shrink-0">
                <button class="flex-1 py-2 text-center hover:bg-gray-800 hover:text-white text-indigo-400 border-b-2 border-indigo-500 transition-colors" 
                    onclick="window.switchSessionTab('users', this)">Usuarios</button>
                <button class="flex-1 py-2 text-center hover:bg-gray-800 hover:text-white text-gray-400 border-b-2 border-transparent transition-colors"
                    onclick="window.switchSessionTab('info', this)">Info</button>
                <button class="flex-1 py-2 text-center hover:bg-gray-800 hover:text-white text-gray-400 border-b-2 border-transparent transition-colors"
                    onclick="window.switchSessionTab('queue', this)">Cola</button>
            </div>

            <!-- Content Area -->
            <div id="session-tab-content" class="flex-1 overflow-y-auto p-4 bg-gray-900/50">
                <!-- Injected via JS -->
                 <div id="tab-users" class="space-y-2">
                    <p class="text-xs text-gray-500 text-center mt-4">Cargando miembros...</p>
                 </div>
                 <div id="tab-info" class="hidden space-y-4">
                    <div class="bg-gray-800 p-3 rounded text-center">
                        <p class="text-xs text-gray-400 mb-1">Código de Sala</p>
                        <p id="session-room-code" class="text-lg font-mono text-white tracking-widest select-all">ABCD</p>
                    </div>
                    <button class="w-full bg-gray-800 hover:bg-gray-700 text-white text-xs py-2 rounded transition-colors"
                        onclick="navigator.clipboard.writeText(document.getElementById('session-room-code').innerText); alert('Copiado!')">
                        Copiar Código
                    </button>
                 </div>
                 <div id="tab-queue" class="hidden space-y-2">
                    <p class="text-xs text-gray-500 text-center mt-4">La cola está vacía.</p>
                 </div>
            </div>
        </div>
    `;
}

function initSessionLogic() {
    initInvitePopoverLogic();

    // Tab Switching
    window.switchSessionTab = (tabName, btn) => {
        // Reset Tabs
        btn.parentElement.querySelectorAll('button').forEach(b => {
            b.classList.remove('text-indigo-400', 'border-indigo-500');
            b.classList.add('text-gray-400', 'border-transparent');
        });
        // Activate Btn
        btn.classList.remove('text-gray-400', 'border-transparent');
        btn.classList.add('text-indigo-400', 'border-indigo-500');

        // Hide All Content
        const container = document.getElementById('session-tab-content');
        ['tab-users', 'tab-info', 'tab-queue'].forEach(id => container.querySelector('#' + id).classList.add('hidden'));

        // Show Target
        container.querySelector('#tab-' + tabName).classList.remove('hidden');
    };

    // Metadata Editing
    window.editRoomName = () => {
        const h3 = document.getElementById('session-room-name');
        const current = h3.innerText;
        const newName = prompt('Nombre de la sala:', current);
        if (newName && newName.trim()) {
            h3.innerText = newName;
            // TODO: Emit update to server
        }
    };

    window.editRoomImage = () => {
        const url = prompt('URL de la imagen de la sala:');
        if (url) {
            document.getElementById('session-room-img').src = url;
            // TODO: Emit update to server
        }
    };

    // Subscribe to Room Updates for Real Data
    Store.subscribe(EVENTS.SOCKET.MEMBER_UPDATE, (data) => {
        const room = Store.getState().room;
        if (room && room.id) {
            document.getElementById('session-room-code').innerText = room.id;
            // Mock Member List for now since backend doesn't send list yet
            const user = Store.getState().user; // Self
            const usersTab = document.getElementById('tab-users');
            if (usersTab) {
                // Just showing self as example
                usersTab.innerHTML = `
                    <div class="flex items-center p-2 rounded bg-gray-800/50">
                         <img src="${user.foto_perfil ? CONTENT_BASE_URL + '/' + user.foto_perfil : 'assets/icons/profile.svg'}" class="w-8 h-8 rounded-full border border-green-500 mr-2">
                         <div>
                            <p class="text-sm text-white font-medium">${user.nombre} <span class="text-xs text-green-400">(Tú)</span></p>
                            <p class="text-[10px] text-gray-500">Master</p>
                         </div>
                    </div>
                `;
            }
        }
    });
}
