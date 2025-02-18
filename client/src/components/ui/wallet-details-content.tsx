"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Wallet, CreditCard } from "lucide-react"

interface WalletData {
  id: string
  balance: number
  transactions: Array<{
    id: string
    type: string
    amount: number
    category: string
    createdAt: string
  }>
}

export default function WalletDetailsContent({ userId }: { userId: string }) {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ title: string; description: string; variant: "default" | "destructive" } | null>(
    null,
  )
  const router = useRouter()

  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        const response = await axios.get(`/walletStuff/wallet/${userId}`)
        setWallet(response.data)
      } catch (err) {
        console.error(err)
        setError({
          title: "Error",
          description: "Failed to load wallet details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWalletDetails()
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Wallet Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
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
            <Wallet className="h-6 w-6" />
            Wallet Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Wallet Balance:</span>
            <span className="text-2xl font-bold">${wallet?.balance.toFixed(2)}</span>
          </div>
          <Button className="w-full" onClick={() => router.push(`/transaction-history?walletId=${wallet?.id}`)}>
            <CreditCard className="mr-2 h-4 w-4" />
            View Transactions
          </Button>
          <Button
            className="w-full"
            onClick={() => router.push(`/add-transaction?walletId=${wallet?.id}`)}
            variant="outline"
          >
            Add New Transaction
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

