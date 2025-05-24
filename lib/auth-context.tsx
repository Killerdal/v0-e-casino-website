"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, db } from "./database"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize database and check for existing session
    const initAuth = async () => {
      try {
        if (typeof window !== "undefined") {
          // Initialize database first
          db.init()

          const token = localStorage.getItem("casino_session_token")
          console.log("Checking for existing session token:", token)

          if (token) {
            const sessionUser = db.validateSession(token)
            console.log("Session validation result:", sessionUser)
            if (sessionUser) {
              setUser(sessionUser)
              console.log("User restored from session:", sessionUser.username)
            } else {
              localStorage.removeItem("casino_session_token")
              console.log("Invalid session, token removed")
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Login attempt:", { email, password })

      const authenticatedUser = db.authenticateUser(email, password)
      console.log("Authentication result:", authenticatedUser)

      if (authenticatedUser) {
        const session = db.createSession(authenticatedUser.id)
        console.log("Session created:", session.token)
        setUser(authenticatedUser)
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log("Registration attempt:", { username, email, password })

      const newUser = db.createUser({
        username,
        email,
        password,
        balance: 1000,
        walletAddress: null,
      })
      console.log("User created:", newUser)

      const session = db.createSession(newUser.id)
      console.log("Session created for new user:", session.token)
      setUser(newUser)
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = () => {
    try {
      const token = localStorage.getItem("casino_session_token")
      if (token) {
        db.destroySession(token)
      }
      setUser(null)
      console.log("User logged out")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = db.updateUser(user.id, updates)
      if (updatedUser) {
        setUser(updatedUser)
        console.log("User updated:", updates)
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
