"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { PlusCircle, ArrowLeft, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AddMoneyContent() {
  const [amount, setAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{
    title: string;
    description: string;
    type: "error" | "success" | null;
  } | null>(null)
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotification(null)
    setIsSubmitting(true)

    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > 80000) {
      setNotification({
        title: "Invalid Amount",
        description: "Please enter an amount between $1 and $80,000.",
        type: "error"
      })
      setIsSubmitting(false)
      return
    }

    try {
      await axios.post("/walletStuff/addMoney", { amount: amountNum })
      setNotification({
        title: "Money Added",
        description: `$${amountNum.toFixed(2)} has been added to your wallet.`,
        type: "success"
      })
      setTimeout(() => router.push("/home"), 2000)
    } catch (err) {
      console.error(err)
      setNotification({
        title: "Transaction Failed",
        description: "We couldn't process your request. Please try again.",
        type: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-medium">
            <PlusCircle className="h-5 w-5 text-primary" />
            Add Money to Wallet
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={cn(
                    "pl-9 text-lg h-12",
                    notification?.type === "error" && "border-red-300 focus-visible:ring-red-400"
                  )}
                  required
                  min="1"
                  max="80000"
                  step="0.01"
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Maximum: $80,000</p>
            </div>

            {notification && (
              <Alert 
                variant={notification.type === "error" ? "destructive" : "default"}
                className={cn(
                  "border",
                  notification.type === "success" && "border-green-200 bg-green-50 text-green-800"
                )}
              >
                <AlertTitle>{notification.title}</AlertTitle>
                <AlertDescription>{notification.description}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button 
            type="submit" 
            className="w-full h-11"
            disabled={isSubmitting || !amount}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Processing..." : "Add Money"}
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full text-gray-500 flex items-center justify-center gap-2" 
            onClick={() => router.push("/home")}
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}