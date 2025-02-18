/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ArrowLeftRight, Tag } from "lucide-react"

export default function AddTransactionForm() {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [type, setType] = useState("send")
    const [walletId, setWalletId] = useState("")
    const [error, setError] = useState("")
    const [alertInfo, setAlertInfo] = useState<{
        title: string
        description: string
        variant: "default" | "destructive"
    } | null>(null)

    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const walletIdParam = searchParams.get("walletId")
        if (walletIdParam) {
            setWalletId(walletIdParam)
            console.log(`Wallet ID set from URL: ${walletIdParam}`)  // Log walletId
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!category) {
            setError("Please select a category")
            console.log("Error: No category selected")  // Log error if category is missing
            return
        }

        console.log("Submitting transaction:", { walletId, type, amount, category, recipient }) // Log data before submission

        try {
            const response = await axios.post("/transaction/transactionDone", {
                walletId,
                type,
                amount: Number.parseFloat(amount),
                category,
                recipient: type === "send" ? recipient : null,
            })
            console.log("Transaction successful:", response.data) // Log successful response
            const transactionId = response.data.transaction.id
            setAlertInfo({
                title: "Success",
                description: "Transaction added successfully!",
                variant: "default",
            })
            setTimeout(() => router.push(`/transaction-history?walletId=${walletId}&transactionId=${transactionId}`), 2000)
        } catch (err) {
            console.error("Transaction error:", err)  // Log error details
            setAlertInfo({
                title: "Error",
                description: "Failed to add transaction. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowLeftRight className="h-6 w-6" />
                        Add Transaction
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {type === "send" && (
                            <div className="space-y-2">
                                <Label htmlFor="recipient">Recipient (Email/Username)</Label>
                                <Input
                                    id="recipient"
                                    placeholder="Enter recipient's email or username"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>

                        {/* Category Selection Section */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="savings">Savings</SelectItem>
                                    <SelectItem value="food">Food</SelectItem>
                                    <SelectItem value="salary">Salary</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Show error if category is not selected */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select transaction type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="send">Send</SelectItem>
                                    <SelectItem value="receive">Receive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" className="w-full">
                            Submit Transaction
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => router.push("/home")}>
                            Back to Home
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {alertInfo && (
                <Alert variant={alertInfo.variant} className="fixed bottom-4 right-4 max-w-md">
                    <AlertTitle>{alertInfo.title}</AlertTitle>
                    <AlertDescription>{alertInfo.description}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}
