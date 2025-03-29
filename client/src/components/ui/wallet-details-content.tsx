/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Wallet, CreditCard, PlusCircle, ArrowUpRight, RefreshCw, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

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

interface TransactionSummary {
  inflow: number
  outflow: number
  netFlow: number
  transactionCount: number
}

export default function WalletDetailsContent({ userId }: { userId: string }) {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [summary, setSummary] = useState<TransactionSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<{ title: string; description: string; variant: "default" | "destructive" } | null>(null)
  const [activeTab, setActiveTab] = useState("balance")
  const router = useRouter()

  const fetchWalletDetails = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    
    try {
      const response = await axios.get(`/walletStuff/wallet/${userId}`)
      setWallet(response.data)
      
      // Calculate transaction summary
      if (response.data.transactions && response.data.transactions.length > 0) {
        const inflow = response.data.transactions
          .filter((t: { type: string }) => t.type === "receive")
          .reduce((sum: any, t: { amount: any }) => sum + t.amount, 0)
        
        const outflow = response.data.transactions
          .filter((t: { type: string }) => t.type === "send")
          .reduce((sum: any, t: { amount: any }) => sum + t.amount, 0)
        
        setSummary({
          inflow,
          outflow,
          netFlow: inflow - outflow,
          transactionCount: response.data.transactions.length
        })
      }
    } catch (err) {
      console.error(err)
      setError({
        title: "Connection Error",
        description: "We couldn't load your wallet data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      if (showRefreshing) setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchWalletDetails()
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-primary" />
              <span className="text-xl">Loading Wallet</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 py-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4 rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-24 rounded-md" />
                <Skeleton className="h-24 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Alert variant={error.variant} className="w-full max-w-md shadow-lg animate-in slide-in-from-bottom-5">
          <AlertTitle className="text-lg font-semibold">{error.title}</AlertTitle>
          <AlertDescription className="mt-2">{error.description}</AlertDescription>
          <Button 
            variant="outline" 
            className="mt-4 w-full"
            onClick={() => {
              setError(null)
              setLoading(true)
              fetchWalletDetails()
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="pb-0 pt-6">
            <div className="flex justify-between items-center mb-2">
              <CardTitle className="flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Wallet className="h-6 w-6 text-primary" />
                </motion.div>
                <span className="text-xl font-medium">Your Wallet</span>
              </CardTitle>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="text-gray-400 hover:text-primary transition-colors"
                onClick={() => {
                  fetchWalletDetails(true)
                }}
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
              </motion.button>
            </div>
            
            <div className="flex border-b">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className={`py-3 px-4 font-medium text-sm ${activeTab === 'balance' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                onClick={() => setActiveTab('balance')}
              >
                Balance
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className={`py-3 px-4 font-medium text-sm ${activeTab === 'activity' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                onClick={() => setActiveTab('activity')}
              >
                Activity
              </motion.button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 pb-2">
            {activeTab === 'balance' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="text-gray-500 text-sm mb-1">Current Balance</div>
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-3xl font-bold"
                  >
                    ${wallet?.balance.toFixed(2)}
                  </motion.div>
                </div>
                
                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div 
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="bg-green-50 rounded-lg p-4 border border-green-100"
                  >
                    <div className="text-green-600 font-semibold mb-1 text-sm">Money In</div>
                    <div className="text-xl font-bold text-green-700">
                      ${summary?.inflow.toFixed(2) || "0.00"}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="bg-red-50 rounded-lg p-4 border border-red-100"
                  >
                    <div className="text-red-600 font-semibold mb-1 text-sm">Money Out</div>
                    <div className="text-xl font-bold text-red-700">
                      ${summary?.outflow.toFixed(2) || "0.00"}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
            
            {activeTab === 'activity' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <div className="text-gray-500 text-sm mb-1">Transaction Count</div>
                  <div className="text-2xl font-bold">{summary?.transactionCount || 0}</div>
                </div>
                
                {wallet?.transactions && wallet.transactions.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-gray-500 text-sm font-medium">Recent Activity</div>
                    {wallet.transactions.slice(0, 3).map((tx, index) => (
                      <motion.div 
                        key={tx.id}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'receive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {tx.type === 'receive' ? '↓' : '↑'}
                          </div>
                          <div>
                            <div className="font-medium capitalize">{tx.category}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className={`font-semibold ${tx.type === 'receive' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'receive' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No transactions yet
                  </div>
                )}
              </motion.div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3 pt-2 pb-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button 
                className="w-full h-11 text-sm font-medium" 
                onClick={() => router.push(`/transaction-history?walletId=${wallet?.id}`)}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                View All Transactions
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button
                className="w-full h-11 text-sm font-medium"
                onClick={() => router.push(`/add-transaction?walletId=${wallet?.id}`)}
                variant="outline"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Transaction
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}