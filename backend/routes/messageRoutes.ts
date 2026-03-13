import express from 'express';
import { Wrapper } from '../wrappers/wrapper';
import { isAuthorizedUser } from '../middleware/authMiddleware';
import {
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
} from '../controllers/messageControls';
// GET /messages/:conversationId for getting history of that conversation
const router = express.Router();

router.get('/:conversationId', isAuthorizedUser, Wrapper(getMessages));

router.post('/:conversationId', isAuthorizedUser, Wrapper(sendMessage));

router.put('/:messageID', isAuthorizedUser, Wrapper(editMessage));

router.delete('/:messageID', isAuthorizedUser, Wrapper(deleteMessage));

export default router