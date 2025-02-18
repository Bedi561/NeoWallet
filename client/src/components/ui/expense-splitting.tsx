/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import axios from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string
  username: string
}

interface Expense {
  id: string
  amount: number
  description: string
  paidBy: User
  splitWith: User[]
}

interface NewExpense {
  amount: string
  description: string
  splitWithIds: string[]
}

export default function ExpenseSplitting() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [newExpense, setNewExpense] = useState<NewExpense>({ amount: "", description: "", splitWithIds: [] })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchExpenses()
    fetchUsers()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("/expenses/list")
      setExpenses(response.data)
    } catch (err) {
      setError("Failed to fetch expenses")
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/users")
      setUsers(response.data)
    } catch (err) {
      setError("Failed to fetch users")
    }
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post("/expenses/create", newExpense)
      setExpenses([...expenses, response.data])
      setNewExpense({ amount: "", description: "", splitWithIds: [] })
    } catch (err) {
      setError("Failed to add expense")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Split Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddExpense} className="space-y-4">
          <Input
            type="number"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            placeholder="Expense amount"
          />
          <Input
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            placeholder="Expense description"
          />
          <Select
            value={newExpense.splitWithIds.join(",")}
            onValueChange={(value) => setNewExpense({ ...newExpense, splitWithIds: value.split(",") })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Split with" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">Add Expense</Button>
        </form>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="mt-4 space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="border p-4 rounded">
              <h3 className="text-lg font-semibold">{expense.description}</h3>
              <p>Amount: ${expense.amount}</p>
              <p>Paid by: {expense.paidBy.username}</p>
              <p>Split with: {expense.splitWith.map((u) => u.username).join(", ")}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

