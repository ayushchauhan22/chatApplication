import express from 'express';
import { Wrapper } from "../wrappers/wrapper";
import { isAuthorizedUser } from '../middleware/authMiddleware';
import {
  createConversation,
  getConversationById,
  addUserToConversation,
  removeUserFromConversation,
  getAllConversations,
  deleteConversationById,
} from '../controllers/conversationControls';

const router = express.Router();

router.post("/conversations", isAuthorizedUser, Wrapper(createConversation));
router.get("/conversations", isAuthorizedUser, Wrapper(getAllConversations)); 
router.get("/conversations/:id", isAuthorizedUser, Wrapper(getConversationById));
router.put("/conversations/:id/add-user", isAuthorizedUser, Wrapper(addUserToConversation));
router.put("/conversations/:id/remove-user", isAuthorizedUser, Wrapper(removeUserFromConversation));
router.delete("/conversations/:id", isAuthorizedUser, Wrapper(deleteConversationById));
export default router;