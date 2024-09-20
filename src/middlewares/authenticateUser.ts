import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET:string = process.env.JWT_SECRET ?? '';
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token,JWT_SECRET) as { id: number };
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};
