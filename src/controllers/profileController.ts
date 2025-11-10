import { Request, Response } from "express";
import { findUserById, updateUserProfile, deleteUser } from "../service/userService";

export const getMyProfile = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user attached" });
        }

        const user = await findUserById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { password_hash, ...profile } = user;
        return res.status(200).json(profile);

    } catch (error) {
        console.error("Get profile error:", error);
        return res.status(500).json({ message: "Error fetching profile" });
    }
};

export const updateMyProfile = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user attached" });
        }

        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Nothing to update" });
        }

        const updatedUser = await updateUserProfile(req.user.id, { name });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const { password_hash, ...profile } = updatedUser;
        return res.status(200).json({ message: "Profile updated", profile });

    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({ message: "Error updating profile" });
    }
};

export const deleteMyAccount = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user attached" });
        }

        await deleteUser(req.user.id);
        return res.status(200).json({ message: "Account deleted successfully" });

    } catch (error) {
        console.error("Delete profile error:", error);
        return res.status(500).json({ message: "Error deleting account" });
    }
};
