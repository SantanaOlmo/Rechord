export function EditProfileModal(user) {
    return `
        <!-- Edit Modal -->
        <div id="edit-profile-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 backdrop-blur-sm">
            <div class="bg-gray-800 rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-gray-700 transform transition-all scale-95 opacity-0" id="edit-modal-content">
                <h3 class="text-2xl font-bold text-white mb-6">Editar Perfil</h3>

                <form id="edit-profile-form" class="space-y-4">
                    <div>
                        <label class="block text-gray-400 text-sm font-bold mb-2">Nombre de Usuario</label>
                        <input type="text" name="nombre" value="${user.nombre}" class="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500">
                    </div>

                    <div>
                        <label class="block text-gray-400 text-sm font-bold mb-2">Correo Electrónico</label>
                        <input type="email" name="email" value="${user.email}" class="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500">
                    </div>

                    <div>
                        <label class="block text-gray-400 text-sm font-bold mb-2">Biografía</label>
                        <textarea name="bio" rows="3" class="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500">${user.bio || ''}</textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-gray-400 text-sm font-bold mb-2">Avatar</label>
                            <input type="file" name="image_file" accept="image/*" class="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700">
                        </div>
                        <div>
                            <label class="block text-gray-400 text-sm font-bold mb-2">Banner</label>
                            <input type="file" name="banner_file" accept="image/*" class="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700">
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 mt-6">
                        <button type="button" id="btn-cancel-edit" class="px-4 py-2 text-gray-300 hover:text-white transition">Cancelar</button>
                        <button type="submit" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition transform hover:scale-105">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}
