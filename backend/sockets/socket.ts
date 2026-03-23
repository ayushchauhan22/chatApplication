import { Server } from 'socket.io';
import { registerConnectionEvents } from './connection.socket';
import { registerChatEvents } from './chat.socket';
import { registerMessageStatusEvents } from './messageStatus.socket';
import logger from '../utils/logger';

export default function setupSocket(io: Server) {
  io.on('connection', (socket) => {
    // logger.info('User connected:', socket.id);

    registerConnectionEvents(io, socket);
    registerChatEvents(io, socket);
    registerMessageStatusEvents(io, socket);
  });
}
