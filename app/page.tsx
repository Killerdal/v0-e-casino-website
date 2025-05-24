"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { CryptoDeposit } from "@/components/crypto-deposit"
import { Dashboard } from "@/components/dashboard"
import { Games } from "@/components/games"
import { Transactions } from "@/components/transactions"
import { Profile } from "@/components/profile"
import { WalletConnect } from "@/components/wallet-connect"
import { LoginPage } from "@/components/login-page"
import { Button } from "@/components/ui/button"
import { Skull, LogOut } from "lucide-react"
import { SportsBetting } from "@/components/sports-betting"

export default function CasinoApp() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [userBalance, setUserBalance] = useState(2350.75)

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard userBalance={userBalance} />
      case "deposit":
        return <CryptoDeposit onDepositSuccess={(amount) => setUserBalance((prev) => prev + amount)} />
      case "games":
        return <Games userBalance={userBalance} onBalanceChange={setUserBalance} />
      case "transactions":
        return <Transactions />
      case "profile":
        return <Profile />
      case "wallet":
        return <WalletConnect onWalletConnect={setConnectedWallet} connectedWallet={connectedWallet} />
      case "sports":
        return <SportsBetting userBalance={userBalance} onBalanceChange={setUserBalance} />
      default:
        return <Dashboard userBalance={userBalance} />
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setConnectedWallet(null)
    setActiveSection("dashboard")
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={setIsLoggedIn} />
  }

  return (
    <div className="min-h-screen bg-black">
      <SidebarProvider>
        <AppSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          connectedWallet={connectedWallet}
          userBalance={userBalance}
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
                <p className="text-sm text-gray-400">Balance</p>
                <p className="text-lg font-bold text-green-400">${userBalance.toFixed(2)}</p>
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
