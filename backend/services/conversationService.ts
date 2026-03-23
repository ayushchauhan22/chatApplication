import Conversation from '../modelsDB/conversation';
import { Types } from 'mongoose';

export const findConversation = async (query: object) => {
  return await Conversation.findOne(query);
};

export const createConversation = async (data: object) => {
  return await Conversation.create(data);
};

export const findConversationById = async (id: string) => {
  return await Conversation.findById(id).populate(
    'participants',
    'name email phone is_online last_seen',
  );
};

export const findConversationByIdRaw = async (id: string) => {
  return await Conversation.findById(id);
};

export const findUserConversations = async (
  userId: string,
  skip = 0,
  limit = 10,
) => {
  return await Conversation.find({ participants: userId })
    .populate('participants', 'name email phone')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);
};
export const addParticipantToConversation = async (
  id: string,
  userId: string,
) => {
  const conversation = await Conversation.findById(id);
  if (!conversation) return null;

  const userObjectId = new Types.ObjectId(userId);
  if (!conversation.participants.includes(userObjectId)) {
    conversation.participants.push(userObjectId);
    await conversation.save();
  }

  return conversation;
};

export const removeParticipantFromConversation = async (
  id: string,
  userId: string,
) => {
  const conversation = await Conversation.findById(id);
  if (!conversation) return null;

  const userObjectId = new Types.ObjectId(userId);
  const index = conversation.participants.indexOf(userObjectId);
  if (index > -1) {
    conversation.participants.splice(index, 1);
    await conversation.save();
  }

  return conversation;
};

export const deleteConversation = async (id: string) => {
  return await Conversation.findByIdAndDelete(id);
};