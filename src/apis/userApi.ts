import { Router, Request, Response } from 'express';
import User from '../models/user.js';

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

// Get all users
router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error:any) {
        res.status(500).json({ error: error.message });
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
router.delete('/', async (req: Request, res: Response) => {
    try {
        await User.destroy({ where: {} });
        res.status(200).json({ message: 'All users deleted successfully' });
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
