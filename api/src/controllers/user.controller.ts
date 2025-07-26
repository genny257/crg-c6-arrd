// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const registerSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis."),
  lastName: z.string().min(2, "Le nom de famille est requis."),
  email: z.string().email("L'adresse e-mail est invalide."),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères."),
  phone: z.string().optional(),
  // Add other fields from your full registration form here for validation
});

const loginSchema = z.object({
  email: z.string().email("L'adresse e-mail est invalide."),
  password: z.string().min(1, "Le mot de passe est requis."),
});


/**
 * Registers a new user.
 * @param {Request} req - The Express request object, containing the user's data in the body.
 * @param {Response} res - The Express response object.
 * @returns {Response} A response indicating the result of the registration.
 */
export const register = async (req: Request, res: Response) => {
    console.log("Registration attempt received. Body:", JSON.stringify(req.body, null, 2));
    try {
        const validatedData = registerSchema.parse(req.body);
        const user = await userService.createUser(validatedData);
        console.log("User created successfully:", user.id);
        res.status(201).json({ message: "User created successfully", userId: user.id, matricule: user.matricule });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        console.error("Error during user creation:", error);
        res.status(500).json({ message: 'Error creating user', error: (error as Error).message });
    }
};

/**
 * Logs in a user.
 * @param {Request} req - The Express request object, containing the user's credentials.
 * @param {Response} res - The Express response object.
 * @returns {Response} A response with the user's data and a JWT token if successful.
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
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
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
    }
};

/**
 * Retrieves all users.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} A response containing a list of all users.
 */
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
}
