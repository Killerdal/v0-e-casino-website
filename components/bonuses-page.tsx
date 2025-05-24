"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Gift, Clock, Star, Zap, Trophy, Target, Skull, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

interface Bonus {
  id: string
  title: string
  description: string
  type: "welcome" | "deposit" | "cashback" | "free_spins" | "vip" | "daily"
  amount: number
  currency: string
  requirements: string
  expiresAt: string
  claimed: boolean
  progress?: number
  maxProgress?: number
}

const availableBonuses: Bonus[] = [
  {
    id: "welcome_100",
    title: "Welcome Bonus",
    description: "100% match on your first deposit up to $1000",
    type: "welcome",
    amount: 1000,
    currency: "USD",
    requirements: "Minimum deposit $50, 30x wagering",
    expiresAt: "2024-12-31",
    claimed: false,
    progress: 0,
    maxProgress: 50,
  },
  {
    id: "daily_cashback",
    title: "Daily Cashback",
    description: "Get 10% cashback on all losses today",
    type: "cashback",
    amount: 10,
    currency: "%",
    requirements: "Minimum $100 in losses",
    expiresAt: "2024-01-20",
    claimed: false,
    progress: 45,
    maxProgress: 100,
  },
  {
    id: "free_spins_50",
    title: "50 Free Spins",
    description: "Free spins on Lightning Slots",
    type: "free_spins",
    amount: 50,
    currency: "spins",
    requirements: "No wagering requirements",
    expiresAt: "2024-01-25",
    claimed: false,
  },
  {
    id: "vip_reload",
    title: "VIP Reload Bonus",
    description: "50% reload bonus for VIP members",
    type: "vip",
    amount: 500,
    currency: "USD",
    requirements: "VIP Gold status required",
    expiresAt: "2024-01-30",
    claimed: false,
  },
  {
    id: "weekend_boost",
    title: "Weekend Boost",
    description: "25% extra on all deposits this weekend",
    type: "deposit",
    amount: 25,
    currency: "%",
    requirements: "Weekend deposits only",
    expiresAt: "2024-01-21",
    claimed: true,
  },
]

export function BonusesPage() {
  const [bonuses, setBonuses] = useState(availableBonuses)
  const [isLoading, setIsLoading] = useState(false)
  const { user, updateUser } = useAuth()
  const { toast } = useToast()

  const claimBonus = async (bonusId: string) => {
    if (!user) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const bonus = bonuses.find((b) => b.id === bonusId)
      if (!bonus) return

      // Update bonus as claimed
      setBonuses((prev) => prev.map((b) => (b.id === bonusId ? { ...b, claimed: true } : b)))

      // Add bonus amount to user balance (simplified)
      if (bonus.currency === "USD") {
        updateUser({ balance: user.balance + bonus.amount })
      }

      toast({
        title: "🎉 Bonus Claimed!",
        description: `${bonus.title} has been added to your account`,
      })

      setIsLoading(false)
    }, 1500)
  }

  const getBonusIcon = (type: string) => {
    switch (type) {
      case "welcome":
        return <Gift className="h-5 w-5" />
      case "deposit":
        return <Zap className="h-5 w-5" />
      case "cashback":
        return <Target className="h-5 w-5" />
      case "free_spins":
        return <Star className="h-5 w-5" />
      case "vip":
        return <Trophy className="h-5 w-5" />
      case "daily":
        return <Clock className="h-5 w-5" />
      default:
        return <Gift className="h-5 w-5" />
    }
  }

  const getBonusColor = (type: string) => {
    switch (type) {
      case "welcome":
        return "text-green-400"
      case "deposit":
        return "text-blue-400"
      case "cashback":
        return "text-purple-400"
      case "free_spins":
        return "text-yellow-400"
      case "vip":
        return "text-orange-400"
      case "daily":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const diff = expires.getTime() - now.getTime()

    if (diff <= 0) return "Expired"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center border border-red-500/30">
            <Skull className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-red-500">Bonuses & Rewards</h2>
        <p className="text-gray-400">Claim exclusive bonuses and boost your gaming experience</p>
      </div>

      {/* Bonus Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-black/40 border-red-600/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-600/20 flex items-center justify-center">
                <Gift className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Available Bonuses</p>
                <p className="text-xl font-bold text-green-400">{bonuses.filter((b) => !b.claimed).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-red-600/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Claimed Bonuses</p>
                <p className="text-xl font-bold text-blue-400">{bonuses.filter((b) => b.claimed).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-red-600/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-600/20 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Value</p>
                <p className="text-xl font-bold text-yellow-400">
                  ${bonuses.filter((b) => b.currency === "USD").reduce((sum, b) => sum + b.amount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Bonuses */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-red-400">Available Bonuses</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {bonuses
            .filter((bonus) => !bonus.claimed)
            .map((bonus) => (
              <Card key={bonus.id} className="bg-black/40 border-red-600/20 hover:border-red-500/40 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-12 w-12 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center border border-red-500/30 ${getBonusColor(bonus.type)}`}
                      >
                        {getBonusIcon(bonus.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white">{bonus.title}</CardTitle>
                        <CardDescription className="text-gray-400">{bonus.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-red-600/20 text-red-400 border-red-500/30 capitalize">
                      {bonus.type.replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Bonus Amount:</span>
                    <span className="font-bold text-green-400">
                      {bonus.amount} {bonus.currency === "USD" ? "$" : bonus.currency}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-gray-300 text-sm">Requirements:</span>
                    <p className="text-xs text-gray-400">{bonus.requirements}</p>
                  </div>

                  {bonus.progress !== undefined && bonus.maxProgress && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-gray-400">
                          {bonus.progress}/{bonus.maxProgress}
                        </span>
                      </div>
                      <Progress value={(bonus.progress / bonus.maxProgress) * 100} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>Expires: {getTimeRemaining(bonus.expiresAt)}</span>
                    </div>
                    <Button
                      onClick={() => claimBonus(bonus.id)}
                      disabled={
                        isLoading || (bonus.progress !== undefined && bonus.progress < (bonus.maxProgress || 0))
                      }
                      className="bg-red-600 hover:bg-red-700 text-white font-bold"
                    >
                      {isLoading ? "Claiming..." : "Claim Bonus"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Claimed Bonuses */}
      {bonuses.some((b) => b.claimed) && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-400">Claimed Bonuses</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {bonuses
              .filter((bonus) => bonus.claimed)
              .map((bonus) => (
                <Card key={bonus.id} className="bg-black/20 border-gray-600/20 opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-gray-600/20 flex items-center justify-center border border-gray-500/30">
                          <CheckCircle className="h-6 w-6 text-green-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-300">{bonus.title}</CardTitle>
                          <CardDescription className="text-gray-500">{bonus.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-green-600/20 text-green-400 border-green-500/30">Claimed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Bonus Amount:</span>
                      <span className="font-bold text-green-400">
                        {bonus.amount} {bonus.currency === "USD" ? "$" : bonus.currency}
                      </span>
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
