"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ArrowLeftRight, ArrowLeft, DollarSign, User, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AddTransactionForm() {
    const [recipient, setRecipient] = useState("")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [type, setType] = useState("send")
    const [walletId, setWalletId] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [notification, setNotification] = useState<{
        title: string
        description: string
        type: "error" | "success" | null
    } | null>(null)

    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const walletIdParam = searchParams.get("walletId")
        if (walletIdParam) {
            setWalletId(walletIdParam)
            console.log(`Wallet ID set from URL: ${walletIdParam}`)
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setNotification(null)
        setIsSubmitting(true)

        if (!category) {
            setNotification({
                title: "Missing Information",
                description: "Please select a transaction category",
                type: "error"
            })
            setIsSubmitting(false)
            return
        }

        const amountNum = Number.parseFloat(amount)
        if (isNaN(amountNum) || amountNum <= 0) {
            setNotification({
                title: "Invalid Amount",
                description: "Please enter a valid positive amount",
                type: "error"
            })
            setIsSubmitting(false)
            return
        }

        console.log("Submitting transaction:", { walletId, type, amount, category, recipient })

        try {
            const response = await axios.post("/transaction/transactionDone", {
                walletId,
                type,
                amount: amountNum,
                category,
                recipient: type === "send" ? recipient : null,
            })
            
            console.log("Transaction successful:", response.data)
            const transactionId = response.data.transaction.id
            
            setNotification({
                title: "Transaction Complete",
                description: type === "send" ? "Money sent successfully!" : "Money received successfully!",
                type: "success"
            })
            
            setTimeout(() => router.push(`/transaction-history?walletId=${walletId}&transactionId=${transactionId}`), 2000)
        } catch (err) {
            console.error("Transaction error:", err)
            setNotification({
                title: "Transaction Failed",
                description: "We couldn't process your transaction. Please try again.",
                type: "error"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const categoryIcons = {
        savings: "💰",
        food: "🍲",
        salary: "💼",
        other: "📋"
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl font-medium">
                        <ArrowLeftRight className="h-5 w-5 text-primary" />
                        {type === "send" ? "Send Money" : "Record Incoming Money"}
                    </CardTitle>
                </CardHeader>
                
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Transaction Type Selector */}
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <Button
                                type="button"
                                variant={type === "send" ? "default" : "outline"}
                                className={cn("h-10", type === "send" && "font-medium")}
                                onClick={() => setType("send")}
                            >
                                Send Money
                            </Button>
                            <Button
                                type="button"
                                variant={type === "receive" ? "default" : "outline"}
                                className={cn("h-10", type === "receive" && "font-medium")}
                                onClick={() => setType("receive")}
                            >
                                Receive Money
                            </Button>
                        </div>
                        
                        {/* Recipient Field (for Send only) */}
                        {type === "send" && (
                            <div className="space-y-2">
                                <Label htmlFor="recipient" className="text-sm font-medium">
                                    Recipient
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="recipient"
                                        placeholder="Email or username"
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                        className="pl-9"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        )}
                        
                        {/* Amount Field */}
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
                                    min="0.01"
                                    step="0.01"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-sm font-medium">
                                Category
                            </Label>
                            <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
                                <SelectTrigger className="h-12" id="category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="savings">💰 Savings</SelectItem>
                                    <SelectItem value="food">🍲 Food</SelectItem>
                                    <SelectItem value="salary">💼 Salary</SelectItem>
                                    <SelectItem value="other">📋 Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Notification Alert */}
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
                        disabled={isSubmitting || !amount || (type === "send" && !recipient)}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? "Processing..." : type === "send" ? "Send Money" : "Record Transaction"}
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

            {/* Auto-dismiss notification for successful transactions */}
            {notification?.type === "success" && (
                <Alert 
                    className="fixed bottom-4 right-4 max-w-md border-green-200 bg-green-50 text-green-800 shadow-lg animate-in slide-in-from-right"
                >
                    <AlertTitle>{notification.title}</AlertTitle>
                    <AlertDescription>{notification.description}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}