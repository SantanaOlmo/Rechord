import { WS_URL } from '../config.js';
import { Store, EVENTS } from '../core/StateStore.js';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.userId = null;

        // Reconnection Logic
        this.reconnectAttempts = 0;
        this.maxRetries = 5;
        this.baseReconnectDelay = 1000; // 1 second
        this.reconnectTimer = null;
    }

    /**
     * Connects to the WebSocket Server
     * @param {number} userId 
     */
    connect(userId) {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        this.userId = userId;
        console.log(`🔌 Attempting to connect to WS... (Attempt ${this.reconnectAttempts + 1}/${this.maxRetries})`);

        try {
            this.socket = new WebSocket(WS_URL);

            this.socket.onopen = () => {
                console.log('✅ WebSocket Connected');
                this.isConnected = true;
                this.reconnectAttempts = 0; // Reset counters
                Store.publish(EVENTS.SOCKET.CONNECTED, { userId });
            };

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (e) {
                    console.error('Error parsing WS message:', e);
                }
            };

            this.socket.onclose = (event) => {
                console.log('⚠️ WebSocket Disconnected', event.reason);
                this.isConnected = false;
                this.socket = null;

                if (event.wasClean) {
                    Store.publish(EVENTS.SOCKET.DISCONNECTED, { reason: 'Closed cleanly' });
                } else {
                    this.scheduleReconnect();
                }
            };

            this.socket.onerror = (error) => {
                console.error('❌ WebSocket Error:', error);
                // onError usually precedes onclose
            };

        } catch (e) {
            console.error('Connection setup error:', e);
            this.scheduleReconnect();
        }
    }

    scheduleReconnect() {
        if (this.reconnectAttempts < this.maxRetries) {
            const delay = this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts);
            console.log(`⏱️ Reconnecting in ${delay}ms...`);

            this.reconnectTimer = setTimeout(() => {
                this.reconnectAttempts++;
                this.connect(this.userId);
            }, delay);
        } else {
            console.error('🚫 Max reconnect attempts reached. Giving up.');
            Store.publish(EVENTS.SOCKET.DISCONNECTED, { reason: 'Max retries reached' });
        }
    }

    /**
     * Sends a message to the server
     * @param {string} action 
     * @param {object} payload 
     */
    send(action, payload = {}) {
        if (!this.isConnected) {
            console.warn('Cannot send message, socket not connected');
            return;
        }
        try {
            const message = JSON.stringify({
                action,
                payload: { ...payload, userId: this.userId }
            });
            this.socket.send(message);
        } catch (e) {
            console.error('Error sending message:', e);
        }
    }

    /**
     * Handles incoming messages
     * @param {object} data 
     */
    handleMessage(data) {
        // console.log('📩 WS Message:', data);

        if (data.action === 'PLAYBACK_UPDATED') {
            Store.publish(EVENTS.SOCKET.SYNC_STATE, data.payload);
        }
        else if (data.action === 'ROOM_CREATED' || data.action === 'ROOM_JOINED') {
            Store.setState('room', {
                id: data.payload.roomId,
                isMaster: (data.action === 'ROOM_CREATED'), // Or logic from server
                members: [] // Ideally server sends members list
            });
            // Also notify UI
            Store.publish(EVENTS.SOCKET.MEMBER_UPDATE, { roomId: data.payload.roomId });
        }
        else if (data.status === 'error') {
            console.error('WS Error Response:', data.message);
            // Optionally publish error event
        }
    }
}

export const socketService = new SocketService();
