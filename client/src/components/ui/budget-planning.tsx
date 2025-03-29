/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import axios from "@/lib/axios"
import { Plus, DollarSign, CalendarDays, Tag, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchBudgets()
    fetchCategories()
  }, [])

  const fetchBudgets = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("/budgets/list")
      setBudgets(response.data)
    } catch (err) {
      setError("Failed to fetch budgets")
    } finally {
      setIsLoading(false)
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
    
    if (!newBudget.amount || !newBudget.categoryId) {
      setError("Please fill in all required fields")
      return
    }
    
    try {
      setIsLoading(true)
      const response = await axios.post("/budgets/create", newBudget)
      setBudgets([...budgets, response.data])
      setNewBudget({ amount: "", period: "monthly", categoryId: "" })
      setError(null)
    } catch (err) {
      setError("Failed to add budget")
    } finally {
      setIsLoading(false)
    }
  }

  const getPeriodColor = (period: string) => {
    switch (period) {
      case "weekly": return "bg-blue-100 text-blue-800"
      case "monthly": return "bg-green-100 text-green-800"
      case "yearly": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">Budget Planning</CardTitle>
        <CardDescription>Create and manage your spending limits by category</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleAddBudget} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                  placeholder="0.00"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="period" className="text-sm font-medium">
                Time Period
              </label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                <Select 
                  value={newBudget.period} 
                  onValueChange={(value) => setNewBudget({ ...newBudget, period: value })}
                >
                  <SelectTrigger id="period" className="pl-10">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                <Select
                  value={newBudget.categoryId}
                  onValueChange={(value) => setNewBudget({ ...newBudget, categoryId: value })}
                >
                  <SelectTrigger id="category" className="pl-10">
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
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full sm:w-auto flex items-center gap-2"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" /> 
            {isLoading ? 'Adding...' : 'Add Budget'}
          </Button>
        </form>
        
        <Separator className="my-6" />
        
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-4">Your Budgets</h3>
          
          {budgets.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No budgets created yet. Add your first budget above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgets.map((budget) => (
                <div 
                  key={budget.id} 
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">
                      {budget.category ? budget.category.name : "Overall Budget"}
                    </h3>
                    <Badge className={getPeriodColor(budget.period)}>
                      {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatCurrency(budget.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}