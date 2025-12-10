
import { authService } from '../services/authService.js';
import { chatService } from '../services/chatService.js';
import { CONTENT_BASE_URL } from '../config.js';

export function Messages() {
    setTimeout(initMessages, 0);

    return `
        <div class="h-full flex flex-col md:flex-row bg-black overflow-hidden relative">
            <!-- Sidebar -->
            <div class="w-full md:w-80 lg:w-96 border-r border-gray-800 flex flex-col h-full bg-gray-950/80 backdrop-blur-xl z-20 ${window.innerWidth < 768 ? '' : ''}" id="msg-sidebar">
                <div class="p-4 border-b border-gray-800 flex justify-between items-center">
                    <h2 class="text-xl font-bold text-white">Mensajes</h2>
                </div>
                
                <div class="overflow-y-auto flex-1 scrollbar-hide p-2 space-y-2" id="msg-conversation-list">
                    <!-- Loading skeleton -->
                    <div class="animate-pulse space-y-3">
                        ${[1, 2, 3].map(() => `
                            <div class="h-16 bg-gray-900 rounded-lg"></div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Chat Area -->
            <div class="flex-1 flex flex-col h-full bg-black relative" id="msg-chat-area">
                <div class="flex-1 flex flex-col justify-center items-center text-gray-500 space-y-4" id="msg-empty-state">
                    <div class="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    </div>
                    <p class="text-lg">Selecciona una conversación para empezar</p>
                </div>
                
                <!-- Active Chat Header -->
                <div id="msg-header" class="hidden h-16 border-b border-gray-800 flex items-center px-6 bg-gray-950 sticky top-0 z-10">
                    <button class="md:hidden mr-4 text-gray-400" id="msg-back-btn">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <img id="msg-header-avatar" src="" class="w-10 h-10 rounded-full object-cover mr-4 bg-gray-800">
                    <div>
                        <h3 id="msg-header-name" class="text-white font-bold"></h3>
                        <span id="msg-header-status" class="text-xs text-gray-500"></span>
                    </div>
                </div>

                <!-- Messages Feed -->
                <div id="msg-feed" class="hidden flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide"></div>

                <!-- Input Area -->
                <form id="msg-form" class="hidden p-4 bg-gray-950 border-t border-gray-800">
                    <div class="flex items-end gap-3 max-w-4xl mx-auto rounded-xl bg-gray-900 p-2">
                        <textarea id="msg-input" 
                            class="flex-1 bg-transparent text-white p-2 max-h-32 min-h-[44px] focus:outline-none resize-none scrollbar-hide text-sm"
                            placeholder="Escribe un mensaje..." rows="1"></textarea>
                        <button type="submit" 
                            class="p-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/30 flex-shrink-0">
                            <svg class="w-5 h-5 ml-0.5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

let activeConversationId = null;
let activeReceiverId = null;
let pollInterval = null;
let currentUser = null;

async function initMessages() {
    currentUser = authService.getCurrentUser();
    if (!currentUser) return;

    await loadConversations();

    // Setup generic events
    const form = document.getElementById('msg-form');
    form.onsubmit = handleSendMessage;

    const textarea = document.getElementById('msg-input');
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    });

    const backBtn = document.getElementById('msg-back-btn');
    backBtn.onclick = () => {
        document.getElementById('msg-sidebar').classList.remove('hidden');
        document.getElementById('msg-chat-area').classList.remove('flex', 'fixed', 'inset-0', 'z-50');
        document.getElementById('msg-chat-area').classList.add('hidden', 'md:flex');
        activeConversationId = null;
    };

    // Polling for new messages
    stopPolling();
    pollInterval = setInterval(() => {
        if (activeConversationId) loadMessages(activeConversationId, true);
        loadConversations(true); // silent update
        updateUnreadHeader(); // Global header update
    }, 5000);
}

function stopPolling() {
    if (pollInterval) clearInterval(pollInterval);
}

async function loadConversations(silent = false) {
    try {
        const conversations = await chatService.getConversations(currentUser.id_usuario);
        renderConversations(conversations);
    } catch (e) {
        if (!silent) console.error(e);
    }
}

