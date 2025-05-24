"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Heart, Diamond, Club, Zap, Star, Skull, RotateCcw, Play } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const games = [
  {
    id: 1,
    name: "Blackjack Classic",
    category: "Card Games",
    players: 89,
    minBet: "$1",
    maxBet: "$500",
    icon: Heart,
    popular: true,
    rtp: "99.5%",
    description: "Beat the dealer with 21",
  },
  {
    id: 2,
    name: "Lightning Slots",
    category: "Slots",
    players: 234,
    minBet: "$0.50",
    maxBet: "$100",
    icon: Zap,
    popular: true,
    rtp: "96.8%",
    description: "High voltage wins",
  },
  {
    id: 3,
    name: "Diamond Roulette",
    category: "Table Games",
    players: 67,
    minBet: "$2",
    maxBet: "$1000",
    icon: Diamond,
    popular: false,
    rtp: "97.3%",
    description: "European roulette",
  },
  {
    id: 4,
    name: "Mega Fortune Wheel",
    category: "Specialty",
    players: 123,
    minBet: "$1",
    maxBet: "$50",
    icon: Star,
    popular: true,
    rtp: "95.2%",
    description: "Spin for mega wins",
  },
  {
    id: 5,
    name: "Baccarat Elite",
    category: "Card Games",
    players: 45,
    minBet: "$10",
    maxBet: "$2000",
    icon: Club,
    popular: false,
    rtp: "98.9%",
    description: "High stakes elegance",
  },
]

interface GamesProps {
  userBalance: number
  onBalanceChange: (newBalance: number) => void
}

interface GameCard {
  suit: string
  value: string
  color: string
}

interface BlackjackState {
  playerCards: GameCard[]
  dealerCards: GameCard[]
  playerValue: number
  dealerValue: number
  gamePhase: "betting" | "playing" | "dealer" | "finished"
  canHit: boolean
  canStand: boolean
  result: string | null
}

interface SlotsState {
  reels: string[][]
  currentReels: string[]
  isSpinning: boolean
  spinSpeed: number
  result: string | null
}

interface RouletteState {
  isSpinning: boolean
  winningNumber: number | null
  selectedBets: { [key: string]: number }
  result: string | null
  wheelRotation: number
}

interface WheelState {
  isSpinning: boolean
  rotation: number
  winningSegment: number | null
  result: string | null
}

interface BaccaratState {
  playerCards: GameCard[]
  bankerCards: GameCard[]
  playerValue: number
  bankerValue: number
  selectedBet: "player" | "banker" | "tie" | null
  gamePhase: "betting" | "dealing" | "finished"
  result: string | null
}

