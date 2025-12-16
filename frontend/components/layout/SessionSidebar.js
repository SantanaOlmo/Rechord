import { UserSearchPopover, initInvitePopoverLogic } from '../common/UserSearchPopover.js';
import { Store, EVENTS } from '../../core/StateStore.js';
import { CONTENT_BASE_URL } from '../../config.js';

export function SessionSidebar() {
    setTimeout(initSessionLogic, 0);

    const inviteIcon = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m-9-2V7H4v3H1v2h3v3h2v-3h3v-2zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4"/></svg>`; // IcSharpPersonAdd

    return `
        <div class="flex flex-col h-full text-[var(--text-secondary)] relative">
            <!-- Room Header -->
            <div class="flex items-center p-4 border-b border-[var(--border-primary)] bg-[var(--sidebar-bg)] flex-shrink-0">
                 <!-- Room Image (Click to Edit) -->
                <div class="relative group mr-3 cursor-pointer" onclick="window.editRoomImage()">
                    <img id="session-room-img" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='2' width='20' height='20' rx='2' ry='2' fill='%231f2937' stroke='none'/%3E%3Cpath d='M9 18V5l12-2v13'/%3E%3Carea/%3E%3C/svg%3E" class="w-12 h-12 rounded bg-gray-800 object-cover">
                    <div class="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center rounded">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </div>
                </div>
                
                <div class="flex-1 overflow-hidden">
                    <h3 id="session-room-name" class="font-bold text-[var(--text-primary)] text-sm truncate cursor-pointer hover:border-b hover:border-[var(--text-muted)] inline-block" onclick="window.editRoomName()">
                        Mi Sala
                    </h3>
                    <p class="text-xs text-green-400 flex items-center mt-1">
                        <span class="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span> En vivo
                    </p>
                </div>

                <!-- Invite Button -->
                <button id="btn-invite-user" class="text-[var(--accent-light)] hover:text-white p-2 rounded-full hover:bg-[var(--accent-hover)] transition-colors ml-2 relative" 
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
            <!-- Tabs -->
            <div class="flex border-b border-[var(--border-primary)] text-xs font-medium bg-[var(--sidebar-bg)] flex-shrink-0">
                <button class="flex-1 py-2 text-center hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] text-[var(--accent-light)] border-b-2 border-[var(--accent-primary)] transition-colors" 
                    onclick="window.switchSessionTab('users', this)">Usuarios</button>
                <button class="flex-1 py-2 text-center hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] text-[var(--text-muted)] border-b-2 border-transparent transition-colors"

            <!-- Content Area -->
            <div id="session-tab-content" class="flex-1 overflow-y-auto p-4 bg-[var(--bg-primary)]/50">
                <!-- Injected via JS -->
                 <div id="tab-users" class="space-y-2">
                    <p class="text-xs text-[var(--text-muted)] text-center mt-4">Cargando miembros...</p>
                 </div>
                 <div id="tab-info" class="hidden space-y-4">
                    <div class="bg-[var(--bg-secondary)] p-3 rounded text-center">
                        <p class="text-xs text-[var(--text-muted)] mb-1">Código de Sala</p>
                        <p id="session-room-code" class="text-lg font-mono text-[var(--text-primary)] tracking-widest select-all">ABCD</p>
                    </div>
                    <button class="w-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-xs py-2 rounded transition-colors"
                        onclick="navigator.clipboard.writeText(document.getElementById('session-room-code').innerText); alert('Copiado!')">
                        Copiar Código
                    </button>
                 </div>
                 <div id="tab-queue" class="hidden space-y-2">
                    <p class="text-xs text-[var(--text-muted)] text-center mt-4">La cola está vacía.</p>
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
            b.classList.remove('text-[var(--accent-light)]', 'border-[var(--accent-primary)]');
            b.classList.add('text-[var(--text-muted)]', 'border-transparent');
        });
        // Activate Btn
        btn.classList.remove('text-[var(--text-muted)]', 'border-transparent');
        btn.classList.add('text-[var(--accent-light)]', 'border-[var(--accent-primary)]');

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
