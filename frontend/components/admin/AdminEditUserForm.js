export const AdminEditUserForm = {
    render: (user) => `
        <div class="space-y-4 max-w-2xl bg-gray-900/50 p-4 rounded-lg border border-gray-800">
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Editar Usuario</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nombre</label>
                    <input type="text" id="edit-name-${user.id_usuario}" value="${user.nombre}" 
                        class="w-full bg-gray-950 text-white border border-gray-700 rounded px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none transition-colors">
                </div>
                <div>
                     <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                    <input type="email" id="edit-email-${user.id_usuario}" value="${user.email}" 
                        class="w-full bg-gray-950 text-white border border-gray-700 rounded px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none transition-colors">
                </div>
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Bio</label>
                <textarea id="edit-bio-${user.id_usuario}" rows="3" 
                    class="w-full bg-gray-950 text-white border border-gray-700 rounded px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none transition-colors">${user.bio || ''}</textarea>
            </div>
            <div class="flex space-x-3 justify-end pt-2">
                <button data-action="cancel-edit" data-id="${user.id_usuario}" 
                    class="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                    Cancelar
                </button>
                <button data-action="save-edit" data-id="${user.id_usuario}" 
                    class="px-6 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-900/30 transition-all transform hover:-translate-y-0.5">
                    Guardar Cambios
                </button>
            </div>
        </div>
    `
};
