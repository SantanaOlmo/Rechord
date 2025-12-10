import { CONTENT_BASE_URL } from '../../config.js';

export function renderConversationsList(conversations, activeId) {
    // Separate "Rechord" (Admin/System) from others
    const sorted = [...conversations].sort((a, b) => {
        const isRechordA = a.other_role === 'admin';
        const isRechordB = b.other_role === 'admin';
        if (isRechordA && !isRechordB) return -1;
        if (!isRechordA && isRechordB) return 1;
        return new Date(b.fecha_ultima_actividad) - new Date(a.fecha_ultima_actividad);
    });

    return sorted.map(c => {
        const isRechord = c.other_role === 'admin';
        const name = isRechord ? 'Rechord' : c.other_name;
        const photo = isRechord ? 'assets/icons/rechord_logo.png' : (c.other_photo ? `${CONTENT_BASE_URL}/${c.other_photo}` : 'assets/icons/profile.svg');
        const isActive = activeId == c.id_conversacion;
        const unreadClass = c.unread_count > 0 ? 'bg-indigo-900/20' : '';
        const activeClass = isActive ? 'bg-indigo-600/20 border-l-4 border-indigo-500' : 'hover:bg-gray-900 border-l-4 border-transparent';

        return `
            <div onclick="window.chatController.selectConversation(${c.id_conversacion}, ${c.other_id}, '${name}', '${photo}')" 
                class="flex items-center p-3 rounded-lg cursor-pointer transition-all ${activeClass} ${unreadClass}">
                <div class="relative">
                    <img src="${photo}" class="w-12 h-12 rounded-full object-cover bg-gray-800 ${isRechord ? 'p-1' : ''}">
                </div>
                <div class="ml-3 flex-1 overflow-hidden">
                    <div class="flex justify-between items-baseline">
                        <h4 class="text-white font-medium truncate ${unreadClass ? 'font-bold' : ''}">${name} ${isRechord ? '<span class="text-[10px] bg-indigo-500 px-1 rounded ml-1">OFFICIAL</span>' : ''}</h4>
                        <span class="text-xs text-gray-500">${formatTime(c.last_message_time)}</span>
                    </div>
                    <p class="text-sm text-gray-400 truncate ${c.unread_count > 0 ? 'text-white font-medium' : ''}">
                        ${c.last_message || '<i class="text-gray-600">Sin mensajes</i>'}
                    </p>
                </div>
                ${c.unread_count > 0 ? `<div class="ml-2 w-2 h-2 bg-indigo-500 rounded-full"></div>` : ''}
            </div>
        `;
    }).join('');
}

export function renderMessagesList(messages, currentUserId) {
    return messages.map(m => {
        const isMe = m.id_usuario_emisor == currentUserId;
        return `
            <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
                <div class="max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none'}">
                    <p>${escapeHtml(m.contenido)}</p>
                    <div class="text-[10px] opacity-50 mt-1 text-right">${formatTime(m.fecha_envio)}</div>
                </div>
            </div>
        `;
    }).join('');
}

function formatTime(sqlDate) {
    if (!sqlDate) return '';
    const date = new Date(sqlDate);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    return isToday
        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
}
