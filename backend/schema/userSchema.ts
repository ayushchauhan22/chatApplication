import { z } from 'zod';
import { registerApi } from '../swagger/swaggerHelper';

export const searchUserByNameSchema = z.object({
  query: z.object({
    name: z.string().min(1),
  }),
});

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

registerApi('get', '/users/search', searchUserByNameSchema, 'User');
registerApi('get', '/users/all-users', null, 'User');
registerApi('get', '/users/:id', getUserByIdSchema, 'User');
