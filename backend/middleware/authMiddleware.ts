import jwt, { VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const isAuthorizedUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  const jwtKey = process.env.JWT_KEY;

  if (!token) {
    return res.status(401).json({ message: "token missing" });
  }

  if (!jwtKey) {
    return res.status(500).json({ message: "key is not configured" });
  }

  jwt.verify(token, jwtKey, (err: VerifyErrors | null, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }
    next();
  });
};
