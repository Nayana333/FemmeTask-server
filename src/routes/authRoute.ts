import express from "express";
import { registerUser, loginUser, refreshToken, logoutUser } from "../controller/authController";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/refresh", refreshToken);

router.post("/logout", logoutUser);



export default router;
