import { register, login, getProfile, updateProfile } from "../controllers/authControllers";
import { protect } from "../middleware/authMiddleware";
import router from "./profileRoutes";

export { router as authRoutes };

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
