"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skull, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LoginPageProps {
  onLogin: (loggedIn: boolean) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login
    setTimeout(() => {
      if (username && password) {
        toast({
          title: "Welcome to Red Syndicate",
          description: "Successfully logged in to the revolution",
        })
        onLogin(true)
      } else {
        toast({
          title: "Login Failed",
          description: "Please enter valid credentials",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black to-red-900/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_50%)]"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-red-500/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 border border-red-500/10 rounded-full animate-pulse delay-1000"></div>

      <Card className="w-full max-w-md bg-black/80 border-red-600/30 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center border border-red-500/50">
                <Skull className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-red-500 tracking-wider">RED SYNDICATE</CardTitle>
            <CardDescription className="text-red-400/70 mt-2">JOIN THE REVOLUTION</CardDescription>
          </div>
          <h2 className="text-xl font-bold text-red-400 tracking-widest">LOG IN</h2>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="text-center">
              <button type="button" className="text-sm text-red-400 hover:text-red-300 underline">
                Forgot your password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-lg tracking-wider"
              disabled={isLoading}
            >
              {isLoading ? "LOGGING IN..." : "LOGIN"}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-gray-400">Not a member?</p>
              <button type="button" className="text-red-400 hover:text-red-300 font-bold underline tracking-wider">
                SIGN UP
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
