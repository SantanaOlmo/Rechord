import { WS_URL } from '../config.js';
import { Store, EVENTS } from '../core/StateStore.js';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.reconnectInterval = 3000;
        this.userId = null;
    }

    /**
     * Inicia la conexión WebSocket
     * @param {number} userId 
     */
    connect(userId) {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            console.log('Socket already connected or connecting');
            return;
        }

        this.userId = userId;
        console.log(`Connecting to WebSocket at ${WS_URL}...`);

        this.socket = new WebSocket(WS_URL);

        this.socket.onopen = () => {
            console.log('✅ WebSocket Connected');
            this.isConnected = true;
            Store.publish(EVENTS.SOCKET.CONNECTED, { userId });

            // Register user logic here if needed, or send initial ping
        };

        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.handleMessage(message);
            } catch (e) {
                console.error('Error parsing WS message:', e);
            }
        };

        this.socket.onclose = () => {
            console.log('🔴 WebSocket Disconnected');
            this.isConnected = false;
            Store.publish(EVENTS.SOCKET.DISCONNECTED);
            this.retryConnection();
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
            this.socket.close();
        };
    }

    retryConnection() {
        if (!this.userId) return;
        setTimeout(() => {
            console.log('Retrying WebSocket connection...');
            this.connect(this.userId);
        }, this.reconnectInterval);
    }

    /**
     * Envía un mensaje al servidor
     * @param {string} action 
     * @param {object} payload 
     */
    send(action, payload = {}) {
        if (!this.isConnected) {
            console.warn('Cannot send message, socket not connected');
            return;
        }

        const message = JSON.stringify({
            action,
            payload: {
                ...payload,
                userId: this.userId
            }
        });

        this.socket.send(message);
    }

    /**
     * Despacha mensajes entrantes a Store
     */
    handleMessage(data) {
        console.log('📩 WS Message:', data);

        if (data.action === 'PLAYBACK_UPDATED') {
            Store.publish(EVENTS.SOCKET.SYNC_STATE, data.payload);
        } else if (data.action === 'ROOM_JOINED') {
            // Update room state if needed, or component handles callback
        }

        // General publishing of any socket action could be useful
        // Store.publish(`SOCKET:${data.action}`, data.payload);
    }
}

export const socketService = new SocketService();
