import { z } from 'zod';
import { registerApi } from '../swagger/swaggerHelper';

export const chatRequestSchema = z.object({
  senderId: z.string(),
  receiverId: z.string()
});

export const chatRequestIdSchema = z.object({
    params: z.object({
        requestId: z.string()
    })
})
registerApi('post', '/chat-requests/send-request', chatRequestSchema, 'ChatRequest');
registerApi('get', '/chat-requests/incoming-requests/:userId', chatRequestIdSchema, 'ChatRequest');
registerApi('get', '/chat-requests/outgoing-requests/:userId', chatRequestIdSchema, 'ChatRequest');
registerApi('put', '/chat-requests/accept-request/:requestId', chatRequestIdSchema, 'ChatRequest');
registerApi('put', '/chat-requests/reject-request/:requestId', chatRequestIdSchema, 'ChatRequest');