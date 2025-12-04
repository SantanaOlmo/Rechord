import { authService } from '../services/authService.js';
import { CONTENT_BASE_URL } from '../config.js';

/**
 * Renderiza la página de perfil del usuario.
 * @param {object} user El objeto de usuario actual.
 */
export function Profile(user) {
    // Si no se pasa usuario, intentar obtener el actual
    if (!user) {
        user = authService.getCurrentUser();
    }

    // Si aún no hay usuario, mostrar mensaje o redirigir
    if (!user) {
        return `<div class="text-center text-white mt-10">
            <p class="mb-4">Debes iniciar sesión para ver tu perfil.</p>
            <a href="#/auth/login" class="text-indigo-400 hover:text-indigo-300">Iniciar sesión</a>
        </div>`;
    }

    const currentUser = authService.getCurrentUser();
    const isOwner = currentUser && currentUser.id_usuario === user.id_usuario;

    const bannerUrl = user.banner
        ? `${CONTENT_BASE_URL}/${user.banner}`
        : 'assets/images/default-banner.jpg';

    const avatarUrl = user.foto_perfil
        ? `${CONTENT_BASE_URL}/${user.foto_perfil}`
        : 'assets/icons/default_avatar.png';

    const userBio = user.bio || 'Sin biografía.';

    return `
        <div class="max-w-4xl mx-auto mt-6 bg-gray-900 rounded-xl shadow-2xl text-white overflow-hidden relative">
            
            <!-- Banner -->
            <div class="h-48 w-full bg-gray-800 relative group">
                <img src="${bannerUrl}" alt="Banner" class="w-full h-full object-cover opacity-80">
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                
                ${isOwner ? `
                <button id="btn-edit-banner" class="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300" title="Cambiar Banner">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                ` : ''}
            </div>

            <!-- Profile Header (Avatar + Info) -->
            <div class="px-8 pb-8 relative">
                <div class="flex flex-col md:flex-row items-end -mt-12 mb-6">
                    <!-- Avatar -->
                    <div class="relative">
                        <img src="${avatarUrl}" alt="${user.nombre}" class="w-32 h-32 rounded-full border-4 border-gray-900 shadow-lg object-cover bg-gray-700">
                        ${isOwner ? `
                        <button id="btn-edit-avatar" class="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md transition transform hover:scale-110" title="Cambiar Avatar">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </button>
                        ` : ''}
                    </div>
                    
                    <div class="mt-4 md:mt-0 md:ml-6 flex-1">
                        <h2 class="text-4xl font-extrabold text-white">${user.nombre}</h2>
                        <p class="text-indigo-400 font-medium">${user.email}</p>
                    </div>

                    ${isOwner ? `
                    <div class="mt-4 md:mt-0 flex gap-3">
                        <button id="btn-edit-profile"
                                class="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 shadow-md">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            Editar Perfil
                        </button>
                        
                        <button id="btn-logout-profile"
                                class="flex items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-150 shadow-md">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            Salir
                        </button>
                    </div>
                    ` : ''}
                </div>

                <!-- Bio Section -->
                <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 class="text-xl font-bold mb-3 text-indigo-400 flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Acerca de mí
                    </h3>
                    <p class="text-gray-300 leading-relaxed whitespace-pre-line">${userBio}</p>
                </div>
            </div>

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

        </div>
    `;
}

export function attachProfileEvents() {
    const btnEdit = document.getElementById('btn-edit-profile');
    const btnLogout = document.getElementById('btn-logout-profile');
    const modal = document.getElementById('edit-profile-modal');
    const modalContent = document.getElementById('edit-modal-content');
    const btnCancel = document.getElementById('btn-cancel-edit');
    const form = document.getElementById('edit-profile-form');

    const btnEditBanner = document.getElementById('btn-edit-banner');
    const btnEditAvatar = document.getElementById('btn-edit-avatar');

    const openModal = () => {
        if (!modal) return;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
    };

    const closeModal = () => {
        if (!modal) return;
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
    };

    btnEdit?.addEventListener('click', openModal);
    btnEditBanner?.addEventListener('click', openModal);
    btnEditAvatar?.addEventListener('click', openModal);

    btnCancel?.addEventListener('click', closeModal);

    // Close on click outside
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    btnLogout?.addEventListener('click', () => {
        authService.logout();
        window.location.hash = '#/';
    });

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btnSubmit = form.querySelector('button[type="submit"]');
        const originalText = btnSubmit.textContent;

        try {
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Guardando...';

            const formData = new FormData(form);
            const user = authService.getCurrentUser();
            if (user) {
                formData.append('id_usuario', user.id_usuario);
            }

            await authService.updateProfile(formData);

            closeModal();
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(error.message || 'Error al actualizar perfil');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = originalText;
        }
    });
}