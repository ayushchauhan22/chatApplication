import { Server, Socket } from 'socket.io';
import {
  createMessage,
  updateMessageDelivered,
} from '../services/messageService';
import logger from '../utils/logger';
import { onlineUsers } from './connection.socket';
import Conversation from '../modelsDB/conversation';

export const registerChatEvents = (io: Server, socket: Socket) => {
  socket.on('join_conversation', (conversationId: string) => {
    socket.join(conversationId);
    logger.info(`Socket ${socket.id} joined ${conversationId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const {
        conversationId,
        content,
        senderId,
        fileUrl,
        uploadId,
        filename,
        clientTempId,
      } = data;

      if (!conversationId || !senderId) return;
      if (!content && !fileUrl) return;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;

      const message = await createMessage(
        conversationId,
        content,
        senderId,
        fileUrl,
        uploadId,
        filename,
      );

      const receivers = conversation.participants
        .map((p: any) => p.toString())
        .filter((id: string) => id !== senderId);

      const anyReceiverOnline = receivers.some((id: string) =>
        onlineUsers.has(id),
      );

      
      

      // mark as delivered and notify sender
      if (anyReceiverOnline) {
        await updateMessageDelivered(message._id.toString());
        if (message.messageStatus) {
          message.messageStatus.status = 'delivered';
          message.messageStatus.deliveredAt = new Date();
        }
      }

      const payload = {
        ...message,
        clientTempId: clientTempId ?? null,
      };

      socket.emit('message_sent_ack', payload);
      io.to(conversationId).emit('receive_message', payload);
    } catch (error) {
      logger.error('Error sending message:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });
};
