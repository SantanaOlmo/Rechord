import { AdminUserRow } from './AdminUserRow.js';

export class AdminUserList {
    constructor(containerId) {
        this.containerId = containerId;
    }

    render(users, expandedSet, editingUser, messagingUser) {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        if (users.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center p-12 text-[var(--text-muted)]">

                    <svg class="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    <p class="text-lg font-medium">No se encontraron usuarios</p>
                    <p class="text-xs">Intenta con otros términos de búsqueda</p>
                </div>
            `;
            return;
        }

        container.innerHTML = users.map(user =>
            AdminUserRow.render(user, {
                isExpanded: expandedSet.has(user.id_usuario),
                isEditing: editingUser && editingUser.id_usuario === user.id_usuario,
                isMessaging: messagingUser && messagingUser.id_usuario === user.id_usuario
            })
        ).join('');
    }
}
