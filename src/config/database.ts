import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const testDbConnection = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("DB Connected:", res.rows[0]);
  } catch (error) {
    console.error("DB Connection Error", error);
  }
};
