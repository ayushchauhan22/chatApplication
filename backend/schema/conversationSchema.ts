import { z } from 'zod';
import { registerApi } from '../swagger/swaggerHelper';

export const createConversationSchema = z.object({
  body: z.object({
    participants: z.array(
      z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
    ),
    isGroup: z.boolean(),
  }),
});

export const getUserConversationsSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
});

export const conversationByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const addUserToConversationSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    userId: z.string().uuid(),
  }),
});

export const removeUserFromConversationSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    userId: z.string().uuid(),
  }),
});

registerApi("post", "/rooms/conversations", createConversationSchema, "Conversation");
registerApi("get", "/rooms/conversations/:userId", getUserConversationsSchema, "Conversation");
registerApi("get", "/rooms/conversations/:id", conversationByIdSchema, "Conversation");
registerApi("put", "/rooms/conversations/:id/add-user", addUserToConversationSchema, "Conversation");
registerApi("put", "/rooms/conversations/:id/remove-user", removeUserFromConversationSchema, "Conversation");