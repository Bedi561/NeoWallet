"use client"

import { useEffect, useState } from "react"
import axios from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Calendar, Tag, ArrowUpDown } from "lucide-react"

interface Transaction {
    id: string
    type: string
    amount: number
    category: string
    createdAt: string
}

export default function TransactionDetailsContent({ transactionId }: { transactionId: string }) {  // Accept walletId as prop
    const [transaction, setTransaction] = useState<Transaction | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<{ title: string; description: string; variant: "default" | "destructive" } | null>(null)

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            try {
                // Make request using walletId to fetch transactions related to the wallet
                const response = await axios.get(`/transaction/transactionDetails/${transactionId}`)
                setTransaction(response.data)
            } catch (err) {
                console.error(err)
                setError({
                    title: "Error",
                    description: "Failed to load transaction details. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchTransactionDetails()
    }, [transactionId])  // Use walletId as dependency to refetch when it changes

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Transaction Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Alert variant={error.variant} className="w-full max-w-md">
                    <AlertTitle>{error.title}</AlertTitle>
                    <AlertDescription>{error.description}</AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-6 w-6" />
                        Transaction Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className={`h-5 w-5 ${transaction?.type === "send" ? "text-red-500" : "text-green-500"}`} />
                        <div>
                            <span className="font-semibold">Type:</span> {transaction?.type === "send" ? "Sent" : "Received"}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-gray-500" />
                        <div>
                            <span className="font-semibold">Amount:</span> ${transaction?.amount.toFixed(2)}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-gray-500" />
                        <div>
                            <span className="font-semibold">Category:</span> {transaction?.category}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <div>
                            <span className="font-semibold">Date:</span> {transaction?.createdAt ? new Date(transaction.createdAt).toLocaleString() : "N/A"}
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
