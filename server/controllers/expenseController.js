import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export const createExpense = async (req, res) => {
  const { amount, description, splitWithIds } = req.body
  const paidById = req.user.id

  try {
    const expense = await prisma.expense.create({
      data: {
        amount,
        description,
        paidById,
        splitWith: {
          connect: splitWithIds.map((id) => ({ id })),
        },
      },
    })
    res.status(201).json(expense)
  } catch (error) {
    res.status(500).json({ message: "Failed to create expense", error: error.message })
  }
}

export const getExpenses = async (req, res) => {
  const userId = req.user.id

  try {
    const expenses = await prisma.expense.findMany({
      where: {
        OR: [{ paidById: userId }, { splitWith: { some: { id: userId } } }],
      },
      include: {
        paidBy: true,
        splitWith: true,
      },
    })
    res.status(200).json(expenses)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses", error: error.message })
  }
}

