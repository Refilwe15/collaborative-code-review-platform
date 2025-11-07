import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "../models/userModel";

const generateToken = (id: number, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

export const register = async (req: Request, res: Response) => {
    const { email, password, name, role, display_picture } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await findUserByEmail(email);
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await createUser(email, password, name, role, display_picture);
    const token = generateToken(user.id, user.role);

    res.status(201).json({ user, token });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id, user.role);
    res.json({ user, token });
};
