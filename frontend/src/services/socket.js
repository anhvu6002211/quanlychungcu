import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

class SocketService {
    socket = null;

    connect() {
        this.socket = io(SOCKET_URL);

        this.socket.on('connect', () => {
            console.log('🔌 Connected to websocket');
        });

        return this.socket;
    }

    on(event, callback) {
        if (!this.socket) this.connect();
        this.socket.on(event, callback);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export default new SocketService();
