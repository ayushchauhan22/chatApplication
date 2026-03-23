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
      
      const { conversationId, content, senderId, fileUrl, uploadId, filename } =
        data;

      if (!conversationId || !senderId) return;
      if (!content && !fileUrl) return;

      const message = await createMessage(
        conversationId,
        content,
        senderId,
        fileUrl,
        uploadId,
        filename,
      );

      io.to(conversationId).emit('receive_message', message);

      // check if any receiver is online
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;

      const receivers = conversation.participants
        .map((p: any) => p.toString())
        .filter((id: string) => id !== senderId);

      const anyReceiverOnline = receivers.some((id: string) =>
        onlineUsers.has(id),
      );

      // only mark delivered if at least one receiver is online
      if (anyReceiverOnline) {
        await updateMessageDelivered(message._id.toString());

        socket.emit('message_status_updated', {
          messageId: message._id,
          status: 'delivered',
        });
      }
    } catch (error) {
      logger.error('Error sending message:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });
};
