"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skull, Eye, EyeOff, Mail, User, Lock, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("register")
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "", confirmPassword: "" })
  const { login, register } = useAuth()
  const { toast } = useToast()

  const handleLogin = async () => {
    console.log("=== LOGIN ATTEMPT ===")
    console.log("Login data:", loginData)

    if (!loginData.email || !loginData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await login(loginData.email, loginData.password)
      console.log("Login success:", success)

      if (success) {
        toast({
          title: "🎉 Welcome Back!",
          description: "Successfully logged into Red Syndicate",
        })
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Try creating an account first.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async () => {
    console.log("=== REGISTRATION ATTEMPT ===")
    console.log("Register data:", registerData)

    if (!registerData.username || !registerData.email || !registerData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (registerData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await register(registerData.username, registerData.email, registerData.password)
      console.log("Registration success:", success)

      if (success) {
        toast({
          title: "🎉 Welcome to Red Syndicate!",
          description: "Account created successfully with $1000 welcome bonus",
        })
      } else {
        toast({
          title: "Registration Failed",
          description: "Username or email already exists",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Error",
        description: "An error occurred during registration",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Quick test account creation
  const createTestAccount = async () => {
    const testData = {
      username: "TestUser" + Math.floor(Math.random() * 1000),
      email: "test" + Math.floor(Math.random() * 1000) + "@example.com",
      password: "123456",
      confirmPassword: "123456",
    }

    setRegisterData(testData)

    setTimeout(() => {
      handleRegister()
    }, 100)
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
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Test Button */}
          <Alert className="bg-blue-900/20 border-blue-600/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-gray-300">
              <div className="flex items-center justify-between">
                <span>Quick test with random account:</span>
                <Button
                  onClick={createTestAccount}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  Create Test Account
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/50">
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-red-600/30 data-[state=active]:text-red-400"
              >
                Register
              </TabsTrigger>
              <TabsTrigger value="login" className="data-[state=active]:bg-red-600/30 data-[state=active]:text-red-400">
                Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="register" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username" className="text-gray-300">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="Choose a username"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                      className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-gray-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-gray-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500 pl-10 pr-10"
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

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password" className="text-gray-300">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500 pl-10"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleRegister}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-lg tracking-wider"
                  disabled={isLoading}
                >
                  {isLoading ? "CREATING ACCOUNT..." : "JOIN THE REVOLUTION"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="login" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500 pl-10 pr-10"
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

                <Button
                  onClick={handleLogin}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-lg tracking-wider"
                  disabled={isLoading}
                >
                  {isLoading ? "LOGGING IN..." : "LOGIN"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
