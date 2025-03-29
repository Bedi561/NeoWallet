"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/axios"
import { 
  Wallet, Settings, CreditCard, LogOut, PlusCircle, 
  Tags, Target, PieChart, Users, Activity, BarChart3,
  TrendingUp, ArrowUpRight, DollarSign, Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

interface User {
  id: string
  username: string
}

interface Wallet {
  id: string
  balance: number
}

export default function HomeContent() {
  const [user, setUser] = useState<User | null>(null)
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/users/profile")
        setUser(response.data.user)
      } catch (err) {
        console.error("Error fetching user profile:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  useEffect(() => {
    const fetchWallet = async () => {
      if (user?.id) {
        try {
          const response = await axios.get(`/walletStuff/wallet/${user.id}`)
          setWallet(response.data)
        } catch (err) {
          console.error("Error fetching wallet:", err)
        }
      }
    }

    if (user?.id) fetchWallet()
  }, [user])

  const createWallet = async () => {
    if (user?.id) {
      try {
        setIsLoading(true)
        const response = await axios.post(`/walletStuff/wallet`, { userId: user.id })
        setWallet(response.data)
      } catch (err) {
        console.error("Error creating wallet:", err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleLogout = () => {
    if (isMounted) {
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
      router.push("/auth")
    }
  }

  const features = [
    { 
      title: "Wallet", 
      icon: <Wallet className="h-6 w-6 text-blue-500" />, 
      action: () => router.push(`/wallet-details/${user?.id}`),
      description: "Manage your wallet details"
    },
    { 
      title: "Transactions", 
      icon: <CreditCard className="h-6 w-6 text-purple-500" />, 
      action: () => router.push(`/transaction-history?walletId=${wallet?.id}`),
      description: "View your transaction history"
    },
    // { 
    //   title: "Categories", 
    //   icon: <Tags className="h-6 w-6 text-yellow-500" />, 
    //   action: () => router.push("/category"),
    //   description: "Manage payment categories"
    // },
    { 
      title: "Add Transaction", 
      icon: <PlusCircle className="h-6 w-6 text-green-500" />, 
      action: () => router.push(`/add-transaction?walletId=${wallet?.id}`),
      description: "Record a new transaction"
    },
    { 
      title: "Money Moves", 
      icon: <Target className="h-6 w-6 text-red-500" />, 
      action: () => router.push("/savings-goals"),
      description: "Track your savings targets"
    },
    { 
      title: "Budget", 
      icon: <PieChart className="h-6 w-6 text-indigo-500" />, 
      action: () => router.push("/budget-planning"),
      description: "Plan and manage your budget"
    },
    { 
      title: "Split Expenses", 
      icon: <Users className="h-6 w-6 text-teal-500" />, 
      action: () => router.push("/split-expenses"),
      description: "Share costs with others"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {isLoading ? "Loading..." : `Welcome, ${user?.username || "User"}`}
            </h1>
            <p className="text-gray-500">Manage your finances with ease</p>
          </motion.div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.push("/settings")}>
              <Settings className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wallet Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-3"
          >
            <Card className="overflow-hidden border-0 shadow-lg bg-white">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-medium opacity-80">Available Balance</h2>
                    {wallet ? (
                      <div className="flex items-baseline mt-1">
                        <DollarSign className="h-8 w-8 mr-1" />
                        <span className="text-3xl font-bold">{wallet?.balance.toFixed(2)}</span>
                      </div>
                    ) : (
                      <p className="text-xl">No wallet available</p>
                    )}
                  </div>

                  {!wallet ? (
                    <Button 
                      onClick={createWallet} 
                      variant="secondary" 
                      size="lg"
                      disabled={isLoading}
                      className="bg-white/20 hover:bg-white/30 text-white border-0"
                    >
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Create Wallet
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => router.push(`/add-money`)} 
                      variant="secondary"
                      size="lg"
                      className="bg-white/20 hover:bg-white/30 text-white border-0"
                    >
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Add Money
                    </Button>
                  )}
                </div>
              </div>

              {wallet && (
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => router.push(`/wallet-details/${user?.id}`)} variant="outline" size="sm">
                      <Wallet className="mr-2 h-4 w-4" /> Wallet Details
                    </Button>
                    <Button onClick={() => router.push(`/transaction-history?walletId=${wallet?.id}`)} variant="outline" size="sm">
                      <Activity className="mr-2 h-4 w-4" /> Transactions
                    </Button>
                    <Button onClick={() => router.push(`/add-transaction?walletId=${wallet?.id}`)} variant="outline" size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" /> New Transaction
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>

          {wallet && (
            <>
              {/* Features Grid */}
              <div className="md:col-span-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    >
                      <Card 
                        className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer bg-white overflow-hidden h-full"
                        onClick={feature.action}
                      >
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <div className="rounded-full bg-gray-50 p-3 mb-3">
                            {feature.icon}
                          </div>
                          <CardTitle className="text-base font-medium mb-1">{feature.title}</CardTitle>
                          <CardDescription className="text-xs">{feature.description}</CardDescription>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-0 shadow-md bg-white h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={() => router.push(`/add-money`)} className="w-full justify-start">
                      <ArrowUpRight className="mr-2 h-4 w-4" /> Add Money to Wallet
                    </Button>
                    <Button onClick={() => router.push("/savings-goals")} variant="outline" className="w-full justify-start">
                      <Target className="mr-2 h-4 w-4" /> View Savings Goals
                    </Button>
                    <Button onClick={() => router.push("/budget-planning")} variant="outline" className="w-full justify-start">
                      <BarChart3 className="mr-2 h-4 w-4" /> Budget Overview
                    </Button>
                    <Button onClick={() => router.push("/settings")} variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" /> Account Settings
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}

          {/* No Wallet State */}
          {!wallet && !isLoading && (
            <div className="md:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-0 shadow-md bg-white">
                  <CardContent className="p-8 text-center">
                    <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <CardTitle className="text-xl mb-2">No Wallet Found</CardTitle>
                    <CardDescription className="mb-6">
                      Create a wallet to start managing your finances and access all features.
                    </CardDescription>
                    <Button onClick={createWallet} size="lg" className="px-8">
                      <PlusCircle className="mr-2 h-5 w-5" /> Create Wallet Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}