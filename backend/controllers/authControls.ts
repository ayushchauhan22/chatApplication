import { Request, Response } from 'express';
import { registerSchema, loginSchema } from '../schema/authSchema';
import { generateToken } from '../utils/jwt';
import { hashPswd, verifyPswd } from '../utils/passwdHashing';
import {
  createUser,
  findUser,
  updateUser,
  getUserById,
} from '../services/userService';

export const registerUser = async (req: Request, res: Response) => {
  // validate by ZOD
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(result.error.format());
  }

  const { phone, name, email, password } = result.data;

  // check user exist or not
  const isEmailExist = await findUser({ email });
  if (isEmailExist) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const existingUser = await findUser({ phone });
  if (existingUser) {
    return res.status(400).json({ message: 'Phone Number already registered' });
  }

  // paswd hashing and create in db
  const hashpassword = await hashPswd(password);
  const userData = await createUser(phone, name, email, hashpassword);

  // JWT token
  const token = generateToken(userData._id, userData.email);
  res.cookie('token', token, {
    httpOnly: true, 
    secure: true, 
    sameSite: 'lax', 
    maxAge: 1 * 24 * 60 * 60 * 1000, 
  });

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
  const emailId = result.data.email;
  const password = result.data.password;

  const user = await findUser({ email: emailId });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatched = await verifyPswd(password, user.password);

  if (!isMatched) {
    return res.status(401).json({ message: 'Password Incorrect' });
  }

  // JWT token generation
  const token = generateToken(user._id, emailId);
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
  
  await updateUser({ emailId }, { last_seen: Date.now() });
  const { _id, name, email, phone, last_seen } = user.toObject();

  const userResponse = {
    _id,
    name,
    email,
    phone,
    last_seen,
  };

  res.status(200).json({
    message: 'Login successful',
    userResponse,
    token,
  });
};

export const verifyUser = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'authenticated',
  });
};

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

export const loggedInUser = async (req: Request, res: Response) => {
  // const {Id} =

  const result = await getUserById(req.body.decoded.Id);

  res.status(200).json({
    data: result,
    message: 'User found',
  });
};
