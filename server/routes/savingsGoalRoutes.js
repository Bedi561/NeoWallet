import { createSavingsGoal, getSavingsGoals, updateSavingsGoal } from "../controllers/savingsGoalController.js"
import express from 'express';
import { authenticateJwt } from '../middleware/authMiddleware.js'; 

const router = express.Router()

router.post("/create", authenticateJwt, createSavingsGoal); // Create a new savings goal  
router.get("/list", authenticateJwt, getSavingsGoals); // Get all savings goals  
router.put("/update/:id", authenticateJwt, updateSavingsGoal); // Update a specific savings goal  


export default router;

