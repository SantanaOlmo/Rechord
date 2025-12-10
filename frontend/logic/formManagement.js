export function setupAddForm(callbacks) {
    const btnToggle = document.getElementById('btn-toggle-add-cat');
    const addForm = document.getElementById('add-category-form');

    if (btnToggle) {
        const newBtnToggle = btnToggle.cloneNode(true);
        btnToggle.parentNode.replaceChild(newBtnToggle, btnToggle);
        newBtnToggle.addEventListener('click', () => {
            resetForm(addForm);
            addForm.classList.toggle('hidden');
            if (!addForm.classList.contains('hidden')) {
                addForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

            const isEdit = newAddForm.dataset.mode === 'edit';
            if (isEdit) {
                // Pass extra ID if editing
                await callbacks.onSubmit(data, newAddForm.dataset.editId);
            } else {
                await callbacks.onSubmit(data, null);
            }

            resetForm(newAddForm);
            newAddForm.classList.add('hidden');
        });
    }
}

export function resetForm(addForm) {
    if (!addForm) return;
    addForm.reset();
    delete addForm.dataset.mode;
    delete addForm.dataset.editId;

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

    const submitBtn = addForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Añadir';

    const header = addForm.querySelector('h4');
    if (header) header.textContent = 'Añadir Nueva Categoría';

    const cancelBtn = addForm.querySelector('.btn-cancel-custom');
    if (cancelBtn) cancelBtn.remove();
}
