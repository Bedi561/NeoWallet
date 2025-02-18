/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { PlusCircle } from "lucide-react"

export default function AddMoneyContent() {
  const [amount, setAmount] = useState("")
  const [error, setError] = useState<{ title: string; description: string; variant: "default" | "destructive" } | null>(
    null,
  )
  const [success, setSuccess] = useState<{ title: string; description: string } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > 80000) {
      setError({
        title: "Invalid Amount",
        description: "Please enter an amount between 1 and 80,000.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await axios.post("/walletStuff/addMoney", { amount: amountNum })
      setSuccess({
        title: "Success",
        description: `Successfully added $${amountNum.toFixed(2)} to your wallet.`,
      })
      setTimeout(() => router.push("/home"), 2000)
    } catch (err) {
      console.error(err)
      setError({
        title: "Error",
        description: "Failed to add money to your wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-6 w-6" />
            Add Money to Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Max $80,000)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                max="80000"
              />
            </div>
            {error && (
              <Alert variant={error.variant}>
                <AlertTitle>{error.title}</AlertTitle>
                <AlertDescription>{error.description}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertTitle>{success.title}</AlertTitle>
                <AlertDescription>{success.description}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              Add Money
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/home")}>
              Back to Home
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

