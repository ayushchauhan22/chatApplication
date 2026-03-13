import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../schema/authSchema';
import User from '../modelsDB/user';

export const registerUser = async (req: Request, res: Response) => {
  // validate by ZOD
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(result.error.format());
  }

  const { phone, name, email, password } = result.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  await User.create({
    phone,
    name,
    email,
    password,
    last_seen: new Date(),
  });
  // JWT token
  const time = (process.env.EXPIRATION_TIME ??
    '1h') as unknown as import('ms').StringValue;

  const token = jwt.sign({ email }, process.env.JWT_KEY as string, {
    expiresIn: time,
  });
  res.cookie('token', token, { httpOnly: true, secure: false });

  res.status(201).json({
    message: 'Signup successful',
    user: { name, email },
    token: token,
  });
};

export const loginUser = async (req: Request, res: Response) => {
  // validate by ZOD
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(result.error);
  }
  const { email, password } = result.data;

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // JWT token generation
  const time = (process.env.EXPIRATION_TIME ??
    '1h') as unknown as import('ms').StringValue;

  const token = jwt.sign(
    { email, id: user._id },
    process.env.JWT_KEY as string,
    {
      expiresIn: time,
    },
  );
  res.cookie('token', token, { httpOnly: true, secure: false });

  await User.updateOne({ email }, { last_seen: new Date() });

  res.status(200).json({
    message: 'Login successful',
    user: { email, id: user._id },
    token: token,
  });
};

export const verifyUser = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'User is authenticated' });
};
