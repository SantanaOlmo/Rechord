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
    const isAdmin = authService.isAdmin();

    return `
        <div class="max-w-4xl mx-auto mt-6 bg-gray-900 rounded-xl shadow-2xl text-white overflow-hidden relative">
            ${ProfileHeader(user, isOwner)}
            ${ProfileBio(user)}
            
            ${isOwner && isAdmin ? `
                <div class="p-6 border-t border-gray-800">
                    <h3 class="text-xl font-bold mb-4">Gestión de Home Page</h3>
                    <div id="admin-home-config" class="space-y-4">
                        <p class="text-gray-400">Cargando configuración...</p>
                    </div>
                    
                    <form id="add-category-form" class="mt-6 bg-gray-800 p-4 rounded-lg hidden">
                        <h4 class="font-bold mb-2">Añadir Nueva Categoría</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <input type="text" name="titulo" placeholder="Título (ej: Rock 90s)" class="form-input bg-gray-700 border-none" required>
                            <input type="text" name="valor" placeholder="Hashtag (ej: rock)" class="form-input bg-gray-700 border-none" required>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mt-2">
                             <select name="tipo" class="form-input bg-gray-700 border-none">
                                <option value="hashtag">Hashtag</option>
                                <option value="static">Estático (top_likes, recent)</option>
                             </select>
                             <input type="number" name="orden" placeholder="Orden" class="form-input bg-gray-700 border-none" value="99">
                        </div>
                        <button type="submit" class="mt-2 btn-primary py-1 px-4 text-sm">Añadir</button>
                    </form>
                    <button id="btn-toggle-add-cat" class="mt-4 text-sm text-indigo-400 hover:text-indigo-300">+ Nueva Categoría</button>
                </div>
            ` : ''}

            ${EditProfileModal(user)}
        </div>
    `;
}

export function attachProfileEvents() {
    // ... (Existing Profile Events) ...
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
            if (user) formData.append('id_usuario', user.id_usuario);
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

    // === Admin Home Config Logic ===
    const adminConfigContainer = document.getElementById('admin-home-config');
    if (adminConfigContainer) {
        import('../services/cancionService.js').then(async ({ getHomeData, addHomeCategory, deleteHomeCategory, updateHomeConfigOrder }) => {
            let currentSections = [];

            const loadConfig = async () => {
                try {
                    currentSections = await getHomeData();
                    renderList();
                } catch (e) {
                    adminConfigContainer.innerHTML = '<p class="text-red-500">Error cargando config.</p>';
                }
            };

            const renderList = () => {
                if (currentSections.length === 0) {
                    adminConfigContainer.innerHTML = '<p class="text-gray-500">No hay categorías configuradas.</p>';
                    return;
                }
                adminConfigContainer.innerHTML = currentSections.map((s, index) => `
                    <div class="draggable-item flex items-center justify-between bg-gray-800 p-3 rounded cursor-move hover:bg-gray-750 transition-colors mb-2" 
                         draggable="true" 
                         data-index="${index}"
                         data-id="${s.id}">
                        <div class="flex items-center">
                            <svg class="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            <div>
                                <span class="font-bold block">${s.title}</span>
                                <span class="text-xs text-gray-400">(${s.type}: ${s.value})</span>
                            </div>
                        </div>
                        <button class="text-red-400 hover:text-red-300 p-1" onclick="window.deleteCategory(${s.id})">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                `).join('');

                setupDragEvents();
            };

            const setupDragEvents = () => {
                const draggables = adminConfigContainer.querySelectorAll('.draggable-item');
                let draggedItem = null;

                draggables.forEach(item => {
                    item.addEventListener('dragstart', (e) => {
                        draggedItem = item;
                        e.dataTransfer.effectAllowed = 'move';
                        setTimeout(() => item.classList.add('opacity-50'), 0);
                    });

                    item.addEventListener('dragend', () => {
                        draggedItem = null;
                        item.classList.remove('opacity-50');
                        saveOrder();
                    });

                    item.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        const afterElement = getDragAfterElement(adminConfigContainer, e.clientY);
                        if (afterElement == null) {
                            adminConfigContainer.appendChild(draggedItem);
                        } else {
                            adminConfigContainer.insertBefore(draggedItem, afterElement);
                        }
                    });
                });
            };

            const getDragAfterElement = (container, y) => {
                const draggableElements = [...container.querySelectorAll('.draggable-item:not(.opacity-50)')];
                return draggableElements.reduce((closest, child) => {
                    const box = child.getBoundingClientRect();
                    const offset = y - box.top - box.height / 2;
                    if (offset < 0 && offset > closest.offset) {
                        return { offset: offset, element: child };
                    } else {
                        return closest;
                    }
                }, { offset: Number.NEGATIVE_INFINITY }).element;
            };

            const saveOrder = async () => {
                const newOrder = [...adminConfigContainer.querySelectorAll('.draggable-item')].map((item, index) => ({
                    id: parseInt(item.dataset.id),
                    orden: index + 1
                }));

                try {
                    await updateHomeConfigOrder(newOrder);
                    console.log('Order saved');
                } catch (err) {
                    console.error('Error saving order', err);
                    alert('Error al guardar el nuevo orden');
                }
            };

            loadConfig();

            // Toggle Add Form
            const btnToggle = document.getElementById('btn-toggle-add-cat');
            const addForm = document.getElementById('add-category-form');
            const orderInput = addForm ? addForm.querySelector('input[name="orden"]') : null;
            if (orderInput) orderInput.parentElement.style.display = 'none'; // Hide manual order input

            btnToggle?.addEventListener('click', () => {
                addForm.classList.toggle('hidden');
                btnToggle.textContent = addForm.classList.contains('hidden') ? '+ Nueva Categoría' : 'Cancelar';
            });

            // Add Category
            addForm?.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    const formData = new FormData(addForm);
                    const data = Object.fromEntries(formData.entries());
                    data.orden = currentSections.length + 1;

                    await addHomeCategory(data);
                    addForm.reset();
                    addForm.classList.add('hidden');
                    btnToggle.textContent = '+ Nueva Categoría';
                    loadConfig();
                } catch (err) {
                    alert('Error: ' + err.message);
                }
            });

            // Delete Category Global
            window.deleteCategory = async (id) => {
                if (!confirm('¿Eliminar esta categoría?')) return;
                try {
                    await deleteHomeCategory(id);
                    loadConfig();
                } catch (err) {
                    alert(err.message);
                }
            };
        });
    }
}