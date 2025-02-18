import express from 'express';
import {
  createWallet,
  getWallet,
  updateBalance,
  addTransaction,
  getTransactions,
  addmoney
} from '../controllers/walletController.js'; // Import the wallet controller functions
import { authenticateJwt } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/wallet', createWallet);
router.post('/addMoney', authenticateJwt,addmoney);
router.get('/wallet/:userId', getWallet);
router.post('/transaction', addTransaction);
router.get('/transactions/:walletId', getTransactions);

export default router;
