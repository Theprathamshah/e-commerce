import { Router, Request, Response, NextFunction } from 'express';
import User from '../models/user.js';
import { authenticateUser } from './../middlewares/authenticateUser.js';
import { checkAdmin } from '../middlewares/isAdmin.js';
import { NotFoundError, ValidationError } from '../errors/CustomError.js';

const router = Router();

router.post('/create', async(req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.username || !req.body.email) {
      throw new ValidationError('Username and email are required');
    }

    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    next(error);
  }
});

router.get('/', authenticateUser, checkAdmin, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error: any) {
    next(error);
  }
});

router.get('/:id', authenticateUser, checkAdmin, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const userJson = user.toJSON() as any;
    if (userJson.password) {
      delete userJson.password;
    }

    res.json(userJson);
  } catch (error: any) {
    next(error);
  }
});

router.put('/:id', authenticateUser, checkAdmin, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await user.update(req.body);
    res.status(200).json(user);
  } catch (error: any) {
    next(error);
  }
});

router.delete('/:id', authenticateUser, checkAdmin, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    next(error);
  }
});

router.delete('/', authenticateUser, checkAdmin, async(req: Request, res: Response, next: NextFunction) => {
  try {
    await User.destroy({ where: {} });
    res.status(200).json({ message: 'All users deleted successfully' });
  } catch (error: any) {
    next(error);
  }
});

export default router;
