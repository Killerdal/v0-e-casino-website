"use client"

import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { CryptoDepositReal } from "@/components/crypto-deposit-real"
import { Dashboard } from "@/components/dashboard"
import { Games } from "@/components/games"
import { Transactions } from "@/components/transactions"
import { Profile } from "@/components/profile"
import { WalletConnect } from "@/components/wallet-connect"
import { AuthPage } from "@/components/auth-page"
import { SettingsPage } from "@/components/settings-page"
import { SportsBetting } from "@/components/sports-betting"
import { BonusesPage } from "@/components/bonuses-page"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Skull, LogOut } from "lucide-react"

function CasinoAppContent() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const { user, logout, isLoading } = useAuth()

  // Debug logging
  useEffect(() => {
    console.log("=== APP STATE ===")
    console.log("User:", user)
    console.log("Is loading:", isLoading)
    console.log("Active section:", activeSection)
  }, [user, isLoading, activeSection])

  const renderContent = () => {
    console.log("Rendering content for section:", activeSection)

    switch (activeSection) {
      case "dashboard":
        return <Dashboard userBalance={user?.balance || 0} />
      case "deposit":
        return <CryptoDepositReal />
      case "games":
        return (
          <Games
            userBalance={user?.balance || 0}
            onBalanceChange={(newBalance) => {
              console.log("Balance change requested:", newBalance)
            }}
          />
        )
      case "transactions":
        return <Transactions />
      case "profile":
        return <Profile />
      case "wallet":
        return <WalletConnect onWalletConnect={setConnectedWallet} connectedWallet={connectedWallet} />
      case "sports":
        return (
          <SportsBetting
            userBalance={user?.balance || 0}
            onBalanceChange={(newBalance) => {
              console.log("Balance change requested:", newBalance)
            }}
          />
        )
      case "settings":
        return <SettingsPage />
      case "bonuses":
        return <BonusesPage />
      case "withdraw":
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Withdrawal System</h2>
            <p className="text-gray-400">Withdrawal functionality coming soon...</p>
          </div>
        )
      case "rewards":
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Rewards Program</h2>
            <p className="text-gray-400">Rewards system coming soon...</p>
          </div>
        )
      default:
        return <Dashboard userBalance={user?.balance || 0} />
    }
  }

  const handleLogout = () => {
    console.log("Logout clicked")
    logout()
    setConnectedWallet(null)
    setActiveSection("dashboard")
  }

  const handleSectionChange = (section: string) => {
    console.log("Section change requested:", section)
    setActiveSection(section)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center border border-red-500/30 mx-auto animate-pulse">
            <Skull className="h-10 w-10 text-white" />
          </div>
          <p className="text-red-400">Loading Red Syndicate...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log("No user found, showing auth page")
    return <AuthPage />
  }

  console.log("User authenticated, showing main app for:", user.username)
  return (
    <div className="min-h-screen bg-black">
      <SidebarProvider>
        <AppSidebar
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
          connectedWallet={connectedWallet}
          userBalance={user.balance}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-red-900/20 bg-black/90 backdrop-blur-sm px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 text-red-500 hover:text-red-400" />
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center border border-red-500/30">
                    <Skull className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-red-500 tracking-wider">RED SYNDICATE</h1>
                  <p className="text-xs text-red-400/70">JOIN THE REVOLUTION</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome, {user.username}</p>
                <p className="text-lg font-bold text-green-400">${user.balance.toFixed(2)}</p>
              </div>
              {connectedWallet && (
                <div className="text-right">
                  <p className="text-xs text-gray-400">Wallet</p>
                  <p className="text-sm text-red-400 font-mono">
                    {connectedWallet.slice(0, 6)}...{connectedWallet.slice(-4)}
                  </p>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-gradient-to-br from-black via-gray-900 to-black">
            {renderContent()}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default function CasinoApp() {
  return (
    <AuthProvider>
      <CasinoAppContent />
    </AuthProvider>
  )
}
