/**
 * Drag and Drop Utilities
 */
export const DragDropUtils = {
    /**
     * Determine the element after the cursor position y
     */
    getDragAfterElement(container, y, draggableSelector = '.draggable-item') {
        const draggableElements = [...container.querySelectorAll(`${draggableSelector}:not(.opacity-50)`)];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    },

    /**
     * Setup generic drag events for list reordering
     */
    setupListDrag(container, handlers = {}) {
        const { onDragEnd } = handlers;

        container.addEventListener('dragstart', e => {
            if (e.target.classList.contains('draggable-item')) {
                e.target.classList.add('opacity-50');
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        container.addEventListener('dragend', e => {
            if (e.target.classList.contains('draggable-item')) {
                e.target.classList.remove('opacity-50');
                if (onDragEnd) onDragEnd();
            }
        });

        container.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(container, e.clientY);
            const draggable = container.querySelector('.opacity-50');
            if (!draggable) return;
            if (afterElement == null) {
                container.appendChild(draggable);
            } else {
                container.insertBefore(draggable, afterElement);
            }
        });
    }
};
