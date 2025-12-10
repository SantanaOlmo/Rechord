import { getAdminHomeData } from '../services/homeAdminService.js';
import { renderList } from './uiRenderer.js';
import { toggleVisibility, deleteCategory, saveEdit, updateOrder, handleAddCategory } from './configActions.js';
import { setupAddForm } from './formManagement.js';

let currentSections = [];
let editingId = null;

export function setupAdminLogic() {
    const adminConfigContainer = document.getElementById('admin-home-config');
    if (!adminConfigContainer) return;

    loadConfig();

    // Define Callbacks for Form
    setupAddForm({
        onSubmit: async (data, editId) => {
            if (editId) {
                // Determine active state from currentSections
                const section = currentSections.find(s => s.id == editId);
                data.activo = section ? section.activo : 1;
                data.id = editId;
                await saveEdit(editId, data, { onSuccess: loadConfig });
            } else {
                await handleAddCategory(data, { onSuccess: loadConfig });
            }
        }
    });

    // We can also attach the editCategory functionality used by the "Add" form (when used for editing in modal? wait)
    // The previous logic was: clicking "Edit" in the row --> Re-renders the row as inline edit.
    // BUT there was also `editCategory` function in the original file that populated the "Add" form?????
    // Let's check original adminHomeLogic.js:88 `renderEditRow`.
    // And `adminHomeLogic.js:264` `editCategory`.
    // `renderEditRow` (inline) was used when `s.id == editingId`.
    // Did checking `setupActionButtons` in original:
    // It set `editingId`. So it used inline editing.
    // What was `editCategory` (line 264) used for? 
    // It seems unused by the inline buttons?
    // Wait, let's check `adminHomeLogic.js` Step 221 content.
    // `startEdit` button called `editingId = ... renderList`.
    // `editCategory` was NOT called by `setupActionButtons`. 
    // It seems `editCategory` (filling the Add form) was DEAD CODE or Alternative approach.
    // The user instruction "frontend/logic/uiRenderer.js... Contendrá la función renderEditRow(s)" implies we stick to INLINE editing.
    // So I will ignore `editCategory` unless the user specifically asked for it in `formManagement.js`. 
    // User asked "formManagement.js... Gestionará la lógica de alternar el formulario de adición".
    // Does not mention editing via form.
    // So I will assume Inline Editing is the way.
}

async function loadConfig() {
    const adminConfigContainer = document.getElementById('admin-home-config');
    if (!adminConfigContainer) return;

    try {
        const rawData = await getAdminHomeData();
        currentSections = rawData.map(item => ({
            id: item.id_config || item.id,
            title: item.titulo_mostrar || item.title,
            value: item.valor || item.value,
            type: item.tipo || item.type,
            orden: item.orden,
            activo: item.activo
        }));

        refreshUI();
    } catch (e) {
        console.error('Admin Home Config: Error', e);
        adminConfigContainer.innerHTML = '<p class="text-red-500">Error cargando config.</p>';
    }
}

function refreshUI() {
    const adminConfigContainer = document.getElementById('admin-home-config');

    // Bundle Actions with State Context
    const actions = {
        setEditingId: (id) => {
            editingId = id;
            refreshUI();
        },
        saveEdit: async (id, data) => {
            // Need to preserve state (active, order)
            const section = currentSections.find(s => s.id == id);
            if (section) {
                // Merge data
                const payload = {
                    id: id,
                    titulo: data.title,
                    valor: data.value,
                    tipo: data.type,
                    orden: section.orden,
                    activo: section.activo
                };
                await saveEdit(id, payload, {
                    onSuccess: () => {
                        editingId = null;
                        loadConfig();
                    }
                });
            }
        },
        deleteCategory: async (id) => {
            await deleteCategory(id, { onSuccess: loadConfig });
        },
        toggleVisibility: async (id, newStatus) => {
            // Optimistic update locally
            const section = currentSections.find(s => s.id == id);
            if (section) section.activo = newStatus ? 1 : 0;
            refreshUI();

            await toggleVisibility(id, newStatus, { onSuccess: loadConfig, onError: loadConfig });
        },
        updateOrder: async (newOrder) => {
            await updateOrder(newOrder, {
                onSuccess: () => {
                    // Silent success or reload?
                    // Reload guarantees sync
                    loadConfig();
                }
            });
        }
    };

    renderList(adminConfigContainer, currentSections, editingId, actions);
}
