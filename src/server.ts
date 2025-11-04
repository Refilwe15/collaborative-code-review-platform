import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testDbConnection } from "./config/database";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "API Running ✅" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  testDbConnection();
  console.log(`Server running on port ${PORT} ✅`);
});
