import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'; 
import walletRoutes from './routes/walletRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import customCategoryRoutes from './routes/customCategoryRoutes.js';
import savingsGoalRoutes from './routes/savingsGoalRoutes.js'
import budgetRoutes from './routes/budgetRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import { authenticateJwt } from './middleware/authMiddleware.js'; 
import cors from 'cors'; 

dotenv.config(); 

const app = express();


app.use(express.json()); 
app.use(cors({
  origin: '*',
  credentials: true
}));


app.use('/api/users', userRoutes); 
app.use('/api/walletStuff', walletRoutes);
app.use('/api/transaction', transactionRoutes);
app.use("/api/custom-categories", customCategoryRoutes)
app.use("/api/savings-goals", savingsGoalRoutes)
app.use("/api/budgets", budgetRoutes)
app.use("/api/expenses", expenseRoutes)


app.get('/', (req, res) => {
  res.send('Welcome to the React Native Wallet API!');
});


const PORT =  3000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
