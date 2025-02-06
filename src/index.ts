import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoute";
import todoRoutes from "./routes/todoRoute";

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); 
app.use(cors());
app.use(helmet());

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
