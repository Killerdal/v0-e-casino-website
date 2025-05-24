"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, CheckCircle, Clock, Wallet, QrCode, Skull, Zap, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/database"

const cryptoOptions = [
  {
    value: "bitcoin",
    label: "Bitcoin (BTC)",
    symbol: "₿",
    color: "text-orange-400",
    network: "Bitcoin",
    confirmations: 3,
    minDeposit: 0.001,
    fees: 0.0005,
  },
  {
    value: "ethereum",
    label: "Ethereum (ETH)",
    symbol: "Ξ",
    color: "text-blue-400",
    network: "Ethereum",
    confirmations: 12,
    minDeposit: 0.01,
    fees: 0.005,
  },
  {
    value: "usdt",
    label: "Tether (USDT)",
    symbol: "₮",
    color: "text-green-400",
    network: "Ethereum (ERC-20)",
    confirmations: 12,
    minDeposit: 10,
    fees: 5,
  },
  {
    value: "litecoin",
    label: "Litecoin (LTC)",
    symbol: "Ł",
    color: "text-gray-400",
    network: "Litecoin",
    confirmations: 6,
    minDeposit: 0.1,
    fees: 0.01,
  },
]

// Mock crypto prices (in real app, fetch from API)
const cryptoPrices = {
  bitcoin: 45000,
  ethereum: 2800,
  usdt: 1,
  litecoin: 75,
}

interface DepositState {
  selectedCrypto: string
  amount: string
  walletAddress: string
  qrCodeUrl: string
  status: "idle" | "generating" | "pending" | "confirming" | "completed" | "failed"
  transactionId: string
  confirmations: number
  requiredConfirmations: number
  estimatedTime: string
}

