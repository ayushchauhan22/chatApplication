import jwt from 'jsonwebtoken';

const time = (process.env.EXPIRATION_TIME ??
  '1h') as unknown as import('ms').StringValue;
  
export const generateToken = (Id: object, email: string) => {  
  return jwt.sign({ Id, email }, process.env.JWT_KEY as string, {
    expiresIn: time,
  });
};
