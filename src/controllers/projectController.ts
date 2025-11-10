// src/controllers/projectController.ts
import { Request, Response } from "express";
import * as projectService from "../service/projectService";
import { NewProject } from "../types/project.types";

// Create project
export const createProject = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const created_by = req.user?.id;

  if (!name) return res.status(400).json({ message: "Project name is required" });

  try {
    const project = await projectService.createProject({ name, description, created_by: created_by! });
    return res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error);
    return res.status(500).json({ message: "Error creating project" });
  }
};

// List projects
export const listProjects = async (req: Request, res: Response) => {
  try {
    const projects = await projectService.listProjects();
    return res.status(200).json(projects);
  } catch (error) {
    console.error("List projects error:", error);
    return res.status(500).json({ message: "Error fetching projects" });
  }
};

// Assign user to project
export const addUserToProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { userId, role } = req.body;

  if (!userId) return res.status(400).json({ message: "User ID is required" });

  try {
    const member = await projectService.addUserToProject(parseInt(projectId), userId, role);
    return res.status(201).json(member);
  } catch (error) {
    console.error("Add user to project error:", error);
    return res.status(500).json({ message: "Error adding user to project" });
  }
};

// Remove user from project
export const removeUserFromProject = async (req: Request, res: Response) => {
  const { projectId, userId } = req.params;

  try {
    await projectService.removeUserFromProject(parseInt(projectId), parseInt(userId));
    return res.status(200).json({ message: "User removed from project" });
  } catch (error) {
    console.error("Remove user from project error:", error);
    return res.status(500).json({ message: "Error removing user from project" });
  }
};
