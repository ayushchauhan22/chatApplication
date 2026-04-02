import express from 'express';
import {
  getAllUsers,
  getUserById,
  searchUserByPhone,
  getChatUser,
  searchUserByName,
  updateUserProfile,
} from '../controllers/userControls';
import { Wrapper } from '../wrappers/wrapper';
import { isAuthorizedUser } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/all-users', isAuthorizedUser, Wrapper(getAllUsers));
router.get('/search', isAuthorizedUser, Wrapper(searchUserByPhone));
router.get('/search-name', isAuthorizedUser, Wrapper(searchUserByName));
router.get('/chat-user', isAuthorizedUser, Wrapper(getChatUser));
// ← must be before /:id
router.put('/profile', isAuthorizedUser, Wrapper(updateUserProfile));
router.get('/:id', isAuthorizedUser, Wrapper(getUserById));

export default router;
