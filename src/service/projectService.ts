
import { query } from "../config/database";
import { Project, NewProject, ProjectMember } from "../types/project.types";

// Create a project
export const createProject = async (project: NewProject): Promise<Project> => {
  const { name, description, created_by } = project;
  const { rows } = await query(
    `INSERT INTO projects (name, description, created_by)
     VALUES ($1, $2, $3) RETURNING *`,
    [name, description || null, created_by]
  );
  return rows[0];
};

// List all projects
export const listProjects = async (): Promise<Project[]> => {
  const { rows } = await query(`SELECT * FROM projects ORDER BY created_at DESC`);
  return rows;
};

// Assign user to project
export const addUserToProject = async (project_id: number, user_id: number, role: 'reviewer' | 'submitter' = 'submitter'): Promise<ProjectMember> => {
  const { rows } = await query(
    `INSERT INTO project_members (project_id, user_id, role)
     VALUES ($1, $2, $3) RETURNING *`,
    [project_id, user_id, role]
  );
  return rows[0];
};

// Remove user from project
export const removeUserFromProject = async (project_id: number, user_id: number): Promise<void> => {
  await query(`DELETE FROM project_members WHERE project_id = $1 AND user_id = $2`, [project_id, user_id]);
};
