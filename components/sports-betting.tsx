"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target, Clock, TrendingUp, Play, Trophy, Timer, Zap, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Match {
  id: string
  sport: string
  league: string
  homeTeam: string
  awayTeam: string
  homeOdds: number
  awayOdds: number
  drawOdds?: number
  status: "live" | "upcoming" | "finished"
  time: string
  score?: { home: number; away: number }
  minute?: number
  markets: Market[]
}

interface Market {
  id: string
  name: string
  options: MarketOption[]
}

interface MarketOption {
  id: string
  name: string
  odds: number
}

interface Bet {
  id: string
  matchId: string
  marketId: string
  optionId: string
  matchName: string
  selection: string
  odds: number
  stake: number
  potentialWin: number
}

const initialMatches: Match[] = [
  {
    id: "1",
    sport: "Football",
    league: "Premier League",
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    homeOdds: 2.45,
    awayOdds: 2.8,
    drawOdds: 3.2,
    status: "live",
    time: "45'",
    score: { home: 1, away: 1 },
    minute: 45,
    markets: [
      {
        id: "match_result",
        name: "Match Result",
        options: [
          { id: "home", name: "Manchester United", odds: 2.45 },
          { id: "draw", name: "Draw", odds: 3.2 },
          { id: "away", name: "Liverpool", odds: 2.8 },
        ],
      },
      {
        id: "total_goals",
        name: "Total Goals",
        options: [
          { id: "over_2_5", name: "Over 2.5", odds: 1.85 },
          { id: "under_2_5", name: "Under 2.5", odds: 1.95 },
        ],
      },
    ],
  },
  {
    id: "2",
    sport: "Basketball",
    league: "NBA",
    homeTeam: "Lakers",
    awayTeam: "Warriors",
    homeOdds: 1.9,
    awayOdds: 1.9,
    status: "live",
    time: "Q3 8:45",
    score: { home: 89, away: 92 },
    markets: [
      {
        id: "match_winner",
        name: "Match Winner",
        options: [
          { id: "home", name: "Lakers", odds: 1.9 },
          { id: "away", name: "Warriors", odds: 1.9 },
        ],
      },
      {
        id: "total_points",
        name: "Total Points",
        options: [
          { id: "over_220", name: "Over 220.5", odds: 1.95 },
          { id: "under_220", name: "Under 220.5", odds: 1.85 },
        ],
      },
    ],
  },
  {
    id: "3",
    sport: "Tennis",
    league: "ATP",
    homeTeam: "Djokovic",
    awayTeam: "Nadal",
    homeOdds: 1.75,
    awayOdds: 2.1,
    status: "upcoming",
    time: "15:30",
    markets: [
      {
        id: "match_winner",
        name: "Match Winner",
        options: [
          { id: "home", name: "Djokovic", odds: 1.75 },
          { id: "away", name: "Nadal", odds: 2.1 },
        ],
      },
      {
        id: "total_sets",
        name: "Total Sets",
        options: [
          { id: "over_3_5", name: "Over 3.5", odds: 2.2 },
          { id: "under_3_5", name: "Under 3.5", odds: 1.65 },
        ],
      },
    ],
  },
  {
    id: "4",
    sport: "Football",
    league: "Champions League",
    homeTeam: "Barcelona",
    awayTeam: "PSG",
    homeOdds: 2.1,
    awayOdds: 3.4,
    drawOdds: 3.1,
    status: "upcoming",
    time: "20:00",
    markets: [
      {
        id: "match_result",
        name: "Match Result",
        options: [
          { id: "home", name: "Barcelona", odds: 2.1 },
          { id: "draw", name: "Draw", odds: 3.1 },
          { id: "away", name: "PSG", odds: 3.4 },
        ],
      },
    ],
  },
]

interface SportsBettingProps {
  userBalance: number
  onBalanceChange: (newBalance: number) => void
}

