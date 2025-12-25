import { API_ROUTES } from '../api/routes.js';

export const notificationService = {
    async getMyNotifications(userId) {
        const response = await fetch(`${API_ROUTES.NOTIFICATIONS}?user_id=${userId}`);
        if (!response.ok) throw new Error('Error al cargar notificaciones');
        const data = await response.json();
        return data.notifications || [];
    },

    async sendNotification(userId, message) {
        const response = await fetch(API_ROUTES.NOTIFICATIONS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: userId, mensaje: message })
        });
        if (!response.ok) throw new Error('Error al enviar notificación');
        return await response.json();
    },

    async markAsRead(notificationId, userId) {
        const response = await fetch(API_ROUTES.NOTIFICATIONS, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_notificacion: notificationId, id_usuario: userId })
        });
        if (!response.ok) throw new Error('Error al marcar como leída');
        return await response.json();
    }
};
