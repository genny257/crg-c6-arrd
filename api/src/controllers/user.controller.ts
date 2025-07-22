// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({ message: "User created successfully", userId: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await userService.findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your_default_secret',
            { expiresIn: '1h' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({ user: userWithoutPassword, token });

    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
}
