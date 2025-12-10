import { getAdminHomeData, addHomeCategory, deleteHomeCategory, updateHomeConfigOrder, updateHomeCategory, toggleHomeVisibility } from '../services/cancionService.js';

let currentSections = [];
let editingId = null;

export function setupAdminLogic() {
    console.log('setupAdminLogic: Called');
    const adminConfigContainer = document.getElementById('admin-home-config');
    if (!adminConfigContainer) {
        console.error('setupAdminLogic: Container not found');
        return;
    }

    const loadConfig = async () => {
        console.log('Admin Home Config: Loading...');
        try {
            const rawData = await getAdminHomeData();
            // Map DB fields to frontend expected fields
            currentSections = rawData.map(item => ({
                id: item.id_config || item.id,
                title: item.titulo_mostrar || item.title,
                value: item.valor || item.value,
                type: item.tipo || item.type,
                orden: item.orden,
                activo: item.activo
            }));

            console.log('Admin Home Config: Data received', currentSections);
            renderList(adminConfigContainer);
        } catch (e) {
            console.error('Admin Home Config: Error', e);
            adminConfigContainer.innerHTML = '<p class="text-red-500">Error cargando config.</p>';
        }
    };

    loadConfig();
    setupAddForm();
}

function renderList(container) {
    if (currentSections.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No hay categorías configuradas.</p>';
        return;
    }
    container.innerHTML = currentSections.map((s, index) => {
        if (s.id == editingId) {
            return renderEditRow(s);
        }

        const isStatic = s.type === 'static';
        // Parse 'activo' robustly. If undefined/null, default to 1 (Visible) as requested.
        let rawActive = s.activo ?? s.active;
        if (rawActive === undefined || rawActive === null) rawActive = 1;
        const isActive = parseInt(rawActive) === 1;

        return `
    <div class="draggable-item flex items-center justify-between bg-gray-800 p-3 rounded cursor-move hover:bg-gray-750 transition-colors mb-2 ${s.activo == 0 ? 'opacity-60' : ''}" 
            draggable="true" 
            data-index="${index}"
            data-id="${s.id}">
        <div class="flex items-center flex-1">
            <svg class="w-5 h-5 text-gray-500 mr-3 cursor-move" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            <div>
                <span class="font-bold block ${s.activo == 0 ? 'text-gray-500 line-through' : ''}">${s.title}</span>
                <span class="text-xs text-gray-400">(${s.type}: ${s.value})</span>
            </div>
        </div>
            <button class="btn-toggle-visibility text-gray-400 hover:text-white p-1" data-id="${s.id}" data-active="${s.activo}">
                ${isActive // Using the parsed isActive variable which defaults to 1
                ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>'
                : '<svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>'
            }
            </button>
            <button class="btn-edit-category text-indigo-400 hover:text-indigo-300 p-1" data-id="${s.id}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
            <button class="btn-delete-category text-red-400 hover:text-red-300 p-1" data-id="${s.id}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    </div>
`}).join('');

    setupDragEvents(container);
    setupActionButtons(container); // New function to handle clicks
}

function renderEditRow(s) {
    const isStatic = s.type === 'static';
    return `
        <div class="bg-gray-800 p-4 rounded mb-2 border border-indigo-500 shadow-xl">
            <h4 class="text-white text-sm font-bold mb-3">Editar: ${s.title}</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input type="text" id="edit-title-${s.id}" value="${s.title}" class="bg-gray-700 text-white rounded p-2 text-sm border border-gray-600 focus:border-indigo-500 outline-none" placeholder="Título">
                <input type="text" id="edit-value-${s.id}" value="${s.value}" ${isStatic ? 'disabled title="No editable en estático"' : ''} class="bg-gray-700 text-white rounded p-2 text-sm border border-gray-600 focus:border-indigo-500 outline-none ${isStatic ? 'opacity-50 cursor-not-allowed' : ''}" placeholder="Valor/Hashtag">
            </div>
            <div class="grid grid-cols-1 gap-3 mb-4">
                 <select id="edit-type-${s.id}" ${isStatic ? 'disabled' : ''} class="bg-gray-700 text-white rounded p-2 text-sm border border-gray-600 outline-none w-full ${isStatic ? 'opacity-50 cursor-not-allowed' : ''}">
                    <option value="hashtag" ${s.type === 'hashtag' ? 'selected' : ''}>Hashtag</option>
                    <option value="static" ${s.type === 'static' ? 'selected' : ''}>Estático</option>
                </select>
            </div>
            <div class="flex justify-end gap-2">
                <button class="btn-cancel-edit bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors" data-id="${s.id}">
                    Cancelar
                </button>
                <button class="btn-save-edit bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded text-xs font-medium transition-colors shadow-lg" data-id="${s.id}">
                    Guardar
                </button>
            </div>
        </div>
    `;
}

