import {
    addHomeCategory,
    deleteHomeCategory,
    updateHomeCategory,
    toggleHomeVisibility,
    updateHomeConfigOrder
} from '../services/homeAdminService.js';

export async function toggleVisibility(id, newStatus, callbacks) {
    try {
        // We assume optimistic update was handled by caller or we wait for reload?
        // In original code: Optimistic update then Backend then Reload.
        // Let's keep it simple: Call backend then Reload. 
        // Or if we want optimistic, we need to touch state.
        // User said: "recibir dependencias... para actualizar el estado".

        // Let's do backend call then refresh
        await toggleHomeVisibility(id, newStatus);
        if (callbacks.onSuccess) callbacks.onSuccess();
    } catch (e) {
        console.error('Error changing visibility:', e);
        if (callbacks.onError) callbacks.onError(e);
    }
}

export async function deleteCategory(id, callbacks) {
    if (!confirm('¿Eliminar esta sección?')) return;
    try {
        await deleteHomeCategory(id);
        if (callbacks.onSuccess) callbacks.onSuccess();
    } catch (e) {
        alert('Error eliminando');
        if (callbacks.onError) callbacks.onError(e);
    }
}

export async function saveEdit(id, data, callbacks) {
    try {
        await updateHomeCategory(data);
        if (callbacks.onSuccess) callbacks.onSuccess();
    } catch (e) {
        alert('Error guardando: ' + e.message);
        if (callbacks.onError) callbacks.onError(e);
    }
}

export async function updateOrder(newOrder, callbacks) {
    try {
        await updateHomeConfigOrder(newOrder);
        if (callbacks.onSuccess) callbacks.onSuccess();
    } catch (e) {
        console.error('Order update failed', e);
        if (callbacks.onError) callbacks.onError(e);
    }
}

export async function handleAddCategory(data, callbacks) {
    try {
        await addHomeCategory(data);
        if (callbacks.onSuccess) callbacks.onSuccess();
    } catch (e) {
        alert('Error al añadir: ' + e.message);
        if (callbacks.onError) callbacks.onError(e);
    }
}
