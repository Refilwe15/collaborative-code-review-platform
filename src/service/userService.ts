import { query } from "../config/database";
import bcrypt from "bcrypt";
import { User } from "../types/user.types";

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const { rows } = await query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    return rows[0] || null;
};

export const createUser = async (
    email: string,
    password: string,
    name: string,
    role: string = "user"
): Promise<User> => {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { rows } = await query(
        `INSERT INTO users (email, password_hash, name, role, display_picture)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, email, name, role, display_picture, created_at
`,
        [email, password_hash, name, role]
    );

    return rows[0];
};
