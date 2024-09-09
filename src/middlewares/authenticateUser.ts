import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Assumes Bearer token
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'thequickbrownfoxjumpsrightoverthelzaydog') as { id: number };
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user; // Attach the user to the request object
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};
