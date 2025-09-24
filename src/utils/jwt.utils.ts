import jwt from 'jsonwebtoken';
import { IUser } from '../models/User.model';

export interface TokenPayload {
  id: string;
  username: string;
  role: string;
  email: string;
}

export const generateToken = (user: IUser): string => {
  const payload: TokenPayload = {
    id: (user._id as any).toString(),
    username: user.username,
    role: user.role,
    email: user.email
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    } as any
  );
};

export const generateRefreshToken = (user: IUser): string => {
  const payload: TokenPayload = {
    id: (user._id as any).toString(),
    username: user.username,
    role: user.role,
    email: user.email
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET! + '_refresh',
    {
      expiresIn: '30d'
    }
  );
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET! + '_refresh') as TokenPayload;
};