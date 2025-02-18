import express from 'express';
import { createTransaction, getTransactions, getTransactionDetail} from '../controllers/transactionController.js'; // Import controller functions
import { authenticateJwt } from '../middleware/authMiddleware.js'; // Import authentication middleware

const router = express.Router();


router.post('/transactionDone', authenticateJwt, createTransaction);
router.get('/transactions/:walletId', authenticateJwt, getTransactions);
router.get('/transactionDetails/:transactionId', authenticateJwt, getTransactionDetail);

export default router;
