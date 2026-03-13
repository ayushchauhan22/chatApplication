import { Server, Socket } from 'socket.io';
import {
  updateMessageDelivered,
  updateMessageSeen,
} from '../services/messageService';

export const registerMessageStatusEvents = (io: Server, socket: Socket) => {
  socket.on('message_delivered', async (data) => {
    const { messageId, conversationId } = data;

    await updateMessageDelivered(messageId);

    io.to(conversationId).emit('message_delivered', {
      messageId,
      userSocketId: socket.id,
    });
  });

  socket.on('message_seen', async (data) => {
    const { messageId, conversationId } = data;

    await updateMessageSeen(messageId);

    io.to(conversationId).emit('message_seen', {
      messageId,
      userSocketId: socket.id,
    });
  });
};
