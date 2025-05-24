// Enhanced database with better error handling and initialization
export interface User {
  id: string
  username: string
  email: string
  password: string
  balance: number
  walletAddress: string | null
  createdAt: string
  lastLogin: string
  settings: UserSettings
  transactions: Transaction[]
  isVerified: boolean
  twoFactorEnabled: boolean
}

export interface UserSettings {
  theme: "dark" | "light"
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    showBalance: boolean
    showActivity: boolean
  }
  limits: {
    dailyDeposit: number
    dailyWithdrawal: number
    sessionTime: number
  }
  language: string
  currency: string
}

export interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "bet" | "win"
  amount: number
  currency: string
  status: "pending" | "completed" | "failed"
  timestamp: string
  description: string
  hash?: string
}

export interface Session {
  userId: string
  token: string
  expiresAt: string
}

class Database {
  private initialized = false

  init() {
    if (this.initialized || typeof window === "undefined") return

    try {
      // Ensure localStorage is available and working
      const testKey = "test_storage"
      localStorage.setItem(testKey, "test")
      localStorage.removeItem(testKey)
      this.initialized = true
      console.log("Database initialized successfully")
    } catch (error) {
      console.error("Database initialization failed:", error)
    }
  }

  private getUsers(): User[] {
    if (!this.initialized || typeof window === "undefined") return []
    try {
      const users = localStorage.getItem("casino_users")
      const parsed = users ? JSON.parse(users) : []
      console.log("Retrieved users:", parsed.length)
      return parsed
    } catch (error) {
      console.error("Error reading users:", error)
      return []
    }
  }

  private saveUsers(users: User[]): void {
    if (!this.initialized || typeof window === "undefined") return
    try {
      localStorage.setItem("casino_users", JSON.stringify(users))
      console.log("Saved users:", users.length)
    } catch (error) {
      console.error("Error saving users:", error)
    }
  }

  private getSessions(): Session[] {
    if (!this.initialized || typeof window === "undefined") return []
    try {
      const sessions = localStorage.getItem("casino_sessions")
      return sessions ? JSON.parse(sessions) : []
    } catch (error) {
      console.error("Error reading sessions:", error)
      return []
    }
  }

  private saveSessions(sessions: Session[]): void {
    if (!this.initialized || typeof window === "undefined") return
    try {
      localStorage.setItem("casino_sessions", JSON.stringify(sessions))
    } catch (error) {
      console.error("Error saving sessions:", error)
    }
  }

  createUser(
    userData: Omit<
      User,
      "id" | "createdAt" | "lastLogin" | "settings" | "transactions" | "isVerified" | "twoFactorEnabled"
    >,
  ): User {
    const users = this.getUsers()

    // Check if user already exists
    const existingUser = users.find((u) => u.email === userData.email || u.username === userData.username)
    if (existingUser) {
      throw new Error("User already exists")
    }

    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isVerified: false,
      twoFactorEnabled: false,
      settings: {
        theme: "dark",
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        privacy: {
          showBalance: true,
          showActivity: true,
        },
        limits: {
          dailyDeposit: 10000,
          dailyWithdrawal: 5000,
          sessionTime: 240,
        },
        language: "en",
        currency: "USD",
      },
      transactions: [],
    }

    users.push(newUser)
    this.saveUsers(users)
    console.log("User created successfully:", newUser.username)
    return newUser
  }

  authenticateUser(email: string, password: string): User | null {
    const users = this.getUsers()
    console.log("Authenticating user:", email, "against", users.length, "users")

    const user = users.find((u) => u.email === email && u.password === password)
    console.log("User found:", user ? user.username : "none")

    if (user) {
      user.lastLogin = new Date().toISOString()
      this.updateUser(user.id, { lastLogin: user.lastLogin })
    }

    return user || null
  }

  getUserById(id: string): User | null {
    const users = this.getUsers()
    return users.find((u) => u.id === id) || null
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === id)

    if (userIndex === -1) return null

    users[userIndex] = { ...users[userIndex], ...updates }
    this.saveUsers(users)
    return users[userIndex]
  }

  addTransaction(userId: string, transaction: Omit<Transaction, "id" | "timestamp">): Transaction {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) throw new Error("User not found")

    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    }

    users[userIndex].transactions.push(newTransaction)
    this.saveUsers(users)
    return newTransaction
  }

  createSession(userId: string): Session {
    const sessions = this.getSessions()
    const token = Math.random().toString(36).substr(2, 15)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    const session: Session = {
      userId,
      token,
      expiresAt,
    }

    sessions.push(session)
    this.saveSessions(sessions)

    try {
      localStorage.setItem("casino_session_token", token)
      console.log("Session token stored:", token)
    } catch (error) {
      console.error("Error storing session token:", error)
    }

    return session
  }

  validateSession(token: string): User | null {
    const sessions = this.getSessions()
    const session = sessions.find((s) => s.token === token && new Date(s.expiresAt) > new Date())

    if (!session) {
      console.log("No valid session found for token:", token)
      return null
    }

    const user = this.getUserById(session.userId)
    console.log("Session validated for user:", user?.username)
    return user
  }

  destroySession(token: string): void {
    const sessions = this.getSessions()
    const filteredSessions = sessions.filter((s) => s.token !== token)
    this.saveSessions(filteredSessions)

    try {
      localStorage.removeItem("casino_session_token")
      console.log("Session destroyed")
    } catch (error) {
      console.error("Error destroying session:", error)
    }
  }
}

export const db = new Database()
