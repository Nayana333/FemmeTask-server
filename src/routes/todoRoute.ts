import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
   createTodo,
  // getAllTodos,
  getTodoById,
  // updateTodo,
  deleteTodo,
  toggleTodoCompletion,
} from "../controller/todoController";

const router = express.Router();

router.post("/addTodo",authMiddleware,createTodo); 
// router.get("/getAllTodo", authMiddleware, getAllTodos); 
router.get("/getTodo/:userId", authMiddleware, getTodoById); 
// router.put("/updateTodo/:id", authMiddleware, updateTodo); 
router.delete("/deleteTodo/:id", deleteTodo); 
router.patch("/markAsCompleted/:todoId", authMiddleware, toggleTodoCompletion); 

export default router;
