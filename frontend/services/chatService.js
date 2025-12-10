import { API_BASE_URL } from '../config.js';

export const chatService = {

    async getConversations(userId) {
        if (!userId) {
            console.error("ChatService: No userId provided for getConversations");
            return [];
        }
        try {
            const response = await fetch(`${API_BASE_URL}/chat.php?action=conversations&user_id=${userId}`);
            const data = await response.json();
            if (response.ok) {
                return data.conversations || [];
            }
            throw new Error(data.message || 'Error fetching conversations');
        } catch (error) {
            console.error('ChatService Error:', error);
            throw error;
        }
    },

    async getMessages(conversationId, userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/chat.php?action=messages&conversation_id=${conversationId}&user_id=${userId}`);
            const data = await response.json();
            if (response.ok) {
                return data.messages || [];
            }
            throw new Error(data.message || 'Error fetching messages');
        } catch (error) {
            console.error('ChatService Error:', error);
            throw error;
        }
    },

    async sendMessage(senderId, receiverId, content) {
        try {
            const response = await fetch(`${API_BASE_URL}/chat.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'send',
                    sender_id: senderId,
                    receiver_id: receiverId,
                    content: content
                })
            });
            const data = await response.json();
            if (response.ok) {
                return data;
            }
            throw new Error(data.message || 'Error sending message');
        } catch (error) {
            console.error('ChatService Error:', error);
            throw error;
        }
    },

    async markAsRead(conversationId, userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/chat.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'mark_read',
                    conversation_id: conversationId,
                    user_id: userId
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('ChatService Error:', error);
        }
    },

    async getUnreadCount(userId) {
        if (!userId) return 0;
        try {
            const response = await fetch(`${API_BASE_URL}/chat.php?action=unread_count&user_id=${userId}`);
            const data = await response.json();
            if (response.ok) {
                return parseInt(data.count) || 0;
            }
            return 0;
        } catch (error) {
            console.error('ChatService Error:', error);
            return 0;
        }
    }
};
