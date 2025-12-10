export function setupActionButtons(container, actions) {
    // Edit buttons (Start Edit)
    container.querySelectorAll('.btn-edit-category').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            actions.setEditingId(id);
        });
    });

    // Cancel Edit
    container.querySelectorAll('.btn-cancel-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            actions.setEditingId(null);
        });
    });

    // Save Edit
    container.querySelectorAll('.btn-save-edit').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            // Get values from inputs in the row
            const title = document.getElementById(`edit-title-${id}`).value;
            const value = document.getElementById(`edit-value-${id}`).value;
            const type = document.getElementById(`edit-type-${id}`).value;

            await actions.saveEdit(id, { title, value, type });
        });
    });

    // Toggle Visibility
    container.querySelectorAll('.btn-toggle-visibility').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnEl = e.currentTarget.closest('button');
            const id = btnEl.dataset.id;
            const currentActive = btnEl.dataset.active == 1; // "1" or "0" string
            actions.toggleVisibility(id, !currentActive);
        });
    });

    // Delete
    container.querySelectorAll('.btn-delete-category').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.closest('button').dataset.id;
            actions.deleteCategory(id);
        });
    });
}

export function setupDragEvents(container, actions) {
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

            await actions.updateOrder(newOrder);
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