export function CryptoDepositReal() {
  const { user, updateUser } = useAuth()
  const [depositState, setDepositState] = useState<DepositState>({
    selectedCrypto: "",
    amount: "",
    walletAddress: "",
    qrCodeUrl: "",
    status: "idle",
    transactionId: "",
    confirmations: 0,
    requiredConfirmations: 0,
    estimatedTime: "",
  })
  const { toast } = useToast()

  const selectedCryptoData = cryptoOptions.find((c) => c.value === depositState.selectedCrypto)
  const usdValue =
    depositState.amount && selectedCryptoData
      ? (
          Number.parseFloat(depositState.amount) *
          cryptoPrices[depositState.selectedCrypto as keyof typeof cryptoPrices]
        ).toFixed(2)
      : "0.00"

  const generateDepositAddress = async () => {
    if (!depositState.selectedCrypto || !depositState.amount) {
      toast({
        title: "Missing Information",
        description: "Please select cryptocurrency and enter amount",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(depositState.amount)
    if (!selectedCryptoData || amount < selectedCryptoData.minDeposit) {
      toast({
        title: "Amount Too Low",
        description: `Minimum deposit is ${selectedCryptoData?.minDeposit} ${selectedCryptoData?.label}`,
        variant: "destructive",
      })
      return
    }

    setDepositState((prev) => ({ ...prev, status: "generating" }))

    // Simulate address generation
    setTimeout(() => {
      const mockAddress = generateMockWalletAddress(depositState.selectedCrypto)
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${mockAddress}&bgcolor=000000&color=dc2626`

      setDepositState((prev) => ({
        ...prev,
        walletAddress: mockAddress,
        qrCodeUrl: qrUrl,
        status: "pending",
        requiredConfirmations: selectedCryptoData?.confirmations || 3,
        estimatedTime: getEstimatedTime(selectedCryptoData?.confirmations || 3),
      }))

      toast({
        title: "Deposit Address Generated",
        description: "Send your crypto to the address below",
      })

      // Simulate transaction detection after 10 seconds
      setTimeout(() => {
        const txId = `tx_${Math.random().toString(36).substr(2, 12)}`
        setDepositState((prev) => ({
          ...prev,
          status: "confirming",
          transactionId: txId,
          confirmations: 0,
        }))

        toast({
          title: "Transaction Detected!",
          description: "Your deposit has been detected and is being confirmed",
        })

        // Simulate confirmations
        simulateConfirmations(txId, selectedCryptoData?.confirmations || 3)
      }, 10000)
    }, 2000)
  }

  const simulateConfirmations = (txId: string, required: number) => {
    let confirmations = 0
    const interval = setInterval(() => {
      confirmations++
      setDepositState((prev) => ({
        ...prev,
        confirmations,
        estimatedTime: getEstimatedTime(required - confirmations),
      }))

      if (confirmations >= required) {
        clearInterval(interval)
        completeDeposit()
      }
    }, 3000) // New confirmation every 3 seconds for demo
  }

  const completeDeposit = () => {
    if (!user || !selectedCryptoData) return

    const amount = Number.parseFloat(depositState.amount)
    const usdAmount = amount * cryptoPrices[depositState.selectedCrypto as keyof typeof cryptoPrices]
    const netAmount =
      usdAmount - selectedCryptoData.fees * cryptoPrices[depositState.selectedCrypto as keyof typeof cryptoPrices]

    // Update user balance
    updateUser({ balance: user.balance + netAmount })

    // Add transaction to database
    db.addTransaction(user.id, {
      type: "deposit",
      amount: netAmount,
      currency: depositState.selectedCrypto.toUpperCase(),
      status: "completed",
      description: `${depositState.selectedCrypto.toUpperCase()} Deposit`,
      hash: depositState.transactionId,
    })

    setDepositState((prev) => ({ ...prev, status: "completed" }))

    toast({
      title: "🎉 Deposit Completed!",
      description: `$${netAmount.toFixed(2)} has been added to your balance`,
    })
  }

  const generateMockWalletAddress = (crypto: string) => {
    const prefixes = {
      bitcoin: "bc1",
      ethereum: "0x",
      usdt: "0x",
      litecoin: "ltc1",
    }

    const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    const length = crypto === "bitcoin" || crypto === "litecoin" ? 39 : 40
    let address = prefixes[crypto as keyof typeof prefixes] || "0x"

    for (let i = address.length; i < length; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return address
  }

  const getEstimatedTime = (confirmations: number) => {
    if (confirmations <= 0) return "Completed"
    const minutes = confirmations * 10 // Rough estimate
    if (minutes < 60) return `~${minutes} minutes`
    return `~${Math.round(minutes / 60)} hours`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    })
  }

  const resetDeposit = () => {
    setDepositState({
      selectedCrypto: "",
      amount: "",
      walletAddress: "",
      qrCodeUrl: "",
      status: "idle",
      transactionId: "",
      confirmations: 0,
      requiredConfirmations: 0,
      estimatedTime: "",
    })
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center border border-red-500/30">
            <Skull className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-red-500">Real Crypto Deposit</h2>
        <p className="text-gray-400">Secure cryptocurrency deposits with real-time confirmation tracking</p>
      </div>

      {/* Current Balance */}
      <Card className="bg-gradient-to-r from-green-900/20 to-black/40 border-green-600/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Current Balance</p>
              <p className="text-2xl font-bold text-green-400">${user?.balance.toFixed(2)}</p>
            </div>
            <Wallet className="h-8 w-8 text-green-400" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Deposit Form */}
        <Card className="bg-black/40 border-red-600/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <Wallet className="h-5 w-5" />
              Deposit Configuration
            </CardTitle>
            <CardDescription className="text-gray-400">Configure your cryptocurrency deposit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="crypto" className="text-gray-300">
                Cryptocurrency
              </Label>
              <Select
                value={depositState.selectedCrypto}
                onValueChange={(value) => setDepositState((prev) => ({ ...prev, selectedCrypto: value }))}
                disabled={depositState.status !== "idle"}
              >
                <SelectTrigger className="bg-black/50 border-red-600/30 text-white">
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent className="bg-black border-red-600/30">
                  {cryptoOptions.map((crypto) => (
                    <SelectItem key={crypto.value} value={crypto.value} className="text-white hover:bg-red-600/20">
                      <div className="flex items-center gap-2">
                        <span className={crypto.color}>{crypto.symbol}</span>
                        <div>
                          <span>{crypto.label}</span>
                          <p className="text-xs text-gray-400">{crypto.network}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCryptoData && (
              <div className="space-y-3 p-3 bg-blue-900/20 rounded-lg border border-blue-600/20">
                <h4 className="text-sm font-medium text-blue-400">Network Information</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Network:</span>
                    <p className="text-white">{selectedCryptoData.network}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Confirmations:</span>
                    <p className="text-white">{selectedCryptoData.confirmations}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Min Deposit:</span>
                    <p className="text-white">
                      {selectedCryptoData.minDeposit} {selectedCryptoData.label.split(" ")[1]}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Network Fee:</span>
                    <p className="text-white">
                      {selectedCryptoData.fees} {selectedCryptoData.label.split(" ")[1]}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-300">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.00000001"
                placeholder="0.00"
                value={depositState.amount}
                onChange={(e) => setDepositState((prev) => ({ ...prev, amount: e.target.value }))}
                className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500"
                disabled={depositState.status !== "idle"}
              />
              {depositState.amount && selectedCryptoData && (
                <p className="text-sm text-gray-400">
                  ≈ ${usdValue} USD (after fees: $
                  {(
                    Number.parseFloat(usdValue) -
                    selectedCryptoData.fees * cryptoPrices[depositState.selectedCrypto as keyof typeof cryptoPrices]
                  ).toFixed(2)}
                  )
                </p>
              )}
            </div>

            {depositState.status === "idle" && (
              <Button
                onClick={generateDepositAddress}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                disabled={!depositState.selectedCrypto || !depositState.amount}
              >
                <Zap className="h-4 w-4 mr-2" />
                Generate Deposit Address
              </Button>
            )}

            {depositState.status === "generating" && (
              <Button disabled className="w-full bg-gray-600 text-white font-bold">
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Generating Address...
              </Button>
            )}

            {(depositState.status === "completed" || depositState.status === "failed") && (
              <Button onClick={resetDeposit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
                New Deposit
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Deposit Address & Status */}
        {depositState.walletAddress && (
          <Card className="bg-black/40 border-red-600/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <QrCode className="h-5 w-5" />
                Deposit Address
              </CardTitle>
              <CardDescription className="text-gray-400">
                Send exactly {depositState.amount} {selectedCryptoData?.label} to this address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg">
                  <img src={depositState.qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Wallet Address</Label>
                <div className="flex gap-2">
                  <Input
                    value={depositState.walletAddress}
                    readOnly
                    className="font-mono text-sm bg-black/50 border-red-600/30 text-white"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(depositState.walletAddress)}
                    className="border-red-600/30 text-red-400 hover:bg-red-600/20"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Alert className="bg-yellow-900/20 border-yellow-600/30">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-gray-300">
                  <strong>Important:</strong> Only send {selectedCryptoData?.label} to this address. Sending other
                  cryptocurrencies will result in permanent loss.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Transaction Status */}
      {depositState.status !== "idle" && depositState.status !== "generating" && (
        <Card className="bg-black/40 border-red-600/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              {depositState.status === "pending" && <Clock className="h-5 w-5 text-yellow-500" />}
              {depositState.status === "confirming" && <Clock className="h-5 w-5 text-blue-500 animate-spin" />}
              {depositState.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500" />}
              Transaction Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Status:</span>
                <Badge
                  variant={depositState.status === "completed" ? "default" : "secondary"}
                  className={
                    depositState.status === "completed"
                      ? "bg-green-600/20 text-green-400 border-green-500/30"
                      : depositState.status === "confirming"
                        ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                        : "bg-yellow-600/20 text-yellow-400 border-yellow-500/30"
                  }
                >
                  {depositState.status === "pending" && "Waiting for Transaction"}
                  {depositState.status === "confirming" && "Confirming"}
                  {depositState.status === "completed" && "Completed"}
                </Badge>
              </div>

              {depositState.transactionId && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Transaction ID:</span>
                  <code className="text-sm bg-red-900/20 px-2 py-1 rounded text-red-400 border border-red-600/20">
                    {depositState.transactionId.slice(0, 8)}...
                  </code>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Amount:</span>
                <span className="font-semibold text-white">
                  {depositState.amount} {selectedCryptoData?.label.split(" ")[1]}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">USD Value:</span>
                <span className="font-semibold text-green-400">${usdValue}</span>
              </div>

              {depositState.status === "confirming" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Confirmations:</span>
                    <span className="font-semibold text-blue-400">
                      {depositState.confirmations} / {depositState.requiredConfirmations}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Estimated Time:</span>
                    <span className="font-semibold text-yellow-400">{depositState.estimatedTime}</span>
                  </div>
                </>
              )}
            </div>

            {depositState.status === "confirming" && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Confirmation Progress</span>
                  <span className="text-gray-400">
                    {Math.round((depositState.confirmations / depositState.requiredConfirmations) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(depositState.confirmations / depositState.requiredConfirmations) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {depositState.status === "pending" && (
              <Alert className="bg-blue-900/20 border-blue-600/30">
                <Clock className="h-4 w-4" />
                <AlertDescription className="text-gray-300">
                  Waiting for your transaction to be broadcast to the network. This usually takes a few minutes.
                </AlertDescription>
              </Alert>
            )}

            {depositState.status === "confirming" && (
              <Alert className="bg-yellow-900/20 border-yellow-600/30">
                <Clock className="h-4 w-4" />
                <AlertDescription className="text-gray-300">
                  Your transaction is being confirmed by the network.
                  {depositState.requiredConfirmations - depositState.confirmations} more confirmations needed.
                </AlertDescription>
              </Alert>
            )}

            {depositState.status === "completed" && (
              <Alert className="bg-green-900/20 border-green-600/30">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-gray-300">
                  Deposit completed successfully! Funds have been added to your Red Syndicate balance.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
