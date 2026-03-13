import Conversation from '../modelsDB/conversation';
import MessageStatus from '../modelsDB/messageStatus';
import Message from '../modelsDB/message';
export const createMessage = async (conversationId: string, text: string, senderId: string,) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  const message = new Message({
    content: text,
    sender: senderId,
    conversation_id: conversationId,
  });

  await message.save();

  return message;
};

export const updateMessageDelivered = async (messageId: string) => {
  return await MessageStatus.findByIdAndUpdate(
    messageId,
    { status: "delivered" },
    { new: true }
  );
};

export const updateMessageSeen = async (messageId: string) => {
  return await MessageStatus.findByIdAndUpdate(
    messageId,
    { status: "seen" },
    { new: true }
  );
};