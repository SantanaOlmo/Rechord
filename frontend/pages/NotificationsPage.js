import { notificationService } from '../services/notificationService.js';
import { authService } from '../services/authService.js';

export function NotificationsPage() {
    setTimeout(loadNotifications, 0);

    return `
        <div class="container mx-auto px-4 py-8 max-w-4xl">
            <h1 class="text-3xl font-bold mb-6 text-white text-center md:text-left">Notificaciones</h1>
            
            <div id="notifications-list" class="space-y-4">
                 <div class="p-8 text-center text-gray-500">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-2"></div>
                    Cargando...
                </div>
            </div>
        </div>
    `;
}

async function loadNotifications() {
    const list = document.getElementById('notifications-list');
    if (!list) return;

    const user = authService.getCurrentUser();
    if (!user) {
        list.innerHTML = `<p class="text-center text-gray-400">Inicia sesión para ver tus notificaciones.</p>`;
        return;
    }

    try {
        const notifs = await notificationService.getMyNotifications(user.id_usuario);

        if (notifs.length === 0) {
            list.innerHTML = `<p class="text-center text-gray-400 p-8 bg-gray-900 rounded-xl">No tienes notificaciones recibidas.</p>`;
            return;
        }

        list.innerHTML = notifs.map(n => `
            <div class="p-4 bg-gray-900 rounded-lg border-l-4 ${n.leido ? 'border-gray-700 opacity-70' : 'border-indigo-500'} shadow-md transition hover:bg-gray-800">
                <div class="flex justify-between items-start">
                    <p class="text-white text-md ${n.leido ? 'text-gray-400' : 'font-semibold'}">${n.mensaje}</p>
                    <span class="text-xs text-gray-500 whitespace-nowrap ml-4">${new Date(n.fecha_creacion).toLocaleString()}</span>
                </div>
                ${!n.leido ? `
                <div class="mt-2 text-right">
                    <button onclick="window.markRead(${n.id_notificacion})" class="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                        Marcar como leída
                    </button>
                </div>` : ''}
            </div>
        `).join('');

        window.markRead = async (id) => {
            try {
                await notificationService.markAsRead(id, user.id_usuario);
                loadNotifications(); // Reload
            } catch (e) {
                console.error(e);
            }
        };

    } catch (error) {
        list.innerHTML = `<p class="text-center text-red-400">Error: ${error.message}</p>`;
    }
}
