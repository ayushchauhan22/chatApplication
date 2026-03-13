import { z } from "zod";
import { registerApi } from "../swagger/swaggerHelper";

export const messageSchema = z.object({
  params: z.object({
    conversationId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
  body: z.object({
    text: z.string().min(1),
    senderId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
});

export const edditMessageSchema = z.object({
  message_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  content: z.string()
});

export const deleteMessageSchema = z.object({
  message_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')
});


registerApi("post", "/messages/:conversationId", messageSchema, "Message");
registerApi("get", "/messages/:conversationId", null, "Message");
registerApi("put", "/messages/:messageId", edditMessageSchema, "Message");
registerApi("delete", "/messages/:messageId", deleteMessageSchema, "Message");