import { Request, Response } from 'express';
import {
  searchUserByNameSchema,
  getUserByIdSchema,
} from '../schema/userSchema';
import {
  findUserByPhone,
  getUserById as getUserByIdService,
  allChatUser,
  findUserByName,
  updateUser,
} from '../services/userService';

export const getAllUsers = async (req: Request, res: Response) => {
  const { phone } = req.query;
  const allUsers = await findUserByPhone(Number(phone));
  res.json(allUsers);
};

export const searchUserByName = async (req: Request, res: Response) => {
  const { name } = req.query;
  const userId = req.body.decoded?.Id;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'name is required' });
  }

  const users = await findUserByName(name, userId);
  res.json(users);
};

export const searchUserByPhone = async (req: Request, res: Response) => {
  const result = searchUserByNameSchema.safeParse({ query: req.query });
  if (!result.success) {
    return res.status(400).json(result.error.flatten());
  }
  res.json(await findUserByPhone(Number(result.data.query.phone)));
};

export const getUserById = async (req: Request, res: Response) => {
  const user = getUserByIdSchema.safeParse({ params: req.params });
  if (!user.success) {
    return res.status(400).json(user.error.flatten());
  }
  res.json(await getUserByIdService(user.data.params.id));
};

export const getChatUser = async (req: Request, res: Response) => {
  const userId = req.body.Id;
  const conversation = await allChatUser(userId);
  const users = conversation
    .map((conv) =>
      conv.participants.filter(
        (user: any) => user._id.toString() !== userId.toString(),
      ),
    )
    .flat();
  res.status(200).json({ success: true, users });
};

// ← new: update logged-in user's name
export const updateUserProfile = async (req: Request, res: Response) => {
  const userId = req.body.decoded?.Id;
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res
      .status(400)
      .json({ message: 'Name must be at least 2 characters' });
  }

  await updateUser({ _id: userId }, { name: name.trim() });

  // return updated user
  const updated = await getUserByIdService(userId);
  res.json(updated);
};
