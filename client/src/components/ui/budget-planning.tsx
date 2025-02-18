/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import axios from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Budget {
  id: string
  amount: number
  period: string
  category: { id: string; name: string } | null
}

interface Category {
  id: string
  name: string
}

export default function BudgetPlanning() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [newBudget, setNewBudget] = useState({ amount: "", period: "monthly", categoryId: "" })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBudgets()
    fetchCategories()
  }, [])

  const fetchBudgets = async () => {
    try {
      const response = await axios.get("/budgets/list")
      setBudgets(response.data)
    } catch (err) {
      setError("Failed to fetch budgets")
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/custom-categories/custom/list")
      setCategories(response.data)
    } catch (err) {
      setError("Failed to fetch categories")
    }
  }

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post("/budgets/create", newBudget)
      setBudgets([...budgets, response.data])
      setNewBudget({ amount: "", period: "monthly", categoryId: "" })
    } catch (err) {
      setError("Failed to add budget")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Planning</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddBudget} className="space-y-4">
          <Input
            type="number"
            value={newBudget.amount}
            onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
            placeholder="Budget amount"
          />
          <Select value={newBudget.period} onValueChange={(value) => setNewBudget({ ...newBudget, period: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={newBudget.categoryId}
            onValueChange={(value) => setNewBudget({ ...newBudget, categoryId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">Add Budget</Button>
        </form>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="mt-4 space-y-4">
          {budgets.map((budget) => (
            <div key={budget.id} className="border p-4 rounded">
              <h3 className="text-lg font-semibold">{budget.category ? budget.category.name : "Overall"} Budget</h3>
              <p>Amount: ${budget.amount}</p>
              <p>Period: {budget.period}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

