import Conversation from '../modelsDB/conversation';
import Message from '../modelsDB/message';
import {
    messageSchema,
    edditMessageSchema,
    deleteMessageSchema
} from '../schema/messageSchema';
import { Request, Response } from 'express';
import { createMessage } from "../services/messageService";


export const getMessages = async (req: Request, res: Response) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  const messages = await Message.find({
    conversation_id: conversationId,
  }).populate('sender', 'name email');

  res.json(messages);
};

export const sendMessage = async (req: Request, res: Response) => {
  
  const result = messageSchema.safeParse({
    params: req.params,
    body: req.body,
  });

  if (!result.success) {
    return res.status(400).json({ message: 'Invalid message data' });
  }

  const { conversationId } = req.params as { conversationId: string };
  const { text, senderId } = req.body;

  const message = await createMessage(conversationId, text, senderId);

  res.status(201).json(message);
};

export const editMessage = async (req: Request, res: Response) => {
  const result = edditMessageSchema.safeParse({
    body: req.body,
  });

    if (!result.success) {
        return res.status(400).json({ message: 'Invalid message data' });
    }

    const { message_id, content } = req.body;

    const message =  await Message.findByIdAndUpdate(message_id, { text: content }, { new: true });
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
};

export const deleteMessage = async (req: Request, res: Response) => {
  const result = deleteMessageSchema.safeParse({
    params: req.params,
  });

  if (!result.success) {
    return res.status(400).json({ message: 'Invalid message data' });
  }

  const { message_id } = req.params;

  const message = await Message.findByIdAndDelete(message_id);

  if (!message) {
    return res.status(404).json({ message: 'Message not found' });
  }

  res.json({ message: 'Message deleted successfully' });
};
