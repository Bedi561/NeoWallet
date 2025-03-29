"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, User, Mail, KeyRound, Loader2, EyeIcon, EyeOffIcon } from "lucide-react"
import Link from "next/link"
import type React from "react"
import { motion } from "framer-motion"

interface AuthFormProps {
  onLoginSuccess: () => void
  defaultTab?: "login" | "signup"
}

export default function AuthForm({ onLoginSuccess, defaultTab = "login" }: AuthFormProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const data = activeTab === "login" ? { email, password } : { email, password, username }
      const endpoint = activeTab === "login" ? "/users/login" : "/users/register"
      const response = await axios.post(endpoint, data)
      localStorage.setItem("token", response.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`
      onLoginSuccess()
      router.push("/home")
    } catch (err: any) {
      setError(err.response?.data?.message || 
        (activeTab === "login" ? "Invalid credentials" : "Registration failed"))
    } finally {
      setIsLoading(false)
    }
  }

  const switchTab = (tab: "login" | "signup") => {
    setActiveTab(tab)
    setError(null)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-border rounded-lg overflow-hidden">
          {/* Tab Switcher */}
          <div className="relative w-full bg-muted/50 p-1 rounded-t-lg">
            <div 
              className="absolute h-11 top-1 transition-all duration-300 ease-out bg-white rounded-md shadow-sm"
              style={{ 
                width: 'calc(50% - 8px)', 
                left: activeTab === 'login' ? '4px' : 'calc(50% + 4px)',
              }} 
            />
            <div className="grid grid-cols-2 relative z-10">
              <button
                type="button"
                onClick={() => switchTab('login')}
                className={`py-3 font-medium text-sm rounded-md transition-colors ${
                  activeTab === 'login' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Lock className="h-4 w-4 inline-block mr-2" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchTab('signup')}
                className={`py-3 font-medium text-sm rounded-md transition-colors ${
                  activeTab === 'signup' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="h-4 w-4 inline-block mr-2" />
                Create Account
              </button>
            </div>
          </div>
          
          <CardHeader className="space-y-2 pt-6 pb-4 text-center">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardTitle className="text-2xl font-bold">
                {activeTab === "login" ? "Welcome Back" : "Join Us Today"}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                {activeTab === "login" 
                  ? "Access your account" 
                  : "Create a new account"}
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent className="px-6 pb-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleAuth} className="space-y-4">
                {activeTab === "signup" && (
                  <div className="space-y-1">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 h-11"
                        placeholder="Enter username"
                        required
                      />
                      <User className="h-5 w-5 text-muted-foreground absolute left-3 top-3" />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11"
                      placeholder="Enter email"
                      required
                    />
                    <Mail className="h-5 w-5 text-muted-foreground absolute left-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {activeTab === "login" && (
                      <Link 
                        href="/forgot-password" 
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11"
                      placeholder="Enter password"
                      required
                    />
                    <KeyRound className="h-5 w-5 text-muted-foreground absolute left-3 top-3" />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert variant="destructive" className="text-sm py-3">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-11 mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {activeTab === "login" ? "Signing in..." : "Creating account..."}
                    </>
                  ) : (
                    activeTab === "login" ? "Sign In" : "Create Account"
                  )}
                </Button>
              </form>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}