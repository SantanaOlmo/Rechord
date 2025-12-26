import { CONTENT_BASE_URL } from '../../config.js';

export class HomeConfigList {
    constructor(containerId) {
        this.containerId = containerId;
    }

    render(configs) {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        if (configs.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center py-12 text-gray-500">
                    <p class="mb-4">No hay secciones configuradas.</p>
                </div>
            `;
            return;
        }

        const html = `
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="text-xs text-[var(--text-muted)] border-b border-[var(--border-primary)] uppercase tracking-wider">
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                            <th class="p-4 font-medium">Orden</th>
                            <th class="p-4 font-medium">Título Visible</th>
                            <th class="p-4 font-medium">Tipo</th>
                            <th class="p-4 font-medium">Contenido/Hashtag</th>
                            <th class="p-4 font-medium text-center">Visible</th>
                            <th class="p-4 font-medium text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[var(--border-primary)]">
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                        ${configs.map(conf => this.renderRow(conf)).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
        this.attachEvents();
    }

    renderRow(conf) {
        const isStatic = conf.tipo === 'static';
        return `
            <tr class="hover:bg-[var(--bg-tertiary)] group transition-colors">
                <td class="p-4 text-[var(--text-muted)] font-mono text-sm w-16">
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                    ${conf.orden}
                </td>
                <td class="p-4">
                    <div class="flex items-center">
                        <span class="text-[var(--text-primary)] font-medium" id="display-title-${conf.id_config}">${conf.titulo_mostrar}</span>
                        <input type="text" id="edit-title-${conf.id_config}" value="${conf.titulo_mostrar}" 
                               class="hidden bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--accent-primary)] rounded px-2 py-1 text-sm focus:outline-none w-full ml-2">
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                    </div>
                </td>
                <td class="p-4">
                    <span class="px-2 py-1 rounded text-xs font-semibold ${isStatic ? 'bg-indigo-900/50 text-indigo-300' : 'bg-purple-900/50 text-purple-300'}">
                        ${isStatic ? 'Estática' : 'Hashtag'}
                    </span>
                </td>
                <td class="p-4 text-[var(--text-muted)] text-sm">
                    ${conf.valor}
                </td>
                <td class="p-4 text-center">
                    <button class="btn-toggle-visibility p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors ${conf.activo == 1 ? 'text-green-400' : 'text-[var(--text-muted)]'}" 
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                            data-id="${conf.id_config}" data-status="${conf.activo}">
                        ${conf.activo == 1
                ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`
                : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.572-2.572M7.5 7.5c1.4-1.35 3.16-2.5 5.5-2.5 4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.572 2.572m-2.428-2.428A3 3 0 0115 12a3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 012.428-2.428"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18"></path></svg>`
            }
                    </button>
                </td>
                <td class="p-4 text-right space-x-2">
                    <button class="btn-edit-row p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" data-id="${conf.id_config}">
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <!-- Save Button (Hidden initially) -->
                    <button class="btn-save-row hidden p-2 text-green-400 hover:text-green-300 transition-colors" data-id="${conf.id_config}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </button>
                    <!-- Cancel Button (Hidden initially) -->
                    <button class="btn-cancel-row hidden p-2 text-red-400 hover:text-red-300 transition-colors" data-id="${conf.id_config}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </td>
            </tr>
        `;
    }

    attachEvents() {
        // Toggle Visibility
        document.querySelectorAll('.btn-toggle-visibility').forEach(btn => {
            btn.onclick = (e) => {
                const id = btn.dataset.id;
                const currentStatus = btn.dataset.status == 1;
                // Dispatch custom event to Dashboard
                const event = new CustomEvent('toggle-home-visibility', {
                    detail: { id, newStatus: !currentStatus ? 1 : 0 },
                    bubbles: true
                });
                document.getElementById(this.containerId).dispatchEvent(event);
            };
        });

        // Edit Mode
        document.querySelectorAll('.btn-edit-row').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                this.toggleEditMode(id, true);
            };
        });

        // Cancel Edit
        document.querySelectorAll('.btn-cancel-row').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                this.toggleEditMode(id, false);
            };
        });

        // Save Edit
        document.querySelectorAll('.btn-save-row').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                const input = document.getElementById(`edit-title-${id}`);
                const newTitle = input.value;

                const event = new CustomEvent('update-home-config', {
                    detail: { id, title: newTitle },
                    bubbles: true
                });
                document.getElementById(this.containerId).dispatchEvent(event);
            };
        });
    }

    toggleEditMode(id, showEdit) {
        const display = document.getElementById(`display-title-${id}`);
        const input = document.getElementById(`edit-title-${id}`);
        const btnEdit = document.querySelector(`.btn-edit-row[data-id="${id}"]`);
        const btnSave = document.querySelector(`.btn-save-row[data-id="${id}"]`);
        const btnCancel = document.querySelector(`.btn-cancel-row[data-id="${id}"]`);

        if (showEdit) {
            display.classList.add('hidden');
            input.classList.remove('hidden');
            input.focus();
            btnEdit.classList.add('hidden');
            btnSave.classList.remove('hidden');
            btnCancel.classList.remove('hidden');
        } else {
            display.classList.remove('hidden');
            input.classList.add('hidden');
            btnEdit.classList.remove('hidden');
            btnSave.classList.add('hidden');
            btnCancel.classList.add('hidden');
            // Reset value
            input.value = display.textContent;
        }
    }
}
