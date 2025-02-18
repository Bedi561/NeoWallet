import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createWallet = async (req, res) => {
  const { userId } = req.body;

  console.log('Received request to create wallet with userId:', userId); // Log userId for debugging

  if (!userId) {
      console.error('User ID is missing in the request body.');
      return res.status(400).json({ message: 'User ID is required to create a wallet.' });
  }

  try {
      // Log before creating the wallet
      console.log('Creating wallet for userId:', userId);

      const wallet = await prisma.wallet.create({
          data: {
              userId,
              balance: 0, // Set initial balance to 0 (if that's required)
          },
      });

      console.log('Wallet created successfully:', wallet); // Log wallet creation result
      res.status(201).json(wallet);
  } catch (err) {
      console.error('Error creating wallet:', err); // Log the error for debugging
      res.status(500).json({ message: 'Something went wrong while creating the wallet.' });
  }
};
export const getWallet = async (req, res) => {
  const { userId } = req.params;
  
  console.log(`Received request for wallet with userId: ${userId}`);

  try {
    // Querying the wallet using Prisma
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: { transactions: true }, // Include transactions for the user
    });

    // Log if wallet is found
    if (wallet) {
      console.log('Wallet found:', wallet);
    } else {
      console.log('No wallet found for userId:', userId);
    }

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found.' });
    }

    res.status(200).json(wallet);
  } catch (error) {
    // Log error details
    console.error('Error fetching wallet:', error);
    res.status(500).json({ message: 'Something went wrong while fetching wallet.' });
  }
};


export const updateBalance = async (walletId, amount, type) => {
    let balanceChange = 0;
  
    if (type === 'send') {
      balanceChange = -amount; 
    } else if (type === 'receive') {
      balanceChange = amount; // 
    }
  
    await prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: {
          increment: balanceChange, // Use increment for both increment and decrement 
        },
      },
    });
  };
  
  //(handles both send/receive)
  export const addTransaction = async (req, res) => {
    const { walletId, type, amount, category } = req.body;
  
    if (!walletId || !type || !amount || !category) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
  
    try {
      const transaction = await prisma.transaction.create({
        data: {
          walletId,
          type, // 'send' or 'receive'
          amount,
          category,
        },
      });
  
      await updateBalance(walletId, amount, type);
  
      res.status(201).json(transaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while adding transaction.' });
    }
  };



// Get all transactions of a wallet
export const getTransactions = async (req, res) => {
    const { walletId } = req.params;
  
    try {
      const transactions = await prisma.transaction.findMany({
        where: { walletId },
        orderBy: { createdAt: 'desc' },
      });
  
      res.status(200).json(transactions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while fetching transactions.' });
    }
  };


export const addmoney = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.userId;

  try {
    const updatedWallet = await prisma.wallet.update({
      where: { userId: userId },
      data: {
        balance: {
          increment: amount
        }
      }
    });

    res.status(200).json({ message: 'Money added successfully', wallet: updatedWallet });
  } catch (error) {
    console.error('Error adding money to wallet:', error);
    res.status(500).json({ message: 'Failed to add money to wallet' });
  }
};