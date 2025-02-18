

import { createCustomCategory, getCustomCategories } from "../controllers/customCategoryController.js"
import express from 'express';
import { authenticateJwt } from '../middleware/authMiddleware.js'; 
const router = express.Router()

router.post("/custom/create", authenticateJwt, createCustomCategory); // Create a new custom category  
router.get("/custom/list", authenticateJwt, getCustomCategories); // Get all custom categories  


export default router;

