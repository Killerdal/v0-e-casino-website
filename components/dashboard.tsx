"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wallet, TrendingUp, Trophy, Gift, DollarSign, Users, Skull, Zap, Target, Play } from "lucide-react"

interface DashboardProps {
  userBalance: number
}

export function Dashboard({ userBalance }: DashboardProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center border border-red-500/30 shadow-xl">
            <Skull className="h-12 w-12 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-red-500">WELCOME TO THE REVOLUTION</h2>
          <p className="text-gray-400 text-lg">Red Syndicate - Where legends are born</p>
        </div>
      </div>

      {/* Welcome Bonus Section */}
      <Card className="bg-gradient-to-r from-red-900/40 to-black/60 border-red-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(220,38,38,0.2),transparent_70%)]"></div>
        <CardContent className="p-8 relative z-10">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-200 tracking-wider">WELCOME BONUS</h3>
            <div className="space-y-2">
              <p className="text-5xl font-bold text-red-500">100% UP TO</p>
              <p className="text-6xl font-bold text-red-400">$200</p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 text-lg tracking-wider hover:scale-105 transition-transform">
              Get Bonus
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-black/40 border-red-600/20 hover:border-red-500/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">${userBalance.toFixed(2)}</div>
            <p className="text-xs text-gray-400">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-red-600/20 hover:border-red-500/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Winnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">$12,450</div>
            <p className="text-xs text-gray-400">+15% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-red-600/20 hover:border-red-500/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">VIP Level</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">Gold</div>
            <p className="text-xs text-gray-400">2,500 XP to Platinum</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-red-600/20 hover:border-red-500/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Bonuses</CardTitle>
            <Gift className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">3</div>
            <p className="text-xs text-gray-400">$500 bonus available</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-black/40 border-red-600/20">
          <CardHeader>
            <CardTitle className="text-red-400">Recent Activity</CardTitle>
            <CardDescription className="text-gray-400">Your latest gaming sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-600/20 hover:bg-green-900/30 transition-colors">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-green-400" />
                <div>
                  <p className="font-medium text-white">Blackjack Win</p>
                  <p className="text-sm text-gray-400">2 hours ago</p>
                </div>
              </div>
              <Badge className="bg-green-600/20 text-green-400 border-green-500/30">+$250</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-600/20 hover:bg-red-900/30 transition-colors">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-red-400" />
                <div>
                  <p className="font-medium text-white">Lightning Slots</p>
                  <p className="text-sm text-gray-400">5 hours ago</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-red-600/20 text-red-400 border-red-500/30">
                -$50
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-600/20 hover:bg-green-900/30 transition-colors">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-green-400" />
                <div>
                  <p className="font-medium text-white">Roulette Win</p>
                  <p className="text-sm text-gray-400">1 day ago</p>
                </div>
              </div>
              <Badge className="bg-green-600/20 text-green-400 border-green-500/30">+$1,200</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-red-600/20">
          <CardHeader>
            <CardTitle className="text-red-400">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">Get started with these popular options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 hover:scale-105 transition-all"
              variant="outline"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Make a Deposit
            </Button>
            <Button
              className="w-full justify-start bg-yellow-600/20 border border-yellow-600/30 text-yellow-400 hover:bg-yellow-600/30 hover:scale-105 transition-all"
              variant="outline"
            >
              <Play className="mr-2 h-4 w-4" />
              Play Games
            </Button>
            <Button
              className="w-full justify-start bg-blue-600/20 border border-blue-600/30 text-blue-400 hover:bg-blue-600/30 hover:scale-105 transition-all"
              variant="outline"
            >
              <Users className="mr-2 h-4 w-4" />
              Invite Friends
            </Button>
            <Button
              className="w-full justify-start bg-purple-600/20 border border-purple-600/30 text-purple-400 hover:bg-purple-600/30 hover:scale-105 transition-all"
              variant="outline"
            >
              <Gift className="mr-2 h-4 w-4" />
              Claim Bonus
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Popular Games Preview */}
      <Card className="bg-black/40 border-red-600/20">
        <CardHeader>
          <CardTitle className="text-red-400">Popular Games</CardTitle>
          <CardDescription className="text-gray-400">Try our most popular games</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-red-900/20 rounded-lg border border-red-600/20 hover:border-red-500/40 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">Lightning Slots</p>
                  <p className="text-sm text-gray-400">234 players</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-red-900/20 rounded-lg border border-red-600/20 hover:border-red-500/40 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">Blackjack Classic</p>
                  <p className="text-sm text-gray-400">89 players</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-red-900/20 rounded-lg border border-red-600/20 hover:border-red-500/40 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">Fortune Wheel</p>
                  <p className="text-sm text-gray-400">123 players</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
