import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Users } from "../model/userModel";
import dotenv from 'dotenv';
dotenv.config();


const generateAccessToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
};

export const generateRefreshToken = (userId: string): string => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
  
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  };
  

let refreshTokens: string[] = [];

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, profession } = req.body;

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await Users.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);   
    res.status(500).json({ error: "User registration failed" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    refreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken, user: { id: user._id.toString(), name: user.name, email: user.email } });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Login failed" });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      res.status(401).json({ error: "Refresh token required" });
      return;
    }
  
    if (!refreshTokens.includes(refreshToken)) {
      res.status(403).json({ error: "Invalid refresh token" });
      return;
    }
  
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: any, user: any) => {
      if (err) {
        res.status(403).json({ error: "Invalid refresh token" });
        return;
      }
  
      const newAccessToken = generateAccessToken(user.id);
      res.json({ accessToken: newAccessToken });
    });
  };
  

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token);
  res.json({ message: "Logged out successfully" });
};
