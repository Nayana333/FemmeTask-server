import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
// import { connectDB } from "./config/db.config";
// import authRoutes from "./routes/auth.routes";
// import todoRoutes from "./routes/todo.routes";

dotenv.config();
// connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

// app.use("/api/auth", authRoutes);
// app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
