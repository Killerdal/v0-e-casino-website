"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, CheckCircle, Clock, Wallet, QrCode, Skull, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const cryptoOptions = [
  { value: "bitcoin", label: "Bitcoin (BTC)", symbol: "₿", color: "text-orange-400" },
  { value: "ethereum", label: "Ethereum (ETH)", symbol: "Ξ", color: "text-blue-400" },
  { value: "usdt", label: "Tether (USDT)", symbol: "₮", color: "text-green-400" },
  { value: "litecoin", label: "Litecoin (LTC)", symbol: "Ł", color: "text-gray-400" },
]

interface CryptoDepositProps {
  onDepositSuccess: (amount: number) => void
}

export function CryptoDeposit({ onDepositSuccess }: CryptoDepositProps) {
  const [selectedCrypto, setSelectedCrypto] = useState("")
  const [amount, setAmount] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [depositStatus, setDepositStatus] = useState<"pending" | "confirmed" | "failed" | null>(null)
  const [transactionId, setTransactionId] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (selectedCrypto) {
      const mockAddress = generateMockWalletAddress(selectedCrypto)
      setWalletAddress(mockAddress)
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${mockAddress}&bgcolor=000000&color=dc2626`
      setQrCodeUrl(qrUrl)
    }
  }, [selectedCrypto])

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    })
  }

  const simulateDeposit = () => {
    if (!amount || !selectedCrypto) return

    setDepositStatus("pending")
    setTransactionId(`tx_${Math.random().toString(36).substr(2, 9)}`)

    setTimeout(() => {
      setDepositStatus("confirmed")
      const depositAmount = Number.parseFloat(amount) * 100 // Convert crypto to USD (mock rate)
      onDepositSuccess(depositAmount)
      toast({
        title: "Deposit Confirmed!",
        description: `Your ${amount} ${selectedCrypto.toUpperCase()} deposit has been confirmed.`,
      })
    }, 5000)
  }

  const selectedCryptoData = cryptoOptions.find((c) => c.value === selectedCrypto)

  const copyAddress = (address: string) => {
    copyToClipboard(address)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center border border-red-500/30">
            <Skull className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-red-500">Crypto Deposit</h2>
        <p className="text-gray-400">Fund your Red Syndicate account with cryptocurrency</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-black/40 border-red-600/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <Wallet className="h-5 w-5" />
              Deposit Details
            </CardTitle>
            <CardDescription className="text-gray-400">Select cryptocurrency and enter amount</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="crypto" className="text-gray-300">
                Cryptocurrency
              </Label>
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <SelectTrigger className="bg-black/50 border-red-600/30 text-white">
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent className="bg-black border-red-600/30">
                  {cryptoOptions.map((crypto) => (
                    <SelectItem key={crypto.value} value={crypto.value} className="text-white hover:bg-red-600/20">
                      <div className="flex items-center gap-2">
                        <span className={crypto.color}>{crypto.symbol}</span>
                        <span>{crypto.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-300">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500"
              />
            </div>

            {selectedCrypto && amount && (
              <Button onClick={simulateDeposit} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">
                <Zap className="h-4 w-4 mr-2" />
                Generate Deposit Address
              </Button>
            )}
          </CardContent>
        </Card>

        {walletAddress && (
          <Card className="bg-black/40 border-red-600/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <QrCode className="h-5 w-5" />
                Deposit Address
              </CardTitle>
              <CardDescription className="text-gray-400">
                Send {selectedCryptoData?.label} to this address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg">
                  <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Wallet Address</Label>
                <div className="flex gap-2">
                  <Input
                    value={walletAddress}
                    readOnly
                    className="font-mono text-sm bg-black/50 border-red-600/30 text-white"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyAddress(walletAddress)}
                    className="border-red-600/30 text-red-400 hover:bg-red-600/20"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Alert className="bg-red-900/20 border-red-600/30">
                <AlertDescription className="text-gray-300">
                  Send exactly{" "}
                  <strong className={selectedCryptoData?.color}>
                    {amount} {selectedCrypto.toUpperCase()}
                  </strong>{" "}
                  to this address. Funds will be credited after network confirmation.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>

      {depositStatus && (
        <Card className="bg-black/40 border-red-600/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              {depositStatus === "pending" && <Clock className="h-5 w-5 text-yellow-500" />}
              {depositStatus === "confirmed" && <CheckCircle className="h-5 w-5 text-green-500" />}
              Transaction Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Status:</span>
              <Badge
                variant={depositStatus === "confirmed" ? "default" : "secondary"}
                className={
                  depositStatus === "confirmed"
                    ? "bg-green-600/20 text-green-400 border-green-500/30"
                    : "bg-yellow-600/20 text-yellow-400 border-yellow-500/30"
                }
              >
                {depositStatus === "pending" && "Pending Confirmation"}
                {depositStatus === "confirmed" && "Confirmed"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Transaction ID:</span>
              <code className="text-sm bg-red-900/20 px-2 py-1 rounded text-red-400 border border-red-600/20">
                {transactionId}
              </code>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Amount:</span>
              <span className="font-semibold text-white">
                {amount} {selectedCrypto.toUpperCase()}
              </span>
            </div>

            {depositStatus === "pending" && (
              <Alert className="bg-yellow-900/20 border-yellow-600/30">
                <Clock className="h-4 w-4" />
                <AlertDescription className="text-gray-300">
                  Waiting for blockchain confirmation. This usually takes 1-6 confirmations.
                </AlertDescription>
              </Alert>
            )}

            {depositStatus === "confirmed" && (
              <Alert className="bg-green-900/20 border-green-600/30">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-gray-300">
                  Deposit confirmed! Funds have been added to your Red Syndicate balance.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
