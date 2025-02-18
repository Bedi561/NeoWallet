import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export const createBudget = async (req, res) => {
  const { amount, period, customCategoryId } = req.body
  const userId = req.user.id

  try {
    const budget = await prisma.budget.create({
      data: { amount, period, customCategoryId, userId },
    })
    res.status(201).json(budget)
  } catch (error) {
    res.status(500).json({ message: "Failed to create budget", error: error.message })
  }
}

export const getBudgets = async (req, res) => {
  const userId = req.user.id

  try {
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: { customCategory: true },
    })
    res.status(200).json(budgets)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch budgets", error: error.message })
  }
}

