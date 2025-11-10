// src/routes/projectRoutes.ts
import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  createProject,
  listProjects,
  addUserToProject,
  removeUserFromProject
} from "../controllers/projectController";

const router = Router();

router.post("/", protect, createProject);
router.get("/", protect, listProjects);
router.post("/:projectId/members", protect, addUserToProject);
router.delete("/:projectId/members/:userId", protect, removeUserFromProject);


export default router;
