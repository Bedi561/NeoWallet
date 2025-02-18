import { createExpense, getExpenses } from "../controllers/expenseController.js"
import express from 'express';
import { authenticateJwt } from '../middleware/authMiddleware.js'; 
const router = express.Router()

router.post("/create", authenticateJwt, createExpense); // Create a new expense  
router.get("/list", authenticateJwt, getExpenses); // Get all expenses  


export default router;

