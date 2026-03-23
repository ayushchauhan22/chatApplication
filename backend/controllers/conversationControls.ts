import { deleteConversation } from '../services/conversationService';
import { emitConversationDeleted } from '../sockets/conversation.socket';
import { Request, Response } from 'express';
import {
  createConversationSchema,
  getUserConversationsSchema,
  conversationByIdSchema,
  addUserToConversationSchema,
  removeUserFromConversationSchema,
} from '../schema/conversationSchema';
import {
  findConversation,
  createConversation as createConversationService,
  findConversationById,
  findUserConversations,
  addParticipantToConversation,
  removeParticipantFromConversation,
} from '../services/conversationService';
import Conversation from '../modelsDB/conversation';
import { io } from '../server'; // ← correct import, from your own server
import {
  emitGroupUpdated,
  emitRemovedFromGroup,
} from '../sockets/conversation.socket'; // ← from socket file

import { deleteChatRequestByParticipants } from '../services/chatRequestService';

export const createConversation = async (req: Request, res: Response) => {
  const result = createConversationSchema.safeParse({ body: req.body });
  if (!result.success) return res.status(400).json(result.error.flatten());

  const { participants, isGroup, group_name = null } = req.body;

  if (isGroup && participants.length > 2) {
    const existingConversation = await findConversation({
      participants: { $all: participants },
      is_group: true,
    });
    if (existingConversation) return res.status(200).json(existingConversation);

    const ack = await createConversationService({
      participants,
      is_group: true,
      group_name,
    });
    return res.status(201).json(ack);
  }

  const existingConversation = await findConversation({
    participants: { $all: participants, $size: 2 },
    is_group: false,
  });
  if (existingConversation) return res.status(200).json(existingConversation);

  const ack = await createConversationService({
    participants,
    is_group: false,
  });
  res.status(201).json(ack);
};

export const getUserConversations = async (req: Request, res: Response) => {
  const result = getUserConversationsSchema.safeParse({
    userId: req.body.decoded.Id,
  });
  if (!result.success) return res.status(400).json(result.error.flatten());

  const conversations = await findUserConversations(result.data.userId);
  res.json(conversations);
};

export const getConversationById = async (req: Request, res: Response) => {
  const result = conversationByIdSchema.safeParse({ params: req.params });
  if (!result.success) return res.status(400).json(result.error.flatten());

  const conversation = await findConversationById(result.data.params.id);
  if (!conversation)
    return res.status(404).json({ message: 'Conversation not found' });

  res.json(conversation);
};

export const addUserToConversation = async (req: Request, res: Response) => {
  const result = addUserToConversationSchema.safeParse({
    params: req.params,
    body: req.body,
  });
  if (!result.success) return res.status(400).json(result.error.flatten());

  const { id } = result.data.params;
  const { userId } = result.data.body;

  const conversationRoom = await addParticipantToConversation(id, userId);
  if (!conversationRoom)
    return res.status(404).json({ message: 'Conversation not found' });

  const populated = await findConversationById(id);
  if (populated) {
    emitGroupUpdated(io, populated.participants, populated); // ← clean
  }

  res.json(conversationRoom);
};

export const removeUserFromConversation = async (
  req: Request,
  res: Response,
) => {
  const result = removeUserFromConversationSchema.safeParse({
    params: req.params,
    body: req.body,
  });
  if (!result.success) return res.status(400).json(result.error.flatten());

  const { id } = result.data.params;
  const { userId } = result.data.body;

  const conversationRoom = await removeParticipantFromConversation(id, userId);
  if (!conversationRoom)
    return res.status(404).json({ message: 'Conversation not found' });

  const populated = await findConversationById(id);
  if (populated) {
    emitGroupUpdated(io, populated.participants, populated); // ← notify remaining
  }

  emitRemovedFromGroup(io, userId, id); // ← notify removed user

  res.json(conversationRoom);
};

export const getAllConversations = async (req: Request, res: Response) => {
  const userId = req.body.decoded?.Id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const conversations = await findUserConversations(userId, skip, limit);
  const total = await Conversation.countDocuments({ participants: userId });

  res.json({
    conversations,
    hasMore: skip + conversations.length < total,
    page,
  });
};

export const deleteConversationById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const conversation = await findConversationById(String(id));
  if (!conversation)
    return res.status(404).json({ message: 'Conversation not found' });

  // for direct conversations delete the chat request between the two users
  if (!conversation.is_group && conversation.participants.length === 2) {
    const [user1, user2] = conversation.participants.map((p: any) =>
      p._id ? p._id.toString() : p.toString(),
    );
    await deleteChatRequestByParticipants(user1, user2);
  }

  await deleteConversation(String(id));

  emitConversationDeleted(io, conversation.participants, String(id));

  res.json({ message: 'Conversation deleted' });
};