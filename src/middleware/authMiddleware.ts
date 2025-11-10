// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserById, updateUser } from "../service/userService";
import { User } from "../types/user.types";

interface JwtPayload {
  userId: number;
  email: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      const user: User | null = await findUserById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error("auth error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const { password_hash, ...safeUser } = req.user;
    return res.status(200).json({ user: safeUser });
};


export const updateProfile = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const { name, email } = req.body;

    try {
        const updated = await updateUser(req.user.id, { name, email });

        if (!updated) {
            return res.status(500).json({ message: "Failed to update profile" });
        }

        const { password_hash, ...safeUser } = updated;
        return res.status(200).json({ message: "Profile updated", user: safeUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating profile" });
    }
};

