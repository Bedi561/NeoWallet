import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTransaction = async (req, res) => {
  console.log('Received transaction request:', req.body);
  const { walletId, type, amount, category, recipient } = req.body; // Added recipient

  try {
      // Fetch the wallet details using walletId
      const wallet = await prisma.wallet.findUnique({
          where: { id: walletId },
      });

      if (!wallet) {
          return res.status(404).json({ message: "Wallet not found" });
      }

      let recipientUser = null;

      if (type === "send") {
          if (!recipient) {
              return res.status(400).json({ message: "Recipient is required for sending money" });
          }

          // Check if the recipient exists in the User table
          recipientUser = await prisma.user.findUnique({
              where: { email: recipient },
          });

          if (!recipientUser) {
              return res.status(404).json({ message: "Recipient user not found" });
          }

          if (wallet.balance < amount) {
              return res.status(400).json({ message: "Insufficient balance" });
          }

          // Deduct amount from sender's wallet
          await prisma.wallet.update({
              where: { id: walletId },
              data: { balance: wallet.balance - amount },
          });

          // Find recipient's wallet using the recipient's user ID
          const recipientWallet = await prisma.wallet.findFirst({
              where: { userId: recipientUser.id }, // Assuming wallet is linked to userId
          });

          if (!recipientWallet) {
              return res.status(404).json({ message: "Recipient wallet not found" });
          }

          // Add amount to recipient's wallet
          await prisma.wallet.update({
              where: { id: recipientWallet.id },
              data: { balance: recipientWallet.balance + amount },
          });
      } else if (type === "receive") {
          // If it's a receive transaction, simply add to sender's wallet
          await prisma.wallet.update({
              where: { id: walletId },
              data: { balance: wallet.balance + amount },
          });
      } else {
          return res.status(400).json({ message: "Invalid transaction type" });
      }

      // Create the transaction record
      const transaction = await prisma.transaction.create({
          data: {
              walletId,
              type,
              amount,
              category,
              recipientId: recipientUser ? recipientUser.id : null, // Use recipient's user ID
          },
      });

      // Respond with success message and transaction data
      res.status(201).json({ message: "Transaction successful", transaction });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
  }
};



export const getTransactions = async (req, res) => {
  console.log("GET /transactions/:walletId endpoint hit");
  console.log("Request params:", req.params);
  const { walletId } = req.params;
  console.log("Extracted walletId:", walletId);

  try {
    console.log("Attempting to fetch transactions from database for walletId:", walletId);
    const transactions = await prisma.transaction.findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
    });
    
    console.log(`Found ${transactions.length} transactions`);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: 'Something went wrong while fetching transactions.' });
  }
};



// getTransactionDetail.js (or wherever your logic is defined)
export const getTransactionDetail = async (req, res) => {
  const { transactionId } = req.params;

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        wallet: true, // Optionally include wallet details
        recipient: true, // Include recipient user info for 'send' type transactions
        sender: true, // Include sender user info for 'receive' type transactions
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction); // Send the full transaction details
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
