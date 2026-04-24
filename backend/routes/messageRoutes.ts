import express from 'express';
import { Wrapper } from '../wrappers/wrapper';
import { isAuthorizedUser } from '../middleware/authMiddleware';
import {
  getMessages,
  editMessage,
  deleteMessage,
  getMessageSeenBy
} from '../controllers/messageControls';

const router = express.Router();

router.get('/:conversationId', isAuthorizedUser, Wrapper(getMessages));
router.get('/:messageId/seen', isAuthorizedUser, Wrapper(getMessageSeenBy));
router.put('/:messageID', isAuthorizedUser, Wrapper(editMessage));
router.delete('/:messageID', isAuthorizedUser, Wrapper(deleteMessage));

export default router;
