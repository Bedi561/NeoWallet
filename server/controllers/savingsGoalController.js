import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export const createSavingsGoal = async (req, res) => {
  const { name, targetAmount, deadline } = req.body
  const userId = req.user.userId;

  console.log('Request received to create savings goal:')
  console.log('Request Body:', req.body)
  console.log('User ID:', userId)

  if (!userId) {
    console.log('Error: No user ID found in request')
    return res.status(400).json({ message: 'User not authenticated' })
  }

  const deadlineDate = new Date(deadline);

  // Check if the deadline is a valid date
  if (isNaN(deadlineDate)) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  console.log("Creating savings goal with the following data:", {
    name,
    targetAmount,
    deadline: deadlineDate,
    userId,
  });

  try {
    const savingsGoal = await prisma.savingsGoal.create({
      data: { name, targetAmount, deadline: deadlineDate, userId },
    });
    res.status(201).json(savingsGoal);
  } catch (error) {
    console.error("Error creating savings goal:", error);
    res.status(500).json({ message: "Failed to create savings goal", error: error.message });
  }
}


export const getSavingsGoals = async (req, res) => {
  const userId = req.user.id

  try {
    const savingsGoals = await prisma.savingsGoal.findMany({
      where: { userId },
    })
    res.status(200).json(savingsGoals)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch savings goals", error: error.message })
  }
}

export const updateSavingsGoal = async (req, res) => {
  const { id } = req.params
  const { currentAmount } = req.body
  const userId = req.user.id

  try {
    const updatedGoal = await prisma.savingsGoal.update({
      where: { id, userId },
      data: { currentAmount },
    })
    res.status(200).json(updatedGoal)
  } catch (error) {
    res.status(500).json({ message: "Failed to update savings goal", error: error.message })
  }
}

