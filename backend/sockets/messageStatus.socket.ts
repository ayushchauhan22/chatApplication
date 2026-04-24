import { Server, Socket } from 'socket.io';
import {
  updateMessageDelivered,
  updateMessageSeen,
} from '../services/messageService';

export const registerMessageStatusEvents = (io: Server, socket: Socket) => {
  socket.on('message_delivered', async (data) => {
    const { messageId, conversationId } = data;

    const updated = await updateMessageDelivered(messageId);
    if (!updated) return;

    io.to(conversationId).emit('message_status_updated', {
      messageId,
      conversationId,
      status: 'delivered',
      lastSeenMessageId: messageId,
    });
  });

  socket.on('message_seen', async (data) => {
    const { lastSeenMessageId, conversationId, userId } = data;

    const updated = await updateMessageSeen(lastSeenMessageId, conversationId,userId);
    if (!updated) return;

    io.to(conversationId).emit('message_status_updated', {
      conversationId: conversationId,
      status: 'seen',
      userId,
      lastSeenMessageId,
    });
  });
};
