import { authService } from '../../services/authService.js';
import { usuarioService } from '../../services/usuarioService.js';
import { chatService } from '../../services/chatService.js';
import { Toast } from '../Toast.js';
import { AdminUserList } from './AdminUserList.js';
import { SearchInput } from '../common/SearchInput.js';

export class AdminUsersTab {
    constructor(containerId) {
        this.containerId = containerId;
        this.allUsers = [];
        this.filteredUsers = [];
        this.expandedUsers = new Set();
        this.editingUser = null;
        this.messagingUser = null;
    }

    async init() {
        await this.loadUsers();
        this.render();
    }

    async loadUsers() {
        try {
            this.allUsers = await authService.getAllUsers();
            this.filteredUsers = [...this.allUsers];
        } catch (e) { console.error('Error loading users', e); }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Toolbar + List Structure
        container.innerHTML = `
            <div class="p-4 border-b border-gray-800 bg-gray-950 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-10">
                <div class="flex items-center space-x-2 text-gray-400 text-sm">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <span class="font-medium">Directorio Usuarios</span>
                    <span class="bg-gray-800 text-xs px-2 py-0.5 rounded-full text-indigo-400 font-mono">${this.allUsers.length}</span>
                </div>
                <div id="admin-search-container" class="w-full md:w-80"></div>
            </div>
            <div id="admin-users-list" class="divide-y divide-gray-800/50"></div>
        `;

        this.renderList();
        this.setupSearch();
        this.setupEvents(container);
    }

    renderList() {
        const userList = new AdminUserList('admin-users-list');
        userList.render(this.filteredUsers, this.expandedUsers, this.editingUser, this.messagingUser);
    }

    setupSearch() {
        const searchInput = new SearchInput({
            placeholder: 'Buscar usuario...',
            onSearch: (term) => {
                const lowerTerm = term.toLowerCase().trim();
                this.filteredUsers = this.allUsers.filter(u => u.nombre.toLowerCase().includes(lowerTerm) || u.email.toLowerCase().includes(lowerTerm));
                this.renderList();
            }
        });
        const container = document.getElementById('admin-search-container');
        if (container) {
            container.innerHTML = searchInput.render();
            searchInput.attachEvents(container);
        }
    }

    setupEvents(container) {
        const listDiv = document.getElementById('admin-users-list');
        if (listDiv) {
            listDiv.onclick = async (e) => {
                const target = e.target.closest('[data-action]');
                if (!target) return;
                const action = target.dataset.action;
                const id = parseInt(target.dataset.id);
                await this.handleUserAction(action, id);
            };
        }
    }

    async handleUserAction(action, id) {
        if (action === 'toggle-expand') {
            if (this.expandedUsers.has(id)) this.expandedUsers.delete(id);
            else this.expandedUsers.add(id);
            this.renderList();
        }
        else if (action === 'edit') {
            this.editingUser = this.allUsers.find(u => u.id_usuario === id);
            this.renderList();
        }
        else if (action === 'cancel-edit') {
            this.editingUser = null;
            this.renderList();
        }
        else if (action === 'save-edit') {
            const name = document.getElementById(`edit-name-${id}`).value;
            const email = document.getElementById(`edit-email-${id}`).value;
            const bio = document.getElementById(`edit-bio-${id}`).value;
            await this.saveUserChanges(id, name, email, bio);
        }
        else if (action === 'delete') {
            if (confirm('¿Eliminar usuario?')) {
                try {
                    await usuarioService.deleteUser(id);
                    this.allUsers = this.allUsers.filter(u => u.id_usuario !== id);
                    this.filteredUsers = this.filteredUsers.filter(u => u.id_usuario !== id);
                    this.renderList();
                } catch (e) { alert(e.message); }
            }
        }
        else if (action === 'msg') {
            this.messagingUser = this.allUsers.find(u => u.id_usuario === id);
            this.editingUser = null; // Close edit if open
            if (!this.expandedUsers.has(id)) this.expandedUsers.add(id); // Auto expand
            this.renderList();
        }
        else if (action === 'cancel-msg') {
            this.messagingUser = null;
            this.renderList();
        }
        else if (action === 'send-msg') {
            const content = document.getElementById(`msg-content-${id}`).value?.trim();
            if (!content) {
                Toast.show('El mensaje no puede estar vacío', 'error');
                return;
            }

            try {
                const currentUser = authService.getCurrentUser();
                if (!currentUser) throw new Error('No admin user logged in');

                await chatService.sendMessage(currentUser.id_usuario, id, content);
                Toast.show('Mensaje enviado correctamente', 'success');
                this.messagingUser = null;
                this.renderList();
            } catch (e) {
                console.error(e);
                Toast.show('Error al enviar mensaje: ' + e.message, 'error');
            }
        }
    }

    async saveUserChanges(id, nombre, email, bio) {
        try {
            const formData = new FormData();
            formData.append('id_usuario', id);
            formData.append('nombre', nombre);
            formData.append('email', email);
            formData.append('bio', bio);
            await usuarioService.updateProfile(formData);

            const idx = this.allUsers.findIndex(u => u.id_usuario === id);
            if (idx !== -1) this.allUsers[idx] = { ...this.allUsers[idx], nombre, email, bio };
            this.filteredUsers = [...this.allUsers];
            this.editingUser = null;
            this.renderList();
        } catch (e) { alert(e.message); }
    }
}
