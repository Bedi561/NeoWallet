import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export const createCustomCategory = async (req, res) => {
  const { name } = req.body
  const userId = req.user.id

  try {
    const customCategory = await prisma.customCategory.create({
      data: { name, userId },
    })
    res.status(201).json(customCategory)
  } catch (error) {
    res.status(500).json({ message: "Failed to create custom category", error: error.message })
  }
}

export const getCustomCategories = async (req, res) => {
  const userId = req.user.id

  try {
    const customCategories = await prisma.customCategory.findMany({
      where: { userId },
    })
    res.status(200).json(customCategories)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch custom categories", error: error.message })
  }
}

