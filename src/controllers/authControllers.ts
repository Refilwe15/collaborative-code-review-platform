import { Request, Response } from "express";
import * as userService from "../service/userService";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const register = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "Email is already in use" });
        }

        const user = await userService.createUser(email, password, name);

        return res.status(201).json({
            message: "User registered successfully",
            userId: user.id
        });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Error registering the user" });
    }
};

// ✅ LOGIN
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await userService.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const payload = {
            userId: user.id,
            email: user.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: "1h",
        });

        return res.status(200).json({
            message: "Login successful",
            token,
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Error logging in" });
    }
};

// ✅ GET PROFILE
export const getProfile = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const { password_hash, ...safeUser } = req.user;
    return res.status(200).json({ user: safeUser });
};

//  UPDATE PROFILE (name + email)
export const updateProfile = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const { name, email } = req.body;

    try {
        // Ensure email is unique if being changed
        if (email && email !== req.user.email) {
            const existingUser = await userService.findUserByEmail(email);
            if (existingUser && existingUser.id !== req.user.id) {
                return res.status(409).json({ message: "Email is already in use" });
            }
        }

        const updatedUser = await userService.updateUser(req.user.id, { name, email });

        if (!updatedUser) {
            return res.status(500).json({ message: "Failed to update profile" });
        }

        const { password_hash, ...safeUser } = updatedUser;
        return res.status(200).json({
            message: "Profile updated",
            user: safeUser
        });

    } catch (error) {
        console.error("Profile Update Error:", error);
        return res.status(500).json({ message: "Error updating profile" });
    }
};