function setupActionButtons(container) {
    // Edit buttons (Start Edit)
    container.querySelectorAll('.btn-edit-category').forEach(btn => {
        btn.addEventListener('click', (e) => {
            editingId = e.currentTarget.dataset.id;
            renderList(container);
        });
    });

    // Cancel Edit
    container.querySelectorAll('.btn-cancel-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            editingId = null;
            renderList(container);
        });
    });

    // Save Edit
    container.querySelectorAll('.btn-save-edit').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            await saveEdit(id);
        });
    });

    // Toggle Visibility buttons
    container.querySelectorAll('.btn-toggle-visibility').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnEl = e.currentTarget.closest('button');
            const id = btnEl.dataset.id;
            const currentActive = btnEl.dataset.active == 1;
            toggleVisibility(id, !currentActive);
        });
    });

    // Delete buttons
    container.querySelectorAll('.btn-delete-category').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.closest('button').dataset.id;
            deleteCategory(id);
        });
    });
}

function setupDragEvents(container) {
    const draggables = container.querySelectorAll('.draggable-item');
    let draggedItem = null;

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggedItem = draggable;
            setTimeout(() => draggable.classList.add('opacity-50'), 0);
        });
        draggable.addEventListener('dragend', async () => {
            if (draggedItem) draggedItem.classList.remove('opacity-50');
            draggedItem = null;

            const newOrder = Array.from(container.querySelectorAll('.draggable-item')).map((item, index) => ({
                id: item.dataset.id,
                orden: index + 1
            }));
            try {
                await updateHomeConfigOrder(newOrder);
            } catch (e) { console.error('Order update failed', e); }
        });
    });

    container.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector('.draggable-item.opacity-50');
        if (draggable) {
            if (afterElement == null) {
                container.appendChild(draggable);
            } else {
                container.insertBefore(draggable, afterElement);
            }
        }
    });
}

function getDragAfterElement(container, y) {
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
}

async function toggleVisibility(id, newStatus) {
    try {
        const section = currentSections.find(s => s.id == id);
        if (!section) return;

        // Optimistic update
        // newStatus is boolean (true = visible/1, false = hidden/0)
        section.activo = newStatus ? 1 : 0;
        renderList(document.getElementById('admin-home-config'));

        // Update Backend using dedicated toggle endpoint
        await toggleHomeVisibility(section.id, newStatus);

        // Refresh to be sure
        setupAdminLogic();
    } catch (e) {
        console.error('Error changing visibility:', e);
        // setupAdminLogic(); // Revert logic if needed, but let's keep it silent or log only as requested
    }
}

async function deleteCategory(id) {
    if (!confirm('¿Eliminar esta sección?')) return;
    try {
        await deleteHomeCategory(id);
        setupAdminLogic(); // Reload
    } catch (e) { alert('Error eliminando'); }
}

async function saveEdit(id) {
    const title = document.getElementById(`edit-title-${id}`).value;
    const value = document.getElementById(`edit-value-${id}`).value;
    const type = document.getElementById(`edit-type-${id}`).value;
    // Order is preserved from current state, since drag n drop handles it separately
    const section = currentSections.find(s => s.id == id);
    if (!section) return;

    try {
        await updateHomeCategory({
            id: id,
            titulo: title,
            valor: value,
            tipo: type,
            orden: section.orden || 99,
            activo: section.activo // Preserve active state
        });
        editingId = null;
        setupAdminLogic(); // Reload data
    } catch (e) {
        alert('Error guardando: ' + e.message);
    }
}


