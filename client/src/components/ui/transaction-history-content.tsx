"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import axios from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ArrowUpDown, CreditCard, Tag } from "lucide-react"

interface Transaction {
  id: string
  type: string
  amount: number
  category: string
  createdAt: string
}

export default function TransactionHistoryContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ title: string; description: string; variant: "default" | "destructive" } | null>(
    null,
  )
  const searchParams = useSearchParams()
  const walletId = searchParams.get("walletId")
  const transactionId = searchParams.get("transactionId")

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!walletId) {
        setError({
          title: "Error",
          description: "Wallet ID is missing",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(`/transaction/transactions/${walletId}`)
        setTransactions(response.data)
      } catch (err) {
        console.error(err)
        setError({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [walletId])

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="mb-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant={error.variant}>
          <AlertTitle>{error.title}</AlertTitle>
          <AlertDescription>{error.description}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <ul className="space-y-4">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="border-b border-gray-200 pb-4">
                  <Link
                    href={`/transaction-details/${transactionId}`}
                    className="block hover:bg-gray-50 rounded-lg p-2 transition duration-150 ease-in-out"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown
                          className={`h-5 w-5 ${transaction.type === "send" ? "text-red-500" : "text-green-500"}`}
                        />
                        <span className="font-semibold">
                          {transaction.type === "send" ? "Sent" : "Received"} - ${transaction.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Tag className="h-4 w-4" />
                        <span>{transaction.category}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{new Date(transaction.createdAt).toLocaleString()}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

