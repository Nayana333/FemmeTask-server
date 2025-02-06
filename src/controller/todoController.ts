import { Request, Response } from "express";
import { Todo } from "../model/todoModel";
import mongoose from "mongoose";

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    const userId = req.userId; 

    if (!title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const newTodo = new Todo({
      title,
      description,
      user: userId,
    });

    await newTodo.save();
    res.status(201).json({ message: "Todo created successfully", todo: newTodo });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Failed to create todo" });
  }
};

export const getAllTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const todos = await Todo.find({ user: userId });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

export const getTodoById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id.trim(); 
      const userId = req.userId; 
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid Todo ID" });
        return;
      }
  
      const todo = await Todo.findOne({ _id: id, user: userId });
  
      if (!todo) {
        res.status(404).json({ error: "Todo not found or unauthorized" });
        return;
      }
  
      res.json(todo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch todo" });
    }
  };

  export const updateTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id.trim(); 
      const { title, description, completed } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid Todo ID" });
        return;
      }
  
      const updatedTodo = await Todo.findOneAndUpdate(
        { _id: id, user: req.userId },
        { title, description, completed },
        { new: true }
      );
  
      if (!updatedTodo) {
        res.status(404).json({ error: "Todo not found or unauthorized" });
        return;
      }
  
      res.json({ message: "Todo updated successfully", todo: updatedTodo });
    } catch (error) {
      console.error("Error updating todo:", error);
      res.status(500).json({ error: "Failed to update todo" });
    }
  };

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id.trim(); 
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid Todo ID" });
        return;
      }
  
      const deletedTodo = await Todo.findOneAndDelete({ _id: id, user: req.userId });
  
      if (!deletedTodo) {
        res.status(404).json({ error: "Todo not found or unauthorized" });
        return;
      }
  
      res.json({ message: "Todo deleted successfully" });
    } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(500).json({ error: "Failed to delete todo" });
    }
  };
  

export const toggleTodoCompletion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOne({ _id: id, user: req.userId });

    if (!todo) {
      res.status(404).json({ error: "Todo not found or unauthorized" });
      return;
    }

    todo.completed = !todo.completed; 
    await todo.save();

    res.json({ message: `Todo marked as ${todo.completed ? "completed" : "incomplete"}`, todo });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Failed to update todo status" });
  }
};
