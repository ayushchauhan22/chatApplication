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
      status: 'delivered',
    });
  });

  socket.on('message_seen', async (data) => {
    const { messageId, conversationId, userId } = data; // ← userId needed for seenBy

    const updated = await updateMessageSeen(messageId, userId);
    if (!updated) return;

    io.to(conversationId).emit('message_status_updated', {
      messageId,
      status: 'seen',
      seenBy: updated.seenBy, // ← send full seenBy array to frontend
    });
  });
};
