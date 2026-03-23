import { Server } from 'socket.io';
import { onlineUsers } from './connection.socket';

export const emitGroupUpdated = (
  io: Server,
  participants: any[],
  updatedConversation: any,
) => {
  participants.forEach((participant: any) => {
    const socketId = onlineUsers.get(participant._id.toString());
    if (socketId) {
      io.to(socketId).emit('group_updated', updatedConversation);
    }
  });
};

export const emitRemovedFromGroup = (
  io: Server,
  userId: string,
  conversationId: string,
) => {
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit('removed_from_group', { conversationId });
  }
};

export const emitConversationAdded = (
  io: Server,
  userId: string,
  conversation: any,
) => {
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit('conversation_added', { conversation });
  }
};

// ← new
export const emitRequestAccepted = (
  io: Server,
  senderId: string,
  receiverId: string,
  conversation: any,
) => {
  const senderSocketId = onlineUsers.get(senderId);
  if (senderSocketId) {
    io.to(senderSocketId).emit('request_accepted', {
      receiverId,
      conversation,
    });
  }

  const receiverSocketId = onlineUsers.get(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('conversation_added', { conversation });
  }
};

export const emitConversationDeleted = (
  io: Server,
  participants: any[],
  conversationId: string,
) => {
  participants.forEach((participant: any) => {
    const id = participant._id
      ? participant._id.toString()
      : participant.toString();
    const socketId = onlineUsers.get(id);
    if (socketId) {
      io.to(socketId).emit('conversation_deleted', { conversationId });
    }
  });
};