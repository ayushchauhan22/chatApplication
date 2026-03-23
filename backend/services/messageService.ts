import Conversation from '../modelsDB/conversation';
import MessageStatus from '../modelsDB/messageStatus';
import Message from '../modelsDB/message';

export const createMessage = async (
  conversationId: string,
  text: string | null,
  senderId: string,
  url: string | null,
  uploadId: string | null,
  filename: string,
) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new Error('Conversation not found');

  const message = new Message({
    content: text,
    sender: senderId,
    conversation_id: conversationId,
    fileUrl: url,
    uploadId: uploadId ?? null,
    filename: filename
  });

  await message.save();

  await MessageStatus.create({
    message_id: message._id,
    sender_id: senderId,
    conversation_id: conversationId,
    status: 'sent',
    seenBy: [],
  });

  return await message.populate('sender', 'name email');
};

export const getMessagesByConversation = async (
  conversationId: string,
  skip = 0,
  limit = 50,
) => {
  const messages = await Message.find({
    conversation_id: conversationId,
    isActive: true,
  })
    .populate('sender', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const reversed = messages.reverse();
  const statuses = await MessageStatus.find({
    conversation_id: conversationId,
  });
  const statusMap = new Map(statuses.map((s) => [s.message_id.toString(), s]));

  return reversed.map((msg) => ({
    ...msg.toObject(),
    messageStatus: statusMap.get(msg._id.toString()) || null,
  }));
};

export const updateMessageDelivered = async (messageId: string) => {
  return await MessageStatus.findOneAndUpdate(
    { message_id: messageId },
    { status: 'delivered', deliveredAt: new Date() },
    { returnDocument: 'after' },
  );
};

export const updateMessageSeen = async (messageId: string, userId: string) => {
  return await MessageStatus.findOneAndUpdate(
    { message_id: messageId },
    {
      status: 'seen',
      seenAt: new Date(),
      $addToSet: {
        seenBy: { user_id: userId, seenAt: new Date() },
      },
    },
    { returnDocument: 'after' },
  );
};

export const editMessageById = async (message_id: string, content: string) => {
  return await Message.findByIdAndUpdate(
    message_id,
    { content },
    { returnDocument: 'after' },
  );
};


export const softDeleteMessage = async (messageId: string) => {
  return await Message.findByIdAndUpdate(
    messageId,
    { isActive: false },
    { returnDocument: 'after' },
  );
};