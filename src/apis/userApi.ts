import { authenticateUser } from './../middlewares/authenticateUser.js';
import { Router, Request, Response } from 'express';
import User from '../models/user.js';
import { checkAdmin } from '../middlewares/isAdmin.js';
import { UserResponse } from '../types/UserResponse.js';

const router = Router();

// Create a new user
router.post('/create', async (req: Request, res: Response) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', authenticateUser, checkAdmin, async (req, res) => {
    console.log('Called fetch all api')
    try {
        const users = await User.findAll();
        const usersJson = users.map(user => {
          const userJson = user.toJSON() as UserResponse;
          if (userJson.password) {  // Check if password exists
            delete userJson.password;
          }
          return userJson;
        });
        res.json(usersJson);
      } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
      }
  });
  
  // Get user by ID (admin only)
  router.get('/:id',authenticateUser, checkAdmin, async (req, res) => {
     try {
    const users = await User.findAll();
    const usersJson = users.map(user => {
      const userJson = user.toJSON() as any;
      if (userJson.password) {  // Check if password exists
        delete userJson.password;
      }
      return userJson;
    });
    res.json(usersJson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
  });
// Update user by ID
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update(req.body);
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user by ID
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});

// Delete all users
router.delete('/',authenticateUser,checkAdmin, async (req: Request, res: Response) => {
    try {
        await User.destroy({ where: {} });
        res.status(200).json({ message: 'All users deleted successfully' });
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
