import User from '../modelsDB/user';
import { Request, Response } from 'express';
import {
  searchUserByNameSchema,
  getUserByIdSchema,
} from '../schema/userSchema';

export const getAllUsers = async (req: Request, res: Response) => {
  const allUsers = await User.find(
    {},
    { name: 1, email: 1, phone: 1, last_seen: 1, s_online: 1 },
  );
  res.json(allUsers);
};

export const searchUserByName = async (req: Request, res: Response) => {
  const result = searchUserByNameSchema.safeParse({
    query: req.query,
  });

  if (!result.success) {
    return res.status(400).json(result.error.flatten());
  }

  res.json(
    await User.find(
      {
        name: { $regex: result.data.query.name, $options: 'i' },
      },
      {
        name: 1,
        email: 1,
        phone: 1,
        last_seen: 1,
        s_online: 1,
      },
    ),
  );
};

export const getUserById = async (req: Request, res: Response) => {
  const user = getUserByIdSchema.safeParse({
    params: req.params,
  });

  if (!user.success) {
    return res.status(400).json(user.error.flatten());
  }

  res.json(
    await User.findById(
      {
        _id: user.data,
      },
      {
        name: 1,
        email: 1,
        phone: 1,
        last_seen: 1,
        s_online: 1,
      },
    ),
  );
};
