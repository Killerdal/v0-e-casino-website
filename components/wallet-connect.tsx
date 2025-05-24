"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, CheckCircle, ExternalLink, Copy, Skull } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const walletProviders = [
  {
    name: "MetaMask",
    id: "metamask",
    icon: "🦊",
    description: "Connect using MetaMask browser extension",
    popular: true,
  },
  {
    name: "Trust Wallet",
    id: "trust",
    icon: "🛡️",
    description: "Connect using Trust Wallet mobile app",
    popular: true,
  },
  {
    name: "WalletConnect",
    id: "walletconnect",
    icon: "🔗",
    description: "Connect using WalletConnect protocol",
    popular: false,
  },
  {
    name: "Coinbase Wallet",
    id: "coinbase",
    icon: "🔵",
    description: "Connect using Coinbase Wallet",
    popular: false,
  },
  {
    name: "Phantom",
    id: "phantom",
    icon: "👻",
    description: "Connect using Phantom wallet (Solana)",
    popular: false,
  },
]

interface WalletConnectProps {
  onWalletConnect: (address: string) => void
  connectedWallet: string | null
}

export function WalletConnect({ onWalletConnect, connectedWallet }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [walletBalance, setWalletBalance] = useState("1.2345")
  const { toast } = useToast()

  const connectWallet = async (walletId: string) => {
    setIsConnecting(walletId)

    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`
      onWalletConnect(mockAddress)
      setIsConnecting(null)
      toast({
        title: "Wallet Connected!",
        description: `Successfully connected to ${walletProviders.find((w) => w.id === walletId)?.name}`,
      })
    }, 2000)
  }

  const disconnectWallet = () => {
    onWalletConnect("")
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const copyAddress = () => {
    if (connectedWallet) {
      navigator.clipboard.writeText(connectedWallet)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center border border-red-500/30">
            <Skull className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-red-500">Web3 Wallet</h2>
        <p className="text-gray-400">Connect your crypto wallet to the Red Syndicate</p>
      </div>

      {connectedWallet ? (
        <Card className="bg-black/40 border-green-600/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              Wallet Connected
            </CardTitle>
            <CardDescription className="text-gray-400">Your wallet is successfully connected</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-600/20">
                <div>
                  <p className="text-sm text-gray-400">Wallet Address</p>
                  <p className="font-mono text-sm text-green-400">{connectedWallet}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyAddress}
                  className="border-green-600/30 text-green-400 hover:bg-green-600/20"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-600/20">
                <div>
                  <p className="text-sm text-gray-400">ETH Balance</p>
                  <p className="text-lg font-bold text-blue-400">{walletBalance} ETH</p>
                </div>
                <Button variant="outline" size="sm" className="border-blue-600/30 text-blue-400 hover:bg-blue-600/20">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Etherscan
                </Button>
              </div>
            </div>

            <Button onClick={disconnectWallet} variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
              Disconnect Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <Alert className="bg-red-900/20 border-red-600/30">
            <Wallet className="h-4 w-4" />
            <AlertDescription className="text-gray-300">
              Connect your Web3 wallet to deposit crypto, play games, and withdraw winnings securely.
            </AlertDescription>
          </Alert>

          <div className="grid gap-3">
            {walletProviders.map((wallet) => (
              <Card key={wallet.id} className="bg-black/40 border-red-600/20 hover:border-red-500/40 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{wallet.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{wallet.name}</h3>
                          {wallet.popular && (
                            <Badge variant="secondary" className="bg-red-600/20 text-red-400 border-red-500/30">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{wallet.description}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => connectWallet(wallet.id)}
                      disabled={isConnecting === wallet.id}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isConnecting === wallet.id ? "Connecting..." : "Connect"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
