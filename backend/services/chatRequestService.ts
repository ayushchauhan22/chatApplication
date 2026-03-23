import ChatRequest from '../modelsDB/chatRequest';
import Conversation from '../modelsDB/conversation';
import { Types } from 'mongoose';

export const findExistingChatRequest = async (
  senderId: string,
  receiverId: string,
) => {
  return await ChatRequest.findOne({
    $or: [
      { sender_id: senderId, receiver_id: receiverId },
      { sender_id: receiverId, receiver_id: senderId },
    ],
    status: { $in: ['pending', 'accepted'] },
  });
};

export const findExistingConversationBetweenUsers = async (
  senderId: string,
  receiverId: string,
) => {
  return await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
    is_group: false,
  });
};

export const createChatRequest = async (
  senderId: string,
  receiverId: string,
) => {
  return await ChatRequest.create({
    sender_id: new Types.ObjectId(senderId),
    receiver_id: new Types.ObjectId(receiverId),
  });
};

export const getIncomingChatRequests = async (userId: string) => {
  return await ChatRequest.find({
    receiver_id: userId,
    status: 'pending',
  }).populate('sender_id', 'name email');
};

export const getOutgoingChatRequests = async (userId: string) => {
  return await ChatRequest.find({
    sender_id: userId,
    status: 'pending',
  }).populate('receiver_id', 'name email');
};

export const updateChatRequestStatus = async (
  requestId: string,
  status: string,
) => {
  return await ChatRequest.findByIdAndUpdate(
    requestId,
    { status },
    { returnDocument: 'after' },
  )
    .populate('sender_id', 'name email')
    .populate('receiver_id', 'name email');
};

export const deleteChatRequestByParticipants = async (
  user1: string,
  user2: string,
) => {
  return await ChatRequest.deleteOne({
    $or: [
      { sender_id: user1, receiver_id: user2 },
      { sender_id: user2, receiver_id: user1 },
    ],
  });
};