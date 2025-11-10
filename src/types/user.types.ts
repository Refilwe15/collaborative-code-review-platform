
export interface User {
  id: number;
  email: string;
  password_hash: string;
  name?: string | null;
  avatar_url?: string | null;
  created_at?: Date;
}
