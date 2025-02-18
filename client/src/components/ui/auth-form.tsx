/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Lock, User } from "lucide-react"
import Link from "next/link"
import type React from "react" // Added import for React

interface AuthFormProps {
  type: "login" | "signup"
  onLoginSuccess: () => void
}

export default function AuthForm({ type, onLoginSuccess }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState<{ title: string; description: string; variant: "default" | "destructive" } | null>(
    null,
  )
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = type === "login" ? { email, password } : { email, password, username }
      const endpoint = type === "login" ? "/users/login" : "/users/register"
      const response = await axios.post(endpoint, data)
      localStorage.setItem("token", response.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`
      onLoginSuccess()
      router.push("/home");

    } catch (err) {
      setError({
        title: type === "login" ? "Login Failed" : "Signup Failed",
        description:
          type === "login"
            ? "Invalid credentials or server error. Please try again."
            : "Error during signup. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            {type === "login" ? <Lock className="h-6 w-6" /> : <User className="h-6 w-6" />}
            <span>{type === "login" ? "Login" : "Sign Up"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {type === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {type === "login" && (
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant={error.variant}>
                <AlertTitle>{error.title}</AlertTitle>
                <AlertDescription>{error.description}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              {type === "login" ? "Login" : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {type === "login" ? "Don't have an account? " : "Already have an account? "}
            <Link href={type === "login" ? "/signup" : "/login"} className="text-blue-600 hover:underline">
              {type === "login" ? "Sign up" : "Log in"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

