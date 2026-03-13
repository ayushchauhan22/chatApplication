import Conversation from '../modelsDB/conversation';
import { Request, Response } from 'express';
import { Types } from 'mongoose';         

import {
  createConversationSchema,
  getUserConversationsSchema,
  conversationByIdSchema,
  addUserToConversationSchema,
  removeUserFromConversationSchema,
} from '../schema/conversationSchema';

export const createConversation = async (req: Request, res: Response) => {
  
  const result = createConversationSchema.safeParse({
    body: req.body,
  });

  if (!result.success) {
    return res.status(400).json(result.error.flatten());
  }

  const { participants, isGroup } = result.data.body;

  if (isGroup && participants.length > 2) {
    const existingConversation = await Conversation.findOne({
      participants: { $all: participants },
      is_group: true,
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    const ack = await Conversation.create({
      participants,
      is_group: true,
    });

    return res.status(201).json(ack);
  }

  const existingConversation = await Conversation.findOne({
    participants: { $all: participants, $size: 2 },
    is_group: false,
  });

  if (existingConversation) {
    return res.status(200).json(existingConversation);
  }

  const ack = await Conversation.create({
    participants,
    is_group: false,
  });

  res.status(201).json(ack);
};

// to get all conversations of a user (chat List)
export const getUserConversations = async (req: Request, res: Response) => {
  const result = getUserConversationsSchema.safeParse({
    params: req.params,
  });

  if (!result.success) {
    return res.status(400).json(result.error.flatten());
  }

  const { userId } = result.data.params;

  const conversations = await Conversation.find({
    participants: userId,
  }).populate('participants', 'name email phone is_online last_seen');

  res.json(conversations);
};

// get conversation between two people or group by its conversation id
export const getConversationById = async (req: Request, res: Response) => {
  const result = conversationByIdSchema.safeParse({
    params: req.params,
  });

  if (!result.success) {
    return res.status(400).json(result.error.flatten());
  }

  const { id } = result.data.params;

  const conversation = await Conversation.findById(id).populate(
    'participants',
    'name email phone is_online last_seen',
  );

  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  res.json(conversation);
};

export const addUserToConversation = async (req: Request, res: Response) => {
  const result = addUserToConversationSchema.safeParse({
    params: req.params,
    body: req.body,
  });

  if (!result.success) {
    return res.status(400).json(result.error.flatten());
  }

  const { id } = result.data.params;
  const { userId } = result.data.body;

  const conversationRoom = await Conversation.findById(id);

  if (!conversationRoom) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  const userObjectId = new Types.ObjectId(userId);

  if (!conversationRoom.participants.includes(userObjectId)) {
    conversationRoom.participants.push(userObjectId);
    await conversationRoom.save();
  }

  res.json(conversationRoom);
};

export const removeUserFromConversation = async (req: Request, res: Response,) => {
  const result = removeUserFromConversationSchema.safeParse({
    params: req.params,
    body: req.body,
  });

  if (!result.success) {
    return res.status(400).json(result.error.flatten());
  }

  const { id } = result.data.params;
  const { userId } = result.data.body;

  const conversationRoom = await Conversation.findById(id);

  if (!conversationRoom) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  const userObjectId = new Types.ObjectId(userId);

  const index = conversationRoom.participants.indexOf(userObjectId);

  if (index > -1) {
    conversationRoom.participants.splice(index, 1);
    await conversationRoom.save();
  }

  res.json(conversationRoom);
};