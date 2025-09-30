import { io } from 'socket.io-client';
import { getUser } from './auth.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000/chat';

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, { transports: ['websocket'] });
    const user = getUser();
    if (user?._id || user?.id) {
      socket.emit('identify', user._id || user.id);
    }
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
