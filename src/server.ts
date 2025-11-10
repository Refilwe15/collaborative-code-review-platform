import express from "express";
import dotenv from "dotenv";
import { testDbConnection } from "./config/database";
import { authRoutes } from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

const startServer = async () => {
    await testDbConnection();

    app.listen(8080, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();
