import { authService } from '../services/authService.js';
import { CONTENT_BASE_URL } from '../config.js';
import { ProfileHeader } from '../components/ProfileHeader.js';
import { ProfileBio } from '../components/ProfileBio.js';
import { EditProfileModal } from '../components/EditProfileModal.js';

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

    return `
        <div class="max-w-4xl mx-auto mt-6 bg-gray-900 rounded-xl shadow-2xl text-white overflow-hidden relative">
            ${ProfileHeader(user, isOwner)}
            ${ProfileBio(user)}
            ${EditProfileModal(user)}
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