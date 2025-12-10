import { authService } from '../services/authService.js';

export function setupStandardEvents(user, isOwner) {
    console.log('setupStandardEvents called', { user, isOwner });

    const isAdmin = authService.isAdmin();
    const canEdit = isOwner || isAdmin;
    console.log('setupStandardEvents perms:', { isAdmin, canEdit });

    const btnEdit = document.getElementById('btn-edit-profile');
    const btnLogout = document.getElementById('btn-logout-profile');

    console.log('setupStandardEvents elements:', { btnEdit, btnLogout });

    if (!canEdit) {
        console.log('setupStandardEvents: User cannot edit, listeners not attached');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                authService.logout();
                window.location.hash = '#/';
            });
        }
        return;
    }

    const modal = document.getElementById('edit-profile-modal');
    const modalContent = document.getElementById('edit-modal-content');
    const btnCancel = document.getElementById('btn-cancel-edit');
    const form = document.getElementById('edit-profile-form');
    const btnEditBanner = document.getElementById('btn-edit-banner');
    const btnEditAvatar = document.getElementById('btn-edit-avatar');

    console.log('setupStandardEvents modal elements:', { modal, btnCancel, form });

    const openModal = () => {
        console.log('openModal triggered');
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
            formData.append('id_usuario', user.id_usuario);
            await authService.updateProfile(formData);
            closeModal();
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(error.message || 'Error al actualizar perfil');
        } finally {
            btnSubmit.disabled = false;
        }
    });
}
