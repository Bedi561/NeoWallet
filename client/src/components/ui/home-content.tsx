/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/axios"
import { Wallet, Settings, CreditCard, LogOut, PlusCircle, Tags, Target, PieChart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    const router = useRouter()

    // Client-side effect to check if the component is mounted
    useEffect(() => {
        setIsMounted(true) // Component has mounted on the client side
    }, [])

    // Use effect for fetching user and wallet data
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get("/users/profile")
                setUser(response.data.user)
            } catch (err) {
                console.error("Error fetching user profile:", err)
            }
        }

        fetchUserProfile()
    }, []) // Empty dependency array to run once on mount

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

        // Fetch wallet data only after user is set
        if (user?.id) fetchWallet()
    }, [user]) // Dependency array with user to run when user state is updated

    const createWallet = async () => {
        if (user?.id) {
            try {
                console.log("Creating wallet for user:", user.id); // Log the user ID
                const response = await axios.post(`/walletStuff/wallet`, { userId: user.id });
                setWallet(response.data);
            } catch (err) {
                console.error("Error creating wallet:", err);
            }
        }
    }


    const handleLogout = () => {
        if (isMounted) {
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
            router.push("/auth")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome {user?.username}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-6">
                        <Wallet className="h-6 w-6 text-primary" />
                        {wallet ? (
                            <p className="text-lg">Your Wallet Balance: ${wallet?.balance.toFixed(2)}</p>
                        ) : (
                            <p className="text-lg text-red-600">No wallet found. Please create one.</p>
                        )}
                    </div>

                    {/* Show wallet creation button if wallet doesn't exist */}
                    {!wallet && (
                        <Button onClick={createWallet} className="w-full mb-2">
                            Create Wallet
                        </Button>
                    )}

                    {wallet && (
                        <>
                        <Button onClick={() => router.push(`/add-money`)} className="w-full mb-2">
            <Wallet className="mr-2 h-4 w-4" /> Add Money to Wallet
          </Button>
                            <Button onClick={() => router.push(`/wallet-details/${user?.id}`)} className="w-full mb-2">
                                <Wallet className="mr-2 h-4 w-4" /> View Wallet Details
                            </Button>
                            <Button
                                onClick={() => router.push(`/transaction-history?walletId=${wallet?.id}`)}
                                className="w-full mb-2"
                            >
                                <CreditCard className="mr-2 h-4 w-4" /> Go to Transactions
                            </Button>
                            <Button onClick={() => router.push("/category")} className="w-full mb-2" variant="outline">
                                Payment Category
                            </Button>
                            <Button onClick={() => router.push(`/add-transaction?walletId=${wallet?.id}`)} className="w-full mb-2" variant="outline">
                                Add Transaction
                            </Button>
                            <Button onClick={() => router.push("/savings-goals")} className="w-full mb-2">
            <Target className="mr-2 h-4 w-4" /> Savings Goals
          </Button>
          <Button onClick={() => router.push("/budget-planning")} className="w-full mb-2">
            <PieChart className="mr-2 h-4 w-4" /> Budget Planning
          </Button>
          <Button onClick={() => router.push("/split-expenses")} className="w-full mb-2">
            <Users className="mr-2 h-4 w-4" /> Split Expenses
          </Button>
                        </>
                    )}

                    <Button onClick={() => router.push("/settings")} className="w-full mb-2" variant="outline">
                        <Settings className="mr-2 h-4 w-4" /> Settings
                    </Button>
                    {/* <Button onClick={handleLogout} className="w-full" variant="destructive">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button> */}
                </CardContent>
            </Card>
        </div>
    )
}