export function SportsBetting({ userBalance, onBalanceChange }: SportsBettingProps) {
  const [matches, setMatches] = useState<Match[]>(initialMatches)
  const [selectedSport, setSelectedSport] = useState("all")
  const [betSlip, setBetSlip] = useState<Bet[]>([])
  const [isPlacingBet, setIsPlacingBet] = useState(false)
  const { toast } = useToast()

  // Simulate real-time odds updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches((prevMatches) =>
        prevMatches.map((match) => ({
          ...match,
          markets: match.markets.map((market) => ({
            ...market,
            options: market.options.map((option) => ({
              ...option,
              odds: Math.max(1.1, option.odds + (Math.random() - 0.5) * 0.1),
            })),
          })),
          // Update live match scores occasionally
          ...(match.status === "live" && Math.random() > 0.95
            ? {
                score: {
                  home: match.score!.home + (Math.random() > 0.7 ? 1 : 0),
                  away: match.score!.away + (Math.random() > 0.7 ? 1 : 0),
                },
                minute: Math.min(90, (match.minute || 0) + 1),
              }
            : {}),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const addToBetSlip = (match: Match, market: Market, option: MarketOption) => {
    const existingBet = betSlip.find(
      (bet) => bet.matchId === match.id && bet.marketId === market.id && bet.optionId === option.id,
    )

    if (existingBet) {
      toast({
        title: "Already in Bet Slip",
        description: "This selection is already in your bet slip",
        variant: "destructive",
      })
      return
    }

    const newBet: Bet = {
      id: `${match.id}_${market.id}_${option.id}`,
      matchId: match.id,
      marketId: market.id,
      optionId: option.id,
      matchName: `${match.homeTeam} vs ${match.awayTeam}`,
      selection: `${market.name}: ${option.name}`,
      odds: option.odds,
      stake: 0,
      potentialWin: 0,
    }

    setBetSlip([...betSlip, newBet])
    toast({
      title: "Added to Bet Slip",
      description: `${option.name} @ ${option.odds.toFixed(2)}`,
    })
  }

  const updateBetStake = (betId: string, stake: number) => {
    setBetSlip(betSlip.map((bet) => (bet.id === betId ? { ...bet, stake, potentialWin: stake * bet.odds } : bet)))
  }

  const removeBet = (betId: string) => {
    setBetSlip(betSlip.filter((bet) => bet.id !== betId))
  }

  const placeBets = async () => {
    const validBets = betSlip.filter((bet) => bet.stake > 0)
    if (validBets.length === 0) {
      toast({
        title: "No Valid Bets",
        description: "Please add stakes to your bets",
        variant: "destructive",
      })
      return
    }

    const totalStake = validBets.reduce((sum, bet) => sum + bet.stake, 0)
    if (totalStake > userBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for these bets",
        variant: "destructive",
      })
      return
    }

    setIsPlacingBet(true)

    // Simulate bet placement
    setTimeout(() => {
      onBalanceChange(userBalance - totalStake)
      setBetSlip([])
      setIsPlacingBet(false)

      toast({
        title: "Bets Placed Successfully!",
        description: `${validBets.length} bet(s) placed for $${totalStake.toFixed(2)}`,
      })

      // Simulate some bets winning after a delay
      setTimeout(() => {
        const winningBets = validBets.filter(() => Math.random() > 0.6)
        if (winningBets.length > 0) {
          const totalWinnings = winningBets.reduce((sum, bet) => sum + bet.potentialWin, 0)
          onBalanceChange((prev) => prev + totalWinnings)
          toast({
            title: "🎉 Congratulations!",
            description: `You won $${totalWinnings.toFixed(2)} from ${winningBets.length} bet(s)!`,
          })
        }
      }, 10000)
    }, 2000)
  }

  const filteredMatches =
    selectedSport === "all" ? matches : matches.filter((match) => match.sport.toLowerCase() === selectedSport)

  const totalStake = betSlip.reduce((sum, bet) => sum + bet.stake, 0)
  const totalPotentialWin = betSlip.reduce((sum, bet) => sum + bet.potentialWin, 0)

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center border border-red-500/30">
            <Target className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-red-500">LIVE SPORTS BETTING</h2>
        <p className="text-gray-400">Real-time odds • Live betting • Instant payouts</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Betting Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sports Filter */}
          <Card className="bg-black/40 border-red-600/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Label className="text-gray-300">Sport:</Label>
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger className="w-48 bg-black/50 border-red-600/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-600/30">
                    <SelectItem value="all" className="text-white hover:bg-red-600/20">
                      All Sports
                    </SelectItem>
                    <SelectItem value="football" className="text-white hover:bg-red-600/20">
                      Football
                    </SelectItem>
                    <SelectItem value="basketball" className="text-white hover:bg-red-600/20">
                      Basketball
                    </SelectItem>
                    <SelectItem value="tennis" className="text-white hover:bg-red-600/20">
                      Tennis
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Badge className="bg-green-600/20 text-green-400 border-green-500/30 ml-auto">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  LIVE ODDS
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Live Matches */}
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <Card key={match.id} className="bg-black/40 border-red-600/20 hover:border-red-500/40 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={match.status === "live" ? "default" : "secondary"}
                        className={
                          match.status === "live"
                            ? "bg-red-600/20 text-red-400 border-red-500/30"
                            : "bg-gray-600/20 text-gray-400 border-gray-500/30"
                        }
                      >
                        {match.status === "live" && (
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                        )}
                        {match.status.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-400">{match.league}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-400">{match.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-400">{match.sport}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Teams and Score */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-white text-lg">{match.homeTeam}</span>
                        {match.score && <span className="text-2xl font-bold text-green-400">{match.score.home}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-white text-lg">{match.awayTeam}</span>
                        {match.score && <span className="text-2xl font-bold text-green-400">{match.score.away}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Markets */}
                  <Tabs defaultValue={match.markets[0]?.id} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-black/50">
                      {match.markets.map((market) => (
                        <TabsTrigger
                          key={market.id}
                          value={market.id}
                          className="data-[state=active]:bg-red-600/30 data-[state=active]:text-red-400"
                        >
                          {market.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {match.markets.map((market) => (
                      <TabsContent key={market.id} value={market.id} className="mt-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {market.options.map((option) => (
                            <Button
                              key={option.id}
                              variant="outline"
                              className="h-16 flex flex-col items-center justify-center bg-black/50 border-red-600/30 text-white hover:bg-red-600/20 hover:border-red-500/50"
                              onClick={() => addToBetSlip(match, market, option)}
                            >
                              <span className="text-sm font-medium">{option.name}</span>
                              <span className="text-lg font-bold text-green-400">{option.odds.toFixed(2)}</span>
                            </Button>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bet Slip */}
        <div className="lg:col-span-1">
          <Card className="bg-black/40 border-red-600/20 sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Target className="h-5 w-5" />
                Bet Slip ({betSlip.length})
              </CardTitle>
              <CardDescription className="text-gray-400">Balance: ${userBalance.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {betSlip.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Click on odds to add bets</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {betSlip.map((bet) => (
                      <div key={bet.id} className="p-3 bg-red-900/20 rounded-lg border border-red-600/20">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{bet.matchName}</p>
                            <p className="text-xs text-gray-400">{bet.selection}</p>
                            <p className="text-sm text-green-400 font-bold">@{bet.odds.toFixed(2)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBet(bet.id)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-300">Stake ($)</Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={bet.stake || ""}
                            onChange={(e) => updateBetStake(bet.id, Number.parseFloat(e.target.value) || 0)}
                            className="bg-black/50 border-red-600/30 text-white text-sm h-8"
                            max={userBalance}
                          />
                          {bet.stake > 0 && (
                            <p className="text-xs text-green-400">Potential win: ${bet.potentialWin.toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bet Slip Summary */}
                  <div className="border-t border-red-600/20 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Stake:</span>
                      <span className="text-white font-bold">${totalStake.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Potential Win:</span>
                      <span className="text-green-400 font-bold">${totalPotentialWin.toFixed(2)}</span>
                    </div>
                    <Button
                      onClick={placeBets}
                      disabled={isPlacingBet || totalStake === 0 || totalStake > userBalance}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                    >
                      {isPlacingBet ? (
                        <>
                          <Timer className="h-4 w-4 mr-2 animate-spin" />
                          Placing Bets...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Place Bet{betSlip.length > 1 ? "s" : ""}
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-black/40 border-red-600/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-600/20 flex items-center justify-center">
                <Play className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Live Matches</p>
                <p className="text-xl font-bold text-green-400">{matches.filter((m) => m.status === "live").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-red-600/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Upcoming</p>
                <p className="text-xl font-bold text-blue-400">
                  {matches.filter((m) => m.status === "upcoming").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-red-600/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-600/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Active Bets</p>
                <p className="text-xl font-bold text-yellow-400">{betSlip.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-red-600/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Markets</p>
                <p className="text-xl font-bold text-purple-400">
                  {matches.reduce((sum, match) => sum + match.markets.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
