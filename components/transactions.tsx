import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, Skull } from "lucide-react"

const transactions = [
  {
    id: "tx_001",
    type: "deposit",
    amount: "$500.00",
    currency: "BTC",
    status: "completed",
    date: "2024-01-15 14:30",
    description: "Bitcoin Deposit",
    hash: "0x1234...5678",
  },
  {
    id: "tx_002",
    type: "withdrawal",
    amount: "$250.00",
    currency: "ETH",
    status: "pending",
    date: "2024-01-15 12:15",
    description: "Ethereum Withdrawal",
    hash: "0x9876...5432",
  },
  {
    id: "tx_003",
    type: "win",
    amount: "$1,200.00",
    currency: "USD",
    status: "completed",
    date: "2024-01-14 20:45",
    description: "Poker Tournament Win",
    hash: "game_001",
  },
  {
    id: "tx_004",
    type: "deposit",
    amount: "$100.00",
    currency: "USDT",
    status: "completed",
    date: "2024-01-14 16:20",
    description: "USDT Deposit",
    hash: "0x1111...2222",
  },
  {
    id: "tx_005",
    type: "bet",
    amount: "$50.00",
    currency: "USD",
    status: "completed",
    date: "2024-01-14 15:10",
    description: "Blackjack Bet",
    hash: "game_002",
  },
  {
    id: "tx_006",
    type: "withdrawal",
    amount: "$300.00",
    currency: "BTC",
    status: "failed",
    date: "2024-01-13 18:30",
    description: "Bitcoin Withdrawal",
    hash: "0x3333...4444",
  },
]

export function Transactions() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600/20 text-green-400 border-green-500/30">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">Pending</Badge>
      case "failed":
        return (
          <Badge variant="destructive" className="bg-red-600/20 text-red-400 border-red-500/30">
            Failed
          </Badge>
        )
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
      case "win":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case "withdrawal":
      case "bet":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
      case "win":
        return "text-green-400"
      case "withdrawal":
      case "bet":
        return "text-red-400"
      default:
        return "text-white"
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
        <h2 className="text-3xl font-bold tracking-tight text-red-500">Transaction History</h2>
        <p className="text-gray-400">View all your deposits, withdrawals, and gaming activity</p>
      </div>

      <Card className="bg-black/40 border-red-600/20">
        <CardHeader>
          <CardTitle className="text-red-400">Recent Transactions</CardTitle>
          <CardDescription className="text-gray-400">Your latest financial activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-red-600/20 rounded-lg bg-black/20 hover:bg-red-900/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(transaction.type)}
                    {getStatusIcon(transaction.status)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{transaction.description}</p>
                    <p className="text-sm text-gray-400">
                      {transaction.date} • {transaction.id}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">{transaction.hash}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className={`font-medium ${getTypeColor(transaction.type)}`}>{transaction.amount}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{transaction.currency}</span>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