function renderConversations(conversations) {
    const container = document.getElementById('msg-conversation-list');
    if (!container) return; // Unmounted

    // Separate "Rechord" (Admin/System) from others
    // Logic: Identify admin role or hardcoded 'Rechord' name
    // Assuming backend returns role

    // Sort: Rechord first, then by date
    const sorted = [...conversations].sort((a, b) => {
        const isRechordA = a.other_role === 'admin';
        const isRechordB = b.other_role === 'admin';
        if (isRechordA && !isRechordB) return -1;
        if (!isRechordA && isRechordB) return 1;
        return new Date(b.fecha_ultima_actividad) - new Date(a.fecha_ultima_actividad);
    });

    container.innerHTML = sorted.map(c => {
        const isRechord = c.other_role === 'admin';
        const name = isRechord ? 'Rechord' : c.other_name;
        const photo = isRechord ? 'assets/icons/rechord_logo.png' : (c.other_photo ? `${CONTENT_BASE_URL}/${c.other_photo}` : 'assets/icons/profile.svg'); // Need actual logo path, using placeholder for now
        const isActive = activeConversationId == c.id_conversacion;
        const unreadClass = c.unread_count > 0 ? 'bg-indigo-900/20' : '';
        const activeClass = isActive ? 'bg-indigo-600/20 border-l-4 border-indigo-500' : 'hover:bg-gray-900 border-l-4 border-transparent';

        return `
            <div onclick="window.selectConversation(${c.id_conversacion}, ${c.other_id}, '${name}', '${photo}')" 
                class="flex items-center p-3 rounded-lg cursor-pointer transition-all ${activeClass} ${unreadClass}">
                <div class="relative">
                    <img src="${photo}" class="w-12 h-12 rounded-full object-cover bg-gray-800 ${isRechord ? 'p-1' : ''}">
                    <!-- Online indicator could go here -->
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

window.selectConversation = async (convId, receiverId, name, photo) => {
    activeConversationId = convId;
    activeReceiverId = receiverId;

    // UI Update
    document.getElementById('msg-empty-state').classList.add('hidden');
    document.getElementById('msg-header').classList.remove('hidden');
    document.getElementById('msg-feed').classList.remove('hidden');
    document.getElementById('msg-form').classList.remove('hidden');

    // Header
    document.getElementById('msg-header-name').textContent = name;
    document.getElementById('msg-header-avatar').src = photo;

    // Mobile View Toggle
    if (window.innerWidth < 768) {
        document.getElementById('msg-sidebar').classList.add('hidden');
        const chatArea = document.getElementById('msg-chat-area');
        chatArea.classList.remove('hidden');
        chatArea.classList.add('flex', 'fixed', 'inset-0', 'z-50');
    }

    // Load Messages
    await loadMessages(convId);

    // Mark read
    await chatService.markAsRead(convId, currentUser.id_usuario);
    updateUnreadHeader();
    loadConversations(true); // Update unread dot in list
};

async function loadMessages(convId, isPolling = false) {
    const container = document.getElementById('msg-feed');
    if (!container) return; // Exit if view not active

    const previousScrollHeight = container.scrollHeight;
    const isScrolledToBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 50;

    const messages = await chatService.getMessages(convId, currentUser.id_usuario);

    const html = messages.map(m => {
        const isMe = m.id_usuario_emisor == currentUser.id_usuario;
        return `
            <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
                <div class="max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none'}">
                    <p>${escapeHtml(m.contenido)}</p>
                    <div class="text-[10px] opacity-50 mt-1 text-right">${formatTime(m.fecha_envio)}</div>
                </div>
            </div>
        `;
    }).join('');

    if (container.innerHTML !== html) {
        container.innerHTML = html;
        if (!isPolling || isScrolledToBottom) {
            container.scrollTop = container.scrollHeight;
        }
    }
}

async function handleSendMessage(e) {
    e.preventDefault();
    const input = document.getElementById('msg-input');
    const content = input.value.trim();
    if (!content || !activeReceiverId) return;

    input.value = ''; // clear immediately

    try {
        await chatService.sendMessage(currentUser.id_usuario, activeReceiverId, content);
        await loadMessages(activeConversationId); // refresh
        loadConversations(true); // move thread to top
    } catch (err) {
        console.error(err);
        alert('Error enviando mensaje');
    }
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

async function updateUnreadHeader() {
    // Helper to update the dot in the main Header without reloading page
    const dot = document.getElementById('header-unread-dot');
    if (dot) {
        const count = await chatService.getUnreadCount(currentUser.id_usuario);
        if (count > 0) {
            dot.classList.remove('hidden');
        } else {
            dot.classList.add('hidden');
        }
    }
}
