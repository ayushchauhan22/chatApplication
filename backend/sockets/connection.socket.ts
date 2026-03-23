import { Server, Socket } from 'socket.io';
import logger from '../utils/logger';
import { findUserConversations } from '../services/conversationService';
import MessageStatus from '../modelsDB/messageStatus';

export const onlineUsers = new Map<string, string>();

export const registerConnectionEvents = (io: Server, socket: Socket) => {
socket.on('user_connected', async (userId: string) => {
  socket.data.userId = userId;
  onlineUsers.set(userId, socket.id);

  const conversations = await findUserConversations(userId);

  const participantIds = new Set<string>();
  conversations.forEach((conv) => {
    conv.participants.forEach((participant: any) => {
      const id = participant._id
        ? participant._id.toString()
        : participant.toString();
      if (id !== userId) participantIds.add(id);
    });
  });

  const onlineParticipants = [...participantIds].filter((id) =>
    onlineUsers.has(id),
  );

  socket.emit('online_users', onlineParticipants);

  onlineParticipants.forEach((participantId) => {
    const participantSocketId = onlineUsers.get(participantId);
    if (participantSocketId) {
      io.to(participantSocketId).emit('user_came_online', userId);
    }
  });

  // ← add from here down only
  for (const conv of conversations) {
    const pendingStatuses = await MessageStatus.find({
      conversation_id: conv._id,
      status: 'sent',
      sender_id: { $ne: userId }, // not their own messages
    });

    for (const status of pendingStatuses) {
      await MessageStatus.findByIdAndUpdate(status._id, {
        status: 'delivered',
        deliveredAt: new Date(),
      });

      // notify sender if they are online
      const senderSocketId = onlineUsers.get(status.sender_id.toString());
      if (senderSocketId) {
        io.to(senderSocketId).emit('message_status_updated', {
          messageId: status.message_id,
          status: 'delivered',
        });
      }
    }
  }
});

  socket.on('disconnect', async () => {
    const userId = socket.data.userId;
    if (!userId) return;

    onlineUsers.delete(userId);
    logger.info(`User ${userId} disconnected`);

    const conversations = await findUserConversations(userId);

    const participantIds = new Set<string>();
    conversations.forEach((conv) => {
      conv.participants.forEach((participant: any) => {
        const id = participant._id
          ? participant._id.toString()
          : participant.toString();
        if (id !== userId) participantIds.add(id);
      });
    });

    participantIds.forEach((participantId) => {
      const participantSocketId = onlineUsers.get(participantId);
      if (participantSocketId) {
        io.to(participantSocketId).emit('user_went_offline', userId);
      }
    });
  });
};
