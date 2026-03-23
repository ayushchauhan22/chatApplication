import express from 'express';
import { Wrapper } from '../wrappers/wrapper';
import { isAuthorizedUser } from '../middleware/authMiddleware';
import {
    sendChatRequest,
    getIncomingChatRequests,
    getOutgoingChatRequests,
    acceptChatRequest,
    rejectChatRequest,
} from '../controllers/chatRequestController';

const router = express.Router();

router.post("/send-request", isAuthorizedUser, Wrapper(sendChatRequest));

router.get("/incoming-requests/:requestId", isAuthorizedUser, Wrapper(getIncomingChatRequests));
router.get("/outgoing-requests/:requestId", isAuthorizedUser, Wrapper(getOutgoingChatRequests));

router.put("/accept/:requestId", isAuthorizedUser, Wrapper(acceptChatRequest));
router.put("/reject/:requestId", isAuthorizedUser, Wrapper(rejectChatRequest));

export default router;
