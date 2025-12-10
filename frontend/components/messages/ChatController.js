import { authService } from '../../services/authService.js';
import { chatService } from '../../services/chatService.js';
import { renderConversationsList, renderMessagesList } from './ChatRenderer.js';

let activeConversationId = null;
let activeReceiverId = null;
let pollInterval = null;
let currentUser = null;

export async function initMessages() {
    currentUser = authService.getCurrentUser();
    if (!currentUser) return;

    // Expose for inline onclicks
    window.chatController = {
        selectConversation: selectConversation
    };

    await loadConversations();
    setupEvents();

    // Polling
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(() => {
        if (activeConversationId) loadMessages(activeConversationId, true);
        loadConversations(true);
        updateUnreadHeader();
    }, 5000);
}

function setupEvents() {
    const form = document.getElementById('msg-form');
    if (form) {
        form.onsubmit = handleSendMessage;
        const textarea = document.getElementById('msg-input');
        if (textarea) {
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    form.dispatchEvent(new Event('submit'));
                }
            });
        }
    }

    const backBtn = document.getElementById('msg-back-btn');
    if (backBtn) {
        backBtn.onclick = () => {
            document.getElementById('msg-sidebar').classList.remove('hidden');
            document.getElementById('msg-chat-area').classList.remove('flex', 'fixed', 'inset-0', 'z-50');
            document.getElementById('msg-chat-area').classList.add('hidden', 'md:flex');
            activeConversationId = null;
        };
    }
}

async function loadConversations(silent = false) {
    try {
        const conversations = await chatService.getConversations(currentUser.id_usuario);
        const container = document.getElementById('msg-conversation-list');
        if (container) {
            container.innerHTML = renderConversationsList(conversations, activeConversationId);
        }
    } catch (e) {
        if (!silent) console.error(e);
    }
}

async function selectConversation(convId, receiverId, name, photo) {
    activeConversationId = convId;
    activeReceiverId = receiverId;

    document.getElementById('msg-empty-state').classList.add('hidden');
    document.getElementById('msg-header').classList.remove('hidden');
    document.getElementById('msg-feed').classList.remove('hidden');
    document.getElementById('msg-form').classList.remove('hidden');

    document.getElementById('msg-header-name').textContent = name;
    document.getElementById('msg-header-avatar').src = photo;

    if (window.innerWidth < 768) {
        document.getElementById('msg-sidebar').classList.add('hidden');
        const chatArea = document.getElementById('msg-chat-area');
        chatArea.classList.remove('hidden');
        chatArea.classList.add('flex', 'fixed', 'inset-0', 'z-50');
    }

    await loadMessages(convId);
    await chatService.markAsRead(convId, currentUser.id_usuario);
    updateUnreadHeader();
    loadConversations(true);
}

async function loadMessages(convId, isPolling = false) {
    const container = document.getElementById('msg-feed');
    if (!container) return;

    const isScrolledToBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 50;

    try {
        const messages = await chatService.getMessages(convId, currentUser.id_usuario);
        const html = renderMessagesList(messages, currentUser.id_usuario);

        if (container.innerHTML !== html) {
            container.innerHTML = html;
            if (!isPolling || isScrolledToBottom) {
                container.scrollTop = container.scrollHeight;
            }
        }
    } catch (e) {
        console.error('Error loading messages', e);
    }
}

async function handleSendMessage(e) {
    e.preventDefault();
    const input = document.getElementById('msg-input');
    const content = input.value.trim();
    if (!content || !activeReceiverId) return;

    input.value = '';

    try {
        await chatService.sendMessage(currentUser.id_usuario, activeReceiverId, content);
        await loadMessages(activeConversationId);
        loadConversations(true);
    } catch (err) {
        console.error(err);
        alert('Error enviando mensaje');
    }
}

async function updateUnreadHeader() {
    const dot = document.getElementById('header-unread-dot');
    if (dot) {
        const count = await chatService.getUnreadCount(currentUser.id_usuario);
        if (count > 0) dot.classList.remove('hidden');
        else dot.classList.add('hidden');
    }
}
