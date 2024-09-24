import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ValidationError, UnauthorizedError } from '../errors/CustomError.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils.js';

dotenv.config();

const router = express.Router();

router.post('/signup', async(req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, username, birthday, password, role } = req.body;

  try {
    if (!firstName || !lastName || !email || !username || !password || !role) {
      throw new ValidationError('All fields are required');
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new ValidationError('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      role,
      username,
      email,
      birthday,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async(req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/token', async(req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET!);

    const newAccessToken = generateAccessToken((decoded as any).id, (decoded as any).role);

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
});

export default router;
