"use client"

import { useState, useEffect } from "react"
import axios from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown, PiggyBank, Info, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
}

const categories = [
  { value: "emergency", label: "Emergency Fund" },
  { value: "retirement", label: "Retirement" },
  { value: "house", label: "House Down Payment" },
  { value: "car", label: "Car Purchase" },
  { value: "education", label: "Education" },
  { value: "vacation", label: "Vacation" },
  { value: "wedding", label: "Wedding" },
  { value: "health", label: "Health Insurance" },
  { value: "investment", label: "Investment" },
  { value: "debt", label: "Debt Repayment" },
  { value: "other", label: "Other" },
]

export default function SavingsGoal() {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [newGoal, setNewGoal] = useState({ name: "", targetAmount: 0, deadline: "", category: "" })
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [addMoneyAmount, setAddMoneyAmount] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const response = await axios.get("/savings-goals/list")
      setGoals(response.data)
    } catch (err) {
      setError("Failed to fetch savings goals")
    }
  }

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post("/savings-goals/create", newGoal)
      setGoals([...goals, response.data])
      setNewGoal({ name: "", targetAmount: 0, deadline: "", category: "" })
    } catch (err) {
      setError("Failed to add savings goal")
    }
  }

  const handleUpdateGoal = async (id: string, currentAmount: number) => {
    try {
      const response = await axios.put(`/savings-goals/${id}`, { currentAmount })
      setGoals(goals.map((goal) => (goal.id === id ? response.data : goal)))
    } catch (err) {
      setError("Failed to update savings goal")
    }
  }

  const handleAddMoney = async (id: string) => {
    const amountToAdd = addMoneyAmount[id] || 0
    if (amountToAdd <= 0) {
      setError("Please enter a valid amount to add")
      return
    }
    try {
      const goal = goals.find((g) => g.id === id)
      if (!goal) {
        setError("Goal not found")
        return
      }
      const newAmount = goal.currentAmount + amountToAdd
      const response = await axios.put(`/savings-goals/${id}`, { currentAmount: newAmount })
      setGoals(goals.map((goal) => (goal.id === id ? response.data : goal)))
      setAddMoneyAmount({ ...addMoneyAmount, [id]: 0 }) // Reset the input after adding
    } catch (err) {
      setError("Failed to add money to savings goal")
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PiggyBank className="h-6 w-6" />
          Savings Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>How to use Savings Goals</AlertTitle>
          <AlertDescription>
            1. Set a goal name, target amount, and deadline.
            <br />
            2. Choose a category for your goal.
            <br />
            3. Track your progress by adding money to your goal.
            <br />
            4. View your progress visually with the progress bar.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleAddGoal} className="space-y-4 mb-6">
          <Input
            value={newGoal.name}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            placeholder="Goal name"
          />
          <Input
            type="number"
            value={newGoal.targetAmount}
            onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number.parseFloat(e.target.value) })}
            placeholder="Target amount"
          />
          <Input
            type="date"
            value={newGoal.deadline}
            onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                {value ? categories.find((category) => category.value === value)?.label : "Select category..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search category..." />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue)
                          setNewGoal({ ...newGoal, category: currentValue })
                          setOpen(false)
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", value === category.value ? "opacity-100" : "opacity-0")} />
                        {category.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button type="submit" className="w-full">
            Add Goal
          </Button>
        </form>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-4 space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="p-4">
              <h3 className="text-lg font-semibold">{goal.name}</h3>
              <p>Category: {categories.find((c) => c.value === goal.category)?.label || goal.category}</p>
              <p>Target: ${goal.targetAmount}</p>
              <p>Current: ${goal.currentAmount}</p>
              <p>Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
              <Progress value={(goal.currentAmount / goal.targetAmount) * 100} className="mt-2" />
              <div className="flex items-center mt-2 space-x-2">
                <Input
                  type="number"
                  placeholder="Amount to add"
                  value={addMoneyAmount[goal.id] || ""}
                  onChange={(e) =>
                    setAddMoneyAmount({ ...addMoneyAmount, [goal.id]: Number.parseFloat(e.target.value) || 0 })
                  }
                />
                <Button onClick={() => handleAddMoney(goal.id)}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Add Money
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

