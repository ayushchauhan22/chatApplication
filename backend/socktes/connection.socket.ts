import { Server, Socket } from 'socket.io';
import logger from '../utils/logger';

// use map for handling onliene users
const onlineUsers = new Map<string, string>();

export const registerConnectionEvents = (io: Server, socket: Socket) => {
  socket.on('connection', async (userId: string) => {
    socket.data.userId = userId;
    onlineUsers.set(userId, socket.id);
    
    logger.info(`User ${userId} connected`);
  });

  socket.on('disconnect', async () => {
    if (socket.data.userId) {
      onlineUsers.delete(socket.data.userId);
      logger.info(`User ${socket.data.userId} disconnected`);
    }
  });
};