async function editCategory(id) {
    console.log('editCategory called with id', id);
    const section = currentSections.find(s => s.id == id);
    if (!section) {
        console.error('Section not found for id', id);
        return;
    }

    const addForm = document.getElementById('add-category-form');
    if (!addForm) return;

    addForm.classList.remove('hidden');
    addForm.dataset.mode = 'edit';
    addForm.dataset.editId = id;

    addForm.querySelector('h4').textContent = 'Editar Categoría';
    const submitBtn = addForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Guardar Cambios';

    // Add Cancel Button if not exists
    if (!addForm.querySelector('.btn-cancel-custom')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn-cancel-custom bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-lg font-medium shadow-lg transition-all ml-3';
        cancelBtn.textContent = 'Cancelar';
        cancelBtn.onclick = () => {
            resetForm(addForm);
            addForm.classList.add('hidden');
        };
        submitBtn.parentNode.appendChild(cancelBtn);
    }

    const titleInput = addForm.querySelector('[name="titulo"]');
    const valueInput = addForm.querySelector('[name="valor"]');
    const typeSelect = addForm.querySelector('[name="tipo"]');
    const orderInput = addForm.querySelector('[name="orden"]');

    titleInput.value = section.title;
    valueInput.value = section.value;
    typeSelect.value = section.type;
    if (orderInput) orderInput.value = section.orden || 99;

    // Handle Static Logic
    if (section.type === 'static') {
        valueInput.disabled = true;
        valueInput.classList.add('opacity-50', 'cursor-not-allowed');
        valueInput.title = "No se puede cambiar el valor de una sección estática";

        typeSelect.disabled = true;
        typeSelect.classList.add('opacity-50', 'cursor-not-allowed');

        // Add a hidden input to preserve values on submit since disabled inputs aren't sent?
        // Actually, if disabled, FormData won't include them.
        // We need to ensure we handle this in the submit handler.
    } else {
        valueInput.disabled = false;
        valueInput.classList.remove('opacity-50', 'cursor-not-allowed');
        valueInput.removeAttribute('title');

        typeSelect.disabled = false;
        typeSelect.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

function resetForm(addForm) {
    if (!addForm) return;
    addForm.reset();
    delete addForm.dataset.mode;
    delete addForm.dataset.editId;

    // Re-enable inputs
    const valueInput = addForm.querySelector('[name="valor"]');
    const typeSelect = addForm.querySelector('[name="tipo"]');
    if (valueInput) {
        valueInput.disabled = false;
        valueInput.classList.remove('opacity-50', 'cursor-not-allowed');
        valueInput.removeAttribute('title');
    }
    if (typeSelect) {
        typeSelect.disabled = false;
        typeSelect.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    addForm.querySelector('button[type="submit"]').textContent = 'Añadir';
    addForm.querySelector('h4').textContent = 'Añadir Nueva Categoría';
    const cancelBtn = addForm.querySelector('.btn-cancel-custom');
    if (cancelBtn) cancelBtn.remove();
}

function setupAddForm() {
    const btnToggle = document.getElementById('btn-toggle-add-cat');
    const addForm = document.getElementById('add-category-form');

    if (btnToggle) {
        // Clone to remove old listeners
        const newBtnToggle = btnToggle.cloneNode(true);
        btnToggle.parentNode.replaceChild(newBtnToggle, btnToggle);
        newBtnToggle.addEventListener('click', () => {
            console.log('Add Category Button Clicked');
            try {
                resetForm(addForm);
                addForm.classList.toggle('hidden');
                console.log('Form hidden class toggled. Now:', addForm.classList.contains('hidden'));

                if (!addForm.classList.contains('hidden')) {
                    addForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } catch (err) {
                console.error('Error in Add Category Click:', err);
            }
        });
    }

    if (addForm) {
        const newAddForm = addForm.cloneNode(true);
        addForm.parentNode.replaceChild(newAddForm, addForm);
        newAddForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const titleInput = newAddForm.querySelector('[name="titulo"]');
            const valueInput = newAddForm.querySelector('[name="valor"]');
            const typeSelect = newAddForm.querySelector('[name="tipo"]');
            const orderInput = newAddForm.querySelector('[name="orden"]');

            const data = {
                titulo: titleInput.value,
                valor: valueInput.value,
                tipo: typeSelect.value,
                orden: parseInt(orderInput.value) || 99
            };

            // Preserve active state if editing
            if (newAddForm.dataset.mode === 'edit') {
                const section = currentSections.find(s => s.id == newAddForm.dataset.editId);
                if (section) {
                    data.activo = section.activo;
                }
            }

            try {
                if (newAddForm.dataset.mode === 'edit') {
                    data.id = newAddForm.dataset.editId;
                    await updateHomeCategory(data);
                } else {
                    await addHomeCategory(data);
                }

                resetForm(newAddForm);
                newAddForm.classList.add('hidden');
                setupAdminLogic(); // Reload list
            } catch (err) {
                alert('Error al guardar: ' + err.message);
            }
        });
    }
}
