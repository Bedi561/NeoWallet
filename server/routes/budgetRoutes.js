
import express from 'express';
import { authenticateJwt } from '../middleware/authMiddleware.js'; 
const router = express.Router()
import { createBudget, getBudgets } from "../controllers/budgetController.js"

router.post("/create", authenticateJwt, createBudget); // Create a new budget  
router.get("/list", authenticateJwt, getBudgets); // Get all budgets  


export default router;
