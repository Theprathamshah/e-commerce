import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/signup', async(req: Request, res: Response) => {
  console.log(`request is ${req}`);

  const { firstName, lastName, email, username, birthday, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,lastName,role,username,email,birthday,password : hashedPassword
    });

    return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async(req: Request, res: Response) => {
  console.log(`Request is ${req}`);

  const { email, password } = req.body;
  console.log(`Email and password ${email} ${password}`);

  try {
    const user = await User.findOne({ where: { email } });
    console.log(`User is ${JSON.stringify(user)}`)
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, `${process.env.JWT_SECRET}`, { expiresIn: '5h' });

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
