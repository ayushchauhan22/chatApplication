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

   const statusDoc =  await MessageStatus.create({
     message_id: message._id,
     sender_id: senderId,
     conversation_id: conversationId,
     status: 'sent',
     seenBy: [],
   });

  const populated = await message.populate('sender', 'name email');

 return {
   ...populated.toObject(),
   messageStatus: statusDoc.toObject(),
 };
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


export const updateMessageSeen = async (
  lastSeenMessageId: string,
  conversationId: string,
  userId: string,
) => {

  const eligibleMessages = await Message.find({
    conversation_id: conversationId,
    sender: { $ne: userId },        
    _id: { $lte: lastSeenMessageId },
  }).select('_id');

  const eligibleIds = eligibleMessages.map((m) => m._id);
  if (eligibleIds.length === 0) return null;

  return await MessageStatus.updateMany(
    {
      message_id: { $in: eligibleIds },
      conversation_id: conversationId,
      'seenBy.user_id': { $ne: userId }, 
    },
    {
      $addToSet: {
        seenBy: {
          user_id: userId,
          seenAt: new Date(),
        },
      },
      $set: { status: 'seen' },
    },
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



export const getSeenByForMessage = async (messageId: string) => {
  const status = await MessageStatus.findOne({ message_id: messageId })
    .populate('seenBy.user_id', 'name _id');
  
  if (!status) return [];

  return status.seenBy.map((entry: any) => ({
    user: {
      _id: entry.user_id._id,
      name: entry.user_id.name,
    },
    seenAt: entry.seenAt,
  }));
};