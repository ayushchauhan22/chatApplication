import { Server, Socket } from 'socket.io';
import { createMessage } from '../services/messageService';
import logger from '../utils/logger';

export const registerChatEvents = (io: Server, socket: Socket) => {
  socket.on('join_conversation', (conversationId: string) => {
    socket.join(conversationId);
    logger.info(`Socket ${socket.id} joined ${conversationId}`);
  });

  socket.on('leave_conversation', (conversationId: string) => {
    socket.leave(conversationId);
    logger.info(`Socket ${socket.id} left ${conversationId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const { conversationId, text, senderId } = data;

      const message = await createMessage(conversationId, text, senderId);

      io.to(conversationId).emit('receive_message', message);
    } catch (error) {
      logger.error('Error sending message:', error);
    }
  });
};
