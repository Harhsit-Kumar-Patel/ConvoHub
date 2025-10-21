import { io } from 'socket.io-client';
import { getToken } from './auth.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000/chat';

let socket;

export function getSocket() {
  if (!socket) {
    const token = getToken();
    socket = io(SOCKET_URL, { 
      transports: ['websocket'],
      auth: { token } // Send token for authentication
    });
    
    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
