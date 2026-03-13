import express from 'express';
import { Wrapper } from "../wrappers/wrapper";
import { isAuthorizedUser } from '../middleware/authMiddleware';
import { 
    createConversation, 
    getUserConversations,
    getConversationById,
    addUserToConversation,
    removeUserFromConversation
} from '../controllers/conversationControls';
const router = express.Router();

router.post("/conversations", isAuthorizedUser, Wrapper(createConversation));

// get all conversations of logged-in user
router.get("/conversations/:userId", isAuthorizedUser, Wrapper(getUserConversations));

// get a specific conversation
router.get("/conversations/:id", isAuthorizedUser, Wrapper(getConversationById));

router.put("/conversations/:id/add-user", isAuthorizedUser, Wrapper(addUserToConversation));
router.put("/conversations/:id/remove-user", isAuthorizedUser, Wrapper(removeUserFromConversation));

export default router;