import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const isAuthorizedUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  const jwtKey = process.env.JWT_KEY as string;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  jwt.verify(token, jwtKey, (err: unknown, decoded: unknown) => {

    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
   req.body = {
     ...req.body, 
     decoded, 
   };
   
    
    next();
  });
};