export function Games({ userBalance, onBalanceChange }: GamesProps) {
  const [selectedGame, setSelectedGame] = useState<number | null>(null)
  const [betAmount, setBetAmount] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)

  // Game states
  const [blackjackState, setBlackjackState] = useState<BlackjackState>({
    playerCards: [],
    dealerCards: [],
    playerValue: 0,
    dealerValue: 0,
    gamePhase: "betting",
    canHit: false,
    canStand: false,
    result: null,
  })

  const [slotsState, setSlotsState] = useState<SlotsState>({
    reels: [[], [], []],
    currentReels: ["🍒", "🍒", "🍒"],
    isSpinning: false,
    spinSpeed: 100,
    result: null,
  })

  const [rouletteState, setRouletteState] = useState<RouletteState>({
    isSpinning: false,
    winningNumber: null,
    selectedBets: {},
    result: null,
    wheelRotation: 0,
  })

  const [wheelState, setWheelState] = useState<WheelState>({
    isSpinning: false,
    rotation: 0,
    winningSegment: null,
    result: null,
  })

  const [baccaratState, setBaccaratState] = useState<BaccaratState>({
    playerCards: [],
    bankerCards: [],
    playerValue: 0,
    bankerValue: 0,
    selectedBet: null,
    gamePhase: "betting",
    result: null,
  })

  const { toast } = useToast()

  // Card generation
  const generateCard = (): GameCard => {
    const suits = [
      { symbol: "♠", color: "black" },
      { symbol: "♥", color: "red" },
      { symbol: "♦", color: "red" },
      { symbol: "♣", color: "black" },
    ]
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

    const suit = suits[Math.floor(Math.random() * suits.length)]
    const value = values[Math.floor(Math.random() * values.length)]

    return {
      suit: suit.symbol,
      value,
      color: suit.color,
    }
  }

  const calculateBlackjackValue = (cards: GameCard[]) => {
    let value = 0
    let aces = 0

    cards.forEach((card) => {
      if (card.value === "A") {
        aces++
        value += 11
      } else if (["J", "Q", "K"].includes(card.value)) {
        value += 10
      } else {
        value += Number.parseInt(card.value)
      }
    })

    while (value > 21 && aces > 0) {
      value -= 10
      aces--
    }

    return value
  }

  // Blackjack functions
  const startBlackjack = () => {
    const bet = Number.parseFloat(betAmount)
    if (!bet || bet <= 0 || bet > userBalance) {
      toast({
        title: "Invalid Bet",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      })
      return
    }

    onBalanceChange(userBalance - bet)
    setIsPlaying(true)

    const playerCards = [generateCard(), generateCard()]
    const dealerCards = [generateCard(), generateCard()]

    const playerValue = calculateBlackjackValue(playerCards)
    const dealerValue = calculateBlackjackValue([dealerCards[0]]) // Only show first dealer card

    setBlackjackState({
      playerCards,
      dealerCards,
      playerValue,
      dealerValue,
      gamePhase: playerValue === 21 ? "finished" : "playing",
      canHit: playerValue < 21,
      canStand: true,
      result: playerValue === 21 ? "Blackjack!" : null,
    })

    if (playerValue === 21) {
      setTimeout(() => finishBlackjack(playerCards, dealerCards, bet), 1000)
    }
  }

  const hitBlackjack = () => {
    const newCard = generateCard()
    const newPlayerCards = [...blackjackState.playerCards, newCard]
    const newPlayerValue = calculateBlackjackValue(newPlayerCards)

    setBlackjackState((prev) => ({
      ...prev,
      playerCards: newPlayerCards,
      playerValue: newPlayerValue,
      canHit: newPlayerValue < 21,
      gamePhase: newPlayerValue >= 21 ? "finished" : "playing",
      result: newPlayerValue > 21 ? "Bust!" : null,
    }))

    if (newPlayerValue >= 21) {
      setTimeout(() => finishBlackjack(newPlayerCards, blackjackState.dealerCards, Number.parseFloat(betAmount)), 1000)
    }
  }

  const standBlackjack = () => {
    setBlackjackState((prev) => ({ ...prev, gamePhase: "dealer", canHit: false, canStand: false }))

    // Dealer plays
    const dealerCards = [...blackjackState.dealerCards]
    let dealerValue = calculateBlackjackValue(dealerCards)

    const dealerPlay = () => {
      if (dealerValue < 17) {
        dealerCards.push(generateCard())
        dealerValue = calculateBlackjackValue(dealerCards)
        setBlackjackState((prev) => ({
          ...prev,
          dealerCards: [...dealerCards],
          dealerValue,
        }))

        if (dealerValue < 17) {
          setTimeout(dealerPlay, 1000)
        } else {
          setTimeout(() => finishBlackjack(blackjackState.playerCards, dealerCards, Number.parseFloat(betAmount)), 1000)
        }
      } else {
        setTimeout(() => finishBlackjack(blackjackState.playerCards, dealerCards, Number.parseFloat(betAmount)), 1000)
      }
    }

    setTimeout(dealerPlay, 1000)
  }

  const finishBlackjack = (playerCards: GameCard[], dealerCards: GameCard[], bet: number) => {
    const playerValue = calculateBlackjackValue(playerCards)
    const dealerValue = calculateBlackjackValue(dealerCards)

    let result = ""
    let multiplier = 0

    if (playerValue > 21) {
      result = "Bust! You lose!"
      multiplier = 0
    } else if (dealerValue > 21) {
      result = "Dealer busts! You win!"
      multiplier = 2
    } else if (playerValue === 21 && playerCards.length === 2) {
      result = "Blackjack! You win!"
      multiplier = 2.5
    } else if (playerValue > dealerValue) {
      result = "You win!"
      multiplier = 2
    } else if (playerValue === dealerValue) {
      result = "Push! Tie game!"
      multiplier = 1
    } else {
      result = "Dealer wins!"
      multiplier = 0
    }

    setBlackjackState((prev) => ({
      ...prev,
      gamePhase: "finished",
      dealerValue,
      result,
    }))

    const winAmount = bet * multiplier
    onBalanceChange((prev) => prev + winAmount)

    if (multiplier > 1) {
      toast({
        title: "🎉 You Won!",
        description: `${result} Won $${(winAmount - bet).toFixed(2)}`,
      })
    } else if (multiplier === 1) {
      toast({
        title: "Push!",
        description: "It's a tie - bet returned",
      })
    } else {
      toast({
        title: "Better luck next time",
        description: `${result}`,
        variant: "destructive",
      })
    }
  }

  // Slots functions
  const startSlots = () => {
    const bet = Number.parseFloat(betAmount)
    if (!bet || bet <= 0 || bet > userBalance) {
      toast({
        title: "Invalid Bet",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      })
      return
    }

    onBalanceChange(userBalance - bet)
    setIsPlaying(true)

    const symbols = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎", "🔥", "💰"]
    setSlotsState((prev) => ({ ...prev, isSpinning: true, result: null }))

    // Animate spinning
    let spinCount = 0
    const maxSpins = 30

    const spinInterval = setInterval(() => {
      setSlotsState((prev) => ({
        ...prev,
        currentReels: [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
        ],
      }))

      spinCount++
      if (spinCount >= maxSpins) {
        clearInterval(spinInterval)

        // Final result
        const finalReels = [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
        ]

        setSlotsState((prev) => ({
          ...prev,
          currentReels: finalReels,
          isSpinning: false,
        }))

        // Calculate result
        let multiplier = 0
        let result = ""

        if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
          const symbolMultipliers: { [key: string]: number } = {
            "💰": 50,
            "💎": 25,
            "🔥": 15,
            "⭐": 10,
            "🍇": 8,
            "🍊": 6,
            "🍋": 4,
            "🍒": 3,
          }
          multiplier = symbolMultipliers[finalReels[0]] || 5
          result = `JACKPOT! Three ${finalReels[0]}s!`
        } else if (
          finalReels[0] === finalReels[1] ||
          finalReels[1] === finalReels[2] ||
          finalReels[0] === finalReels[2]
        ) {
          multiplier = 2
          result = "Two of a kind!"
        } else {
          result = "No match. Try again!"
          multiplier = 0
        }

        setSlotsState((prev) => ({ ...prev, result }))

        const winAmount = bet * multiplier
        onBalanceChange((prev) => prev + winAmount)

        if (multiplier > 0) {
          toast({
            title: "🎰 Slots Result",
            description: `${result} Won $${(winAmount - bet).toFixed(2)}`,
          })
        } else {
          toast({
            title: "No luck this time",
            description: result,
            variant: "destructive",
          })
        }

        setIsPlaying(false)
      }
    }, 100)
  }

  // Roulette functions
  const rouletteNumbers = Array.from({ length: 37 }, (_, i) => i) // 0-36
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]

  const placeBet = (betType: string, amount: number) => {
    if (amount > userBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this bet",
        variant: "destructive",
      })
      return
    }

    setRouletteState((prev) => ({
      ...prev,
      selectedBets: {
        ...prev.selectedBets,
        [betType]: (prev.selectedBets[betType] || 0) + amount,
      },
    }))
  }

  const spinRoulette = () => {
    const totalBets = Object.values(rouletteState.selectedBets).reduce((sum, bet) => sum + bet, 0)
    if (totalBets === 0) {
      toast({
        title: "No Bets Placed",
        description: "Please place at least one bet",
        variant: "destructive",
      })
      return
    }

    onBalanceChange(userBalance - totalBets)
    setIsPlaying(true)

    setRouletteState((prev) => ({ ...prev, isSpinning: true, result: null }))

    // Animate wheel spinning
    let rotation = 0
    const spinInterval = setInterval(() => {
      rotation += 20
      setRouletteState((prev) => ({ ...prev, wheelRotation: rotation }))
    }, 50)

    setTimeout(() => {
      clearInterval(spinInterval)

      const winningNumber = Math.floor(Math.random() * 37)
      const isRed = redNumbers.includes(winningNumber)
      const isBlack = winningNumber !== 0 && !isRed

      setRouletteState((prev) => ({
        ...prev,
        isSpinning: false,
        winningNumber,
      }))

      // Calculate winnings
      let totalWinnings = 0
      const bets = rouletteState.selectedBets

      if (bets.red && isRed) totalWinnings += bets.red * 2
      if (bets.black && isBlack) totalWinnings += bets.black * 2
      if (bets.even && winningNumber % 2 === 0 && winningNumber !== 0) totalWinnings += bets.even * 2
      if (bets.odd && winningNumber % 2 === 1) totalWinnings += bets.odd * 2
      if (bets[`number_${winningNumber}`]) totalWinnings += bets[`number_${winningNumber}`] * 35

      const result = `Number ${winningNumber} (${winningNumber === 0 ? "Green" : isRed ? "Red" : "Black"})`
      setRouletteState((prev) => ({ ...prev, result }))

      onBalanceChange((prev) => prev + totalWinnings)

      if (totalWinnings > 0) {
        toast({
          title: "🎯 Roulette Win!",
          description: `${result} - Won $${(totalWinnings - totalBets).toFixed(2)}`,
        })
      } else {
        toast({
          title: "House wins",
          description: result,
          variant: "destructive",
        })
      }

      setIsPlaying(false)
    }, 3000)
  }

  // Fortune Wheel functions
  const wheelSegments = [
    { value: 1, color: "#ef4444", multiplier: 1 },
    { value: 2, color: "#3b82f6", multiplier: 2 },
    { value: 5, color: "#10b981", multiplier: 5 },
    { value: 10, color: "#8b5cf6", multiplier: 10 },
    { value: 20, color: "#f59e0b", multiplier: 20 },
    { value: 50, color: "#ec4899", multiplier: 50 },
  ]

  const spinWheel = () => {
    const bet = Number.parseFloat(betAmount)
    if (!bet || bet <= 0 || bet > userBalance) {
      toast({
        title: "Invalid Bet",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      })
      return
    }

    onBalanceChange(userBalance - bet)
    setIsPlaying(true)

    setWheelState((prev) => ({ ...prev, isSpinning: true, result: null }))

    // Animate wheel spinning
    const finalRotation = 1800 + Math.random() * 360 // 5 full rotations + random
    let currentRotation = 0

    const spinInterval = setInterval(() => {
      currentRotation += 10
      setWheelState((prev) => ({ ...prev, rotation: currentRotation }))

      if (currentRotation >= finalRotation) {
        clearInterval(spinInterval)

        const segmentAngle = 360 / wheelSegments.length
        const normalizedRotation = ((finalRotation % 360) + 360) % 360
        const winningSegmentIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % wheelSegments.length
        const winningSegment = wheelSegments[winningSegmentIndex]

        setWheelState((prev) => ({
          ...prev,
          isSpinning: false,
          winningSegment: winningSegmentIndex,
        }))

        const winAmount = bet * winningSegment.multiplier
        const result = `${winningSegment.value}x Multiplier!`

        setWheelState((prev) => ({ ...prev, result }))

        onBalanceChange((prev) => prev + winAmount)

        toast({
          title: "🎡 Wheel Result",
          description: `${result} Won $${(winAmount - bet).toFixed(2)}`,
        })

        setIsPlaying(false)
      }
    }, 50)
  }

  // Baccarat functions
  const startBaccarat = (betType: "player" | "banker" | "tie") => {
    const bet = Number.parseFloat(betAmount)
    if (!bet || bet <= 0 || bet > userBalance) {
      toast({
        title: "Invalid Bet",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      })
      return
    }

    onBalanceChange(userBalance - bet)
    setIsPlaying(true)

    setBaccaratState((prev) => ({ ...prev, selectedBet: betType, gamePhase: "dealing" }))

    // Deal cards with animation
    setTimeout(() => {
      const playerCards = [generateCard(), generateCard()]
      const bankerCards = [generateCard(), generateCard()]

      let playerValue = calculateBaccaratValue(playerCards)
      let bankerValue = calculateBaccaratValue(bankerCards)

      setBaccaratState((prev) => ({
        ...prev,
        playerCards,
        bankerCards,
        playerValue,
        bankerValue,
      }))

      // Third card rules (simplified)
      setTimeout(() => {
        if (playerValue < 6) {
          playerCards.push(generateCard())
          playerValue = calculateBaccaratValue(playerCards)
        }

        if (bankerValue < 6) {
          bankerCards.push(generateCard())
          bankerValue = calculateBaccaratValue(bankerCards)
        }

        // Determine winner
        let result = ""
        let multiplier = 0

        if (playerValue > bankerValue) {
          result = "Player wins!"
          multiplier = betType === "player" ? 2 : 0
        } else if (bankerValue > playerValue) {
          result = "Banker wins!"
          multiplier = betType === "banker" ? 1.95 : 0
        } else {
          result = "Tie!"
          multiplier = betType === "tie" ? 8 : betType === "player" || betType === "banker" ? 1 : 0
        }

        setBaccaratState((prev) => ({
          ...prev,
          playerCards,
          bankerCards,
          playerValue,
          bankerValue,
          gamePhase: "finished",
          result,
        }))

        const winAmount = bet * multiplier
        onBalanceChange((prev) => prev + winAmount)

        if (multiplier > 1) {
          toast({
            title: "🎴 Baccarat Win!",
            description: `${result} Won $${(winAmount - bet).toFixed(2)}`,
          })
        } else if (multiplier === 1) {
          toast({
            title: "Bet Returned",
            description: "Tie game - bet returned",
          })
        } else {
          toast({
            title: "House wins",
            description: result,
            variant: "destructive",
          })
        }

        setIsPlaying(false)
      }, 2000)
    }, 1000)
  }

  const calculateBaccaratValue = (cards: GameCard[]) => {
    return (
      cards.reduce((sum, card) => {
        if (["J", "Q", "K"].includes(card.value)) return sum + 0
        if (card.value === "A") return sum + 1
        return sum + Number.parseInt(card.value)
      }, 0) % 10
    )
  }

  const resetGame = () => {
    setSelectedGame(null)
    setBetAmount("")
    setIsPlaying(false)
    setBlackjackState({
      playerCards: [],
      dealerCards: [],
      playerValue: 0,
      dealerValue: 0,
      gamePhase: "betting",
      canHit: false,
      canStand: false,
      result: null,
    })
    setSlotsState({
      reels: [[], [], []],
      currentReels: ["🍒", "🍒", "🍒"],
      isSpinning: false,
      spinSpeed: 100,
      result: null,
    })
    setRouletteState({
      isSpinning: false,
      winningNumber: null,
      selectedBets: {},
      result: null,
      wheelRotation: 0,
    })
    setWheelState({
      isSpinning: false,
      rotation: 0,
      winningSegment: null,
      result: null,
    })
    setBaccaratState({
      playerCards: [],
      bankerCards: [],
      playerValue: 0,
      bankerValue: 0,
      selectedBet: null,
      gamePhase: "betting",
      result: null,
    })
  }

  const renderGameInterface = () => {
    const game = games.find((g) => g.id === selectedGame)
    if (!game) return null

    switch (game.name) {
      case "Blackjack Classic":
        return (
          <div className="space-y-6">
            {blackjackState.gamePhase === "betting" && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="bet" className="text-gray-300">
                    Bet Amount ($)
                  </Label>
                  <Input
                    id="bet"
                    type="number"
                    placeholder="0.00"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    max={userBalance}
                    className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <Button
                    onClick={startBlackjack}
                    disabled={!betAmount || Number.parseFloat(betAmount) <= 0}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-8"
                  >
                    Deal Cards
                  </Button>
                </div>
              </div>
            )}

            {blackjackState.gamePhase !== "betting" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <h4 className="text-lg font-medium text-gray-300 mb-4">
                      Your Cards ({blackjackState.playerValue})
                    </h4>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {blackjackState.playerCards.map((card, i) => (
                        <div
                          key={i}
                          className={`w-16 h-24 bg-white rounded-lg border-2 flex flex-col items-center justify-center text-lg font-bold shadow-lg transform transition-transform hover:scale-105 ${
                            card.color === "red" ? "text-red-600" : "text-black"
                          }`}
                        >
                          <span>{card.value}</span>
                          <span className="text-2xl">{card.suit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-medium text-gray-300 mb-4">
                      Dealer Cards ({blackjackState.gamePhase === "playing" ? "?" : blackjackState.dealerValue})
                    </h4>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {blackjackState.dealerCards.map((card, i) => (
                        <div
                          key={i}
                          className={`w-16 h-24 rounded-lg border-2 flex flex-col items-center justify-center text-lg font-bold shadow-lg ${
                            i === 1 && blackjackState.gamePhase === "playing"
                              ? "bg-red-900 border-red-600 text-white"
                              : "bg-white"
                          } ${
                            i === 1 && blackjackState.gamePhase === "playing"
                              ? ""
                              : card.color === "red"
                                ? "text-red-600"
                                : "text-black"
                          }`}
                        >
                          {i === 1 && blackjackState.gamePhase === "playing" ? (
                            <>
                              <span>?</span>
                              <span className="text-2xl">🂠</span>
                            </>
                          ) : (
                            <>
                              <span>{card.value}</span>
                              <span className="text-2xl">{card.suit}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {blackjackState.gamePhase === "playing" && (
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={hitBlackjack}
                      disabled={!blackjackState.canHit}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-8"
                    >
                      Hit
                    </Button>
                    <Button
                      onClick={standBlackjack}
                      disabled={!blackjackState.canStand}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-8"
                    >
                      Stand
                    </Button>
                  </div>
                )}

                {blackjackState.gamePhase === "dealer" && (
                  <div className="text-center">
                    <p className="text-lg text-yellow-400">Dealer is playing...</p>
                  </div>
                )}

                {blackjackState.result && (
                  <div className="text-center space-y-4">
                    <p className="text-2xl font-bold text-white">{blackjackState.result}</p>
                    <Button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                      New Game
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case "Lightning Slots":
        return (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="bet" className="text-gray-300">
                  Bet Amount ($)
                </Label>
                <Input
                  id="bet"
                  type="number"
                  placeholder="0.00"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  max={userBalance}
                  className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500"
                />
              </div>
              <div className="flex flex-col justify-end">
                <Button
                  onClick={startSlots}
                  disabled={!betAmount || Number.parseFloat(betAmount) <= 0 || slotsState.isSpinning}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-8"
                >
                  {slotsState.isSpinning ? "Spinning..." : "Spin"}
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 p-6 rounded-lg border-4 border-yellow-500">
                <div className="flex gap-4">
                  {slotsState.currentReels.map((symbol, i) => (
                    <div
                      key={i}
                      className={`w-24 h-24 bg-white rounded-lg border-4 border-red-500 flex items-center justify-center text-4xl shadow-lg ${
                        slotsState.isSpinning ? "animate-pulse" : ""
                      }`}
                    >
                      {symbol}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {slotsState.result && (
              <div className="text-center space-y-4">
                <p className="text-2xl font-bold text-white">{slotsState.result}</p>
                <Button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  Spin Again
                </Button>
              </div>
            )}
          </div>
        )

      case "Diamond Roulette":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-300">Place Your Bets</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => placeBet("red", 10)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    disabled={rouletteState.isSpinning}
                  >
                    Red ($10)
                  </Button>
                  <Button
                    onClick={() => placeBet("black", 10)}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                    disabled={rouletteState.isSpinning}
                  >
                    Black ($10)
                  </Button>
                  <Button
                    onClick={() => placeBet("even", 10)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={rouletteState.isSpinning}
                  >
                    Even ($10)
                  </Button>
                  <Button
                    onClick={() => placeBet("odd", 10)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={rouletteState.isSpinning}
                  >
                    Odd ($10)
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Current Bets:</p>
                  {Object.entries(rouletteState.selectedBets).map(([bet, amount]) => (
                    <div key={bet} className="flex justify-between text-sm">
                      <span className="text-gray-300 capitalize">{bet}:</span>
                      <span className="text-green-400">${amount}</span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={spinRoulette}
                  disabled={rouletteState.isSpinning || Object.keys(rouletteState.selectedBets).length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                >
                  {rouletteState.isSpinning ? "Spinning..." : "Spin Wheel"}
                </Button>
              </div>

              <div className="flex justify-center items-center">
                <div className="relative">
                  <div
                    className={`w-48 h-48 rounded-full border-8 border-yellow-500 bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center transition-transform duration-100 ${
                      rouletteState.isSpinning ? "animate-spin" : ""
                    }`}
                    style={{ transform: `rotate(${rouletteState.wheelRotation}deg)` }}
                  >
                    <div className="w-32 h-32 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-2xl">
                      {rouletteState.winningNumber !== null ? rouletteState.winningNumber : "?"}
                    </div>
                  </div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-500"></div>
                  </div>
                </div>
              </div>
            </div>

            {rouletteState.result && (
              <div className="text-center space-y-4">
                <p className="text-2xl font-bold text-white">{rouletteState.result}</p>
                <Button
                  onClick={() => {
                    setRouletteState((prev) => ({ ...prev, selectedBets: {}, result: null, winningNumber: null }))
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  New Round
                </Button>
              </div>
            )}
          </div>
        )

      case "Mega Fortune Wheel":
        return (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="bet" className="text-gray-300">
                  Bet Amount ($)
                </Label>
                <Input
                  id="bet"
                  type="number"
                  placeholder="0.00"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  max={userBalance}
                  className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500"
                />
              </div>
              <div className="flex flex-col justify-end">
                <Button
                  onClick={spinWheel}
                  disabled={!betAmount || Number.parseFloat(betAmount) <= 0 || wheelState.isSpinning}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-8"
                >
                  {wheelState.isSpinning ? "Spinning..." : "Spin Wheel"}
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div
                  className="w-64 h-64 rounded-full border-8 border-yellow-500 transition-transform duration-100"
                  style={{ transform: `rotate(${wheelState.rotation}deg)` }}
                >
                  {wheelSegments.map((segment, i) => (
                    <div
                      key={i}
                      className="absolute w-full h-full"
                      style={{
                        transform: `rotate(${(i * 360) / wheelSegments.length}deg)`,
                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((2 * Math.PI) / wheelSegments.length)}% ${
                          50 - 50 * Math.sin((2 * Math.PI) / wheelSegments.length)
                        }%)`,
                        backgroundColor: segment.color,
                      }}
                    >
                      <div
                        className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white font-bold text-lg"
                        style={{ transform: `rotate(${360 / wheelSegments.length / 2}deg)` }}
                      >
                        {segment.value}x
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-white"></div>
                </div>
              </div>
            </div>

            {wheelState.result && (
              <div className="text-center space-y-4">
                <p className="text-2xl font-bold text-white">{wheelState.result}</p>
                <Button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  Spin Again
                </Button>
              </div>
            )}
          </div>
        )

      case "Baccarat Elite":
        return (
          <div className="space-y-6">
            {baccaratState.gamePhase === "betting" && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="bet" className="text-gray-300">
                      Bet Amount ($)
                    </Label>
                    <Input
                      id="bet"
                      type="number"
                      placeholder="0.00"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      max={userBalance}
                      className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    onClick={() => startBaccarat("player")}
                    disabled={!betAmount || Number.parseFloat(betAmount) <= 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    Bet on Player (2:1)
                  </Button>
                  <Button
                    onClick={() => startBaccarat("banker")}
                    disabled={!betAmount || Number.parseFloat(betAmount) <= 0}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold"
                  >
                    Bet on Banker (1.95:1)
                  </Button>
                  <Button
                    onClick={() => startBaccarat("tie")}
                    disabled={!betAmount || Number.parseFloat(betAmount) <= 0}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                  >
                    Bet on Tie (8:1)
                  </Button>
                </div>
              </div>
            )}

            {baccaratState.gamePhase !== "betting" && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-lg text-gray-300">
                    Betting on: <span className="text-red-400 font-bold capitalize">{baccaratState.selectedBet}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <h4 className="text-lg font-medium text-gray-300 mb-4">Player ({baccaratState.playerValue})</h4>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {baccaratState.playerCards.map((card, i) => (
                        <div
                          key={i}
                          className={`w-14 h-20 bg-white rounded-lg border-2 flex flex-col items-center justify-center text-sm font-bold shadow-lg ${
                            card.color === "red" ? "text-red-600" : "text-black"
                          }`}
                        >
                          <span>{card.value}</span>
                          <span className="text-lg">{card.suit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-medium text-gray-300 mb-4">Banker ({baccaratState.bankerValue})</h4>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {baccaratState.bankerCards.map((card, i) => (
                        <div
                          key={i}
                          className={`w-14 h-20 bg-white rounded-lg border-2 flex flex-col items-center justify-center text-sm font-bold shadow-lg ${
                            card.color === "red" ? "text-red-600" : "text-black"
                          }`}
                        >
                          <span>{card.value}</span>
                          <span className="text-lg">{card.suit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {baccaratState.gamePhase === "dealing" && (
                  <div className="text-center">
                    <p className="text-lg text-yellow-400">Dealing cards...</p>
                  </div>
                )}

                {baccaratState.result && (
                  <div className="text-center space-y-4">
                    <p className="text-2xl font-bold text-white">{baccaratState.result}</p>
                    <Button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                      New Game
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )

      default:
        return null
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
        <h2 className="text-3xl font-bold tracking-tight text-red-500">CASINO GAMES</h2>
        <p className="text-gray-400">Fully interactive games with real mechanics and animations</p>
      </div>

      {selectedGame && (
        <Card className="bg-red-900/20 border-red-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-400">{games.find((g) => g.id === selectedGame)?.name}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={resetGame}
                className="border-red-600/30 text-red-400 hover:bg-red-600/20"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                New Game
              </Button>
            </div>
          </CardHeader>
          <CardContent>{renderGameInterface()}</CardContent>
        </Card>
      )}

      {!selectedGame && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <Card
              key={game.id}
              className="relative bg-black/40 border-red-600/20 hover:border-red-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 cursor-pointer"
              onClick={() => setSelectedGame(game.id)}
            >
              {game.popular && (
                <Badge className="absolute top-3 right-3 z-10 bg-red-600/20 text-red-400 border-red-500/30">
                  Popular
                </Badge>
              )}
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center border border-red-500/30 shadow-lg">
                    <game.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-white">{game.name}</CardTitle>
                    <CardDescription className="text-gray-400">{game.category}</CardDescription>
                    <p className="text-xs text-gray-500 mt-1">{game.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-green-900/20 p-2 rounded border border-green-600/20">
                    <span className="text-gray-400 block">Players:</span>
                    <span className="font-medium text-green-400">{game.players}</span>
                  </div>
                  <div className="bg-blue-900/20 p-2 rounded border border-blue-600/20">
                    <span className="text-gray-400 block">RTP:</span>
                    <span className="font-medium text-blue-400">{game.rtp}</span>
                  </div>
                  <div className="bg-yellow-900/20 p-2 rounded border border-yellow-600/20">
                    <span className="text-gray-400 block">Min:</span>
                    <span className="font-medium text-yellow-400">{game.minBet}</span>
                  </div>
                  <div className="bg-purple-900/20 p-2 rounded border border-purple-600/20">
                    <span className="text-gray-400 block">Max:</span>
                    <span className="font-medium text-purple-400">{game.maxBet}</span>
                  </div>
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold transition-all duration-200 hover:scale-105">
                  <Play className="h-4 w-4 mr-2" />
                  Play Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
