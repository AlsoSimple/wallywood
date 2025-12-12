import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

export const register = async (req: Request, res: Response) => {
  try {
    console.log('Register request body:', req.body);
    const { firstname, lastname, email, password, role } = req.body;

    // Validate required fields
    if (!firstname || !email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['firstname', 'email', 'password'],
        received: { firstname, email, password: password ? 'provided' : 'missing' }
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role: if 'RANDOM' or not provided, randomly assign; otherwise use provided value
    let userRole: 'USER' | 'ADMIN';
    if (!role || role === 'RANDOM') {
      userRole = Math.random() < 0.5 ? 'USER' : 'ADMIN';
    } else {
      userRole = role === 'ADMIN' ? 'ADMIN' : 'USER';
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname: lastname || '',
        email,
        password: hashedPassword,
        role: userRole,
        isActive: true,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Error creating user',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};
