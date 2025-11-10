// src/service/userService.ts
import { query } from "../config/database";
import bcrypt from "bcryptjs";
import { User } from "../types/user.types";

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const { rows } = await query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0] || null;
};

export const findUserById = async (id: number): Promise<User | null> => {
  const { rows } = await query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0] || null;
};

export const createUser = async (
  email: string,
  password: string,
  name?: string
): Promise<User> => {
  const password_hash = await bcrypt.hash(password, 10);
  const { rows } = await query(
    `INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING *`,
    [email, password_hash, name || null]
  );
  return rows[0];
};

export const updateUserProfile = async (
  id: number,
  updates: { name?: string; email?: string }
): Promise<User | null> => {
  // Only update provided fields
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (updates.name !== undefined) {
    fields.push(`name = $${idx++}`);
    values.push(updates.name);
  }
  if (updates.email !== undefined) {
    fields.push(`email = $${idx++}`);
    values.push(updates.email);
  }
  if (fields.length === 0) {
    return findUserById(id);
  }
  values.push(id);
  const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
  const { rows } = await query(sql, values);
  return rows[0] || null;
};

export const updateUserAvatar = async (id: number, avatarUrl: string): Promise<User | null> => {
  const { rows } = await query(
    `UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING *`,
    [avatarUrl, id]
  );
  return rows[0] || null;
};
export const updateUser = async (
    id: number,
    updates: { name?: string; email?: string }
): Promise<User | null> => {
    const fields = [];
    const values: any[] = [];
    let index = 1;

    if (updates.name !== undefined) {
        fields.push(`name = $${index++}`);
        values.push(updates.name);
    }

    if (updates.email !== undefined) {
        fields.push(`email = $${index++}`);
        values.push(updates.email);
    }

    if (fields.length === 0) return findUserById(id);

    values.push(id);

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`;
    const { rows } = await query(sql, values);
    return rows[0] || null;
};
export const deleteUser = async (id: number): Promise<void> => {
  await query("DELETE FROM users WHERE id = $1", [id]);
};

