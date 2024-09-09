import { Request, Response, NextFunction } from 'express';

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user && user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access forbidden' });
  }
};
