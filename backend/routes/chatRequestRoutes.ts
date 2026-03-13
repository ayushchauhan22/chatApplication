import express from 'express';
import { Wrapper } from '../wrappers/wrapper';
import { isAuthorizedUser } from '../middleware/authMiddleware';
import {
    sendChatRequest,
    getIncomingChatRequests,
    getOutgoingChatRequests,
    acceptChatRequest,
    rejectChatRequest
} from '../controllers/chatRequestController';

const router = express.Router();

router.post("/send-request", isAuthorizedUser, Wrapper(sendChatRequest));

router.get("/incoming-requests", isAuthorizedUser, Wrapper(getIncomingChatRequests));
router.get("/outgoing-requests", isAuthorizedUser, Wrapper(getOutgoingChatRequests));

router.put("/chat-request/:requestId/accept", isAuthorizedUser, Wrapper(acceptChatRequest));
router.put("/chat-request/:requestId/reject", isAuthorizedUser, Wrapper(rejectChatRequest));


export default router;
