// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/CustomError.js';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error('Unexpected error: ', err);
  res.status(500).json({ error: 'Internal server error' });
};
