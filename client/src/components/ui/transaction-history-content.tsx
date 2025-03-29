"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import axios from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ArrowDown, ArrowUp, CreditCard, Tag, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
  const [error, setError] = useState<{ title: string; description: string; variant: "default" | "destructive" } | null>(null)
  const searchParams = useSearchParams()
  const walletId = searchParams.get("walletId")
  const transactionId = searchParams.get("transactionId")

  const fetchTransactions = async () => {
    if (!walletId) {
      setError({
        title: "Missing Information",
        description: "Wallet ID is required to view transactions",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const response = await axios.get(`/transaction/transactions/${walletId}`)
      setTransactions(response.data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError({
        title: "Unable to Load Transactions",
        description: "Please check your connection and try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [walletId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-sm">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-gray-500" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center justify-between py-4 animate-pulse">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <Alert variant={error.variant} className="mb-4">
          <AlertTitle className="font-medium">{error.title}</AlertTitle>
          <AlertDescription>{error.description}</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 mt-2" 
          onClick={fetchTransactions}
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-sm border-gray-100">
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-gray-500" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions yet</h3>
            <p className="text-sm text-gray-500 max-w-xs mb-4">
              When you send or receive payments, they will appear here.
            </p>
            <Button variant="outline" size="sm" onClick={fetchTransactions} className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <li key={transaction.id}>
                <Link
                  href={`/transaction-details/${transaction.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === "send" 
                        ? "bg-red-50" 
                        : "bg-green-50"
                    }`}>
                      {transaction.type === "send" ? (
                        <ArrowUp className="h-4 w-4 text-red-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.type === "send" ? "Sent" : "Received"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`font-medium ${
                      transaction.type === "send" 
                        ? "text-red-600" 
                        : "text-green-600"
                    }`}>
                      {transaction.type === "send" ? "-" : "+"}${transaction.amount.toFixed(2)}
                    </span>
                    <Badge variant="outline" className="text-xs font-normal py-0 h-5">
                      <Tag className="h-3 w-3 mr-1" />
                      {transaction.category}
                    </Badge>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}