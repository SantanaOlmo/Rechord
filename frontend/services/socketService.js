import { WS_URL } from '../config.js';
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
}

export const socketService = new SocketService();
