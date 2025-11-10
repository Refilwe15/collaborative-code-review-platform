import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
    getMyProfile,
    updateMyProfile,
    deleteMyAccount
} from "../controllers/profileController";

const router = Router();

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.delete("/me", protect, deleteMyAccount);

export default router;
