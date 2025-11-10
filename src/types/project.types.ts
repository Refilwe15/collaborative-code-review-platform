

export interface Project {
  id: number;
  name: string;
  description?: string;
  created_by: number;
  created_at?: Date;
}

export type NewProject = Omit<Project, 'id' | 'created_at'>;

export interface ProjectMember {
  project_id: number;
  user_id: number;
  role: 'reviewer' | 'submitter';
}
