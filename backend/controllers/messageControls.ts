import { io } from '../server';
import {
  edditMessageSchema,
} from '../schema/messageSchema';
import { Request, Response } from 'express';
import {
  getMessagesByConversation,
  editMessageById,
  softDeleteMessage,
} from '../services/messageService';
import { findConversationByIdRaw } from '../services/conversationService';
import Message from '../modelsDB/message'

export const getMessages = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = 50;
  const skip = (page - 1) * limit;

  const conversation = await findConversationByIdRaw(String(conversationId));
  if (!conversation)
    return res.status(404).json({ message: 'Conversation not found' });

  const messages = await getMessagesByConversation(String(conversationId), skip, limit);
  const total = await Message.countDocuments({
    conversation_id: conversationId,
  });

  res.json({
    messages,
    hasMore: skip + messages.length < total,
    page,
  });
};
// export const sendMessage = async (req: Request, res: Response) => {
//   const result = messageSchema.safeParse({
//     params: req.params,
//     body: req.body,
//   });

//   if (!result.success) {
//     return res.status(400).json({ message: 'Invalid message data' });
//   }

//   const { conversationId } = req.params as { conversationId: string };
//   const { text, senderId, fileUrl } = result.data.body;

//   const message = await createMessage(conversationId, text ?? null, senderId, fileUrl ?? null);
//   res.status(201).json(message);
// };

export const editMessage = async (req: Request, res: Response) => {
  const result = edditMessageSchema.safeParse({
    body: req.body,
  });

  if (!result.success) {
    return res.status(400).json({ message: 'Invalid message data' });
  }

  const { message_id, content } = req.body;

  const message = await editMessageById(message_id, content);
  if (!message) {
    return res.status(404).json({ message: 'Message not found' });
  }
  res.json(message);
};


export const deleteMessage = async (req: Request, res: Response) => {
  const { messageID } = req.params;
  const userId = req.body.decoded?.Id;

  const message = await Message.findById(messageID);
  if (!message) return res.status(404).json({ message: 'Message not found' });

  // only sender can delete
  if (message.sender.toString() !== userId) {
    return res
      .status(403)
      .json({ message: 'Not authorized to delete this message' });
  }

  await softDeleteMessage(String(messageID));

  // notify all in conversation
  io.to(message.conversation_id.toString()).emit('message_deleted', {
    messageId: messageID,
    conversationId: message.conversation_id.toString(),
  });

  res.json({ message: 'Message deleted' });
};

