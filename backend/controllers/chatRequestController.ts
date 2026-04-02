import { io } from '../server';
import {
  createConversation,
  findConversationById,
} from '../services/conversationService';
import { Request, Response } from 'express';
import {
  chatRequestSchema,
  chatRequestIdSchema,
} from '../schema/chatRequestSchema';
import {
  findExistingChatRequest,
  findExistingConversationBetweenUsers,
  createChatRequest,
  getIncomingChatRequests as getIncomingChatRequestsService,
  getOutgoingChatRequests as getOutgoingChatRequestsService,
  updateChatRequestStatus,
} from '../services/chatRequestService';

import { emitRequestAccepted } from '../sockets/conversation.socket';

export const sendChatRequest = async (req: Request, res: Response) => {
  const result = chatRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error.flatten());
  }

  const { senderId, receiverId } = result.data;
  const existingRequest = await findExistingChatRequest(senderId, receiverId);

  if (existingRequest) {
    if (existingRequest.status === 'pending') {
      return res.status(400).json({ error: 'Request already pending' });
    }
    if (existingRequest.status === 'accepted') {
      return res.status(400).json({ error: 'Already connected' });
    }
  }

  const existingConversation = await findExistingConversationBetweenUsers(
    senderId,
    receiverId,
  );
  if (existingConversation) {
    return res
      .status(400)
      .json({ error: 'Conversation already exists between these users' });
  }

  const chatRequest = await createChatRequest(senderId, receiverId);
  res.status(201).json(chatRequest);
};

export const getIncomingChatRequests = async (req: Request, res: Response) => {
  const result = chatRequestIdSchema.safeParse({ params: req.params });
  if (!result.success) {
    return res.status(400).json(result.error.flatten());
  }
  const userId = req.params.requestId as string;
  const chatRequests = await getIncomingChatRequestsService(userId);
  res.json(chatRequests);
};

export const getOutgoingChatRequests = async (req: Request, res: Response) => {
  const result = chatRequestIdSchema.safeParse({ params: req.params });
  if (!result.success) {
    return res.status(400).json(result.error.flatten());
  }
  const userId = result.data.params.requestId;
  const chatRequests = await getOutgoingChatRequestsService(userId);
  res.json(chatRequests);
};

export const acceptChatRequest = async (req: Request, res: Response) => {
  const result = chatRequestIdSchema.safeParse({ params: req.params });
  if (!result.success) return res.status(400).json(result.error.flatten());

  const requestId = result.data.params.requestId;
  const chatRequest = await updateChatRequestStatus(requestId, 'accepted');
  if (!chatRequest) return res.status(404).json({ error: 'Request not found' });

  // create raw conversation
  const rawConversation = await createConversation({
    participants: [chatRequest.sender_id, chatRequest.receiver_id],
  });

  // ← populate BEFORE emitting — this is the fix for Problem 1 & 2
  // now participants array has { _id, name, email, phone } not just ObjectIds
  const populatedConversation = await findConversationById(
    rawConversation._id.toString(),
  );

  emitRequestAccepted(
    io,
    chatRequest.sender_id.toString(),
    chatRequest.receiver_id.toString(),
    populatedConversation, // ← send populated, not raw
  );

  res.json({ chatRequest, conversation: populatedConversation });
};

export const rejectChatRequest = async (req: Request, res: Response) => {
  const result = chatRequestIdSchema.safeParse({ params: req.params });
  if (!result.success) return res.status(400).json(result.error.flatten());

  const requestId = result.data.params.requestId;
  const chatRequest = await updateChatRequestStatus(requestId, 'cancelled');
  if (!chatRequest) return res.status(404).json({ error: 'Request not found' });

  res.json(chatRequest);
};
