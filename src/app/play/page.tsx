'use client'

import { PlayerHand } from '@/components/game/PlayerHand'
import { DealerHand } from '@/components/game/DealerHand'
import { ActionButtons } from '@/components/game/ActionButtons'
import { Chip } from '@/components/ui/Chip'
import { Button} from '@/components/ui/Button'
import { BlackjackEngine } from '@/lib/blackjack/engine'
import { useState, useEffect, useCallback } from 'react'
import { GameResults } from '@/components/game/GameResults'
import { BackgroundMusic } from '@/components/ui/BackgroundMusic'
import { GameStorage } from '@/lib/storage'
import { DailyRewards } from '@/components/rewards/DailyRewards'
import { AchievementsButton } from '@/components/achievements/AchievementsButton'
import { AchievementNotification } from '@/components/achievements/AchievementNotification'
import { useAchievements } from '@/hooks/useAchievements'

export default function PlayPage() {
  const [engine] = useState(() => {
    const gameEngine = new BlackjackEngine(1000, false) // Start without auto-save
    return gameEngine
  })
  const [gameState, setGameState] = useState(engine.getState())
  const [showWelcomeBack, setShowWelcomeBack] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentBet, setCurrentBet] = useState(0) // Track current bet being built
  
  // Achievements
  const { 
    recentUnlocks, 
    clearRecentUnlock, 
    checkMultipleProgress,
    getGameStats,
    saveGameStats
  } = useAchievements()

  // Client-side initialization after hydration
  useEffect(() => {
    // Enable auto-save and load saved progress
    engine.enableSaving()
    
    // Check for saved progress and restore it
    const savedProgress = GameStorage.loadGuestProgress()
    
    if (savedProgress) {
      // Restore saved state
      engine.restoreFromSave(savedProgress)
      const newState = engine.getState()
      setGameState(newState)
      setShowWelcomeBack(true)
      // Hide welcome message after 3 seconds
      setTimeout(() => setShowWelcomeBack(false), 3000)
    }
    
    // Mark loading as complete
    setIsLoading(false)
  }, [engine])

  useEffect(() => {
    // Set up callback for engine to trigger UI updates
    engine.setStateUpdateCallback(() => {
      setGameState(engine.getState())
    })
  }, [engine])

  // Achievement tracking functions
  const trackAchievements = useCallback(async (updates: Record<string, number>) => {
    try {
      await checkMultipleProgress(updates)
    } catch (error) {
      console.error('Failed to track achievements:', error)
    }
  }, [checkMultipleProgress])

  const trackHandResult = useCallback(async (result: string, bet: number, playerHands: unknown[]) => {
    const stats = getGameStats()
    const updates: Record<string, number> = {}

    // Update basic stats
    stats.handsPlayed += 1
    stats.lastPlayDate = new Date()

    // Track hand results
    if (result === 'win' || result === 'blackjack') {
      stats.handsWon += 1
      stats.currentWinStreak += 1
      stats.currentLossStreak = 0
      stats.maxWinStreak = Math.max(stats.maxWinStreak, stats.currentWinStreak)
      
      const winAmount = result === 'blackjack' ? Math.floor(bet * 1.5) : bet
      stats.totalWinnings += winAmount
      stats.biggestWin = Math.max(stats.biggestWin, winAmount)

      // Achievement updates
      updates['hands_10'] = 1
      updates['hands_50'] = 1  
      updates['hands_100'] = 1
      updates['hands_500'] = 1
      updates['win_streak_3'] = stats.currentWinStreak
      updates['win_streak_5'] = stats.currentWinStreak
      updates['win_streak_10'] = stats.currentWinStreak
      
      if (result === 'blackjack') {
        stats.blackjacksHit += 1
        updates['first_blackjack'] = 1
        updates['blackjacks_5'] = 1
        updates['blackjacks_10'] = 1
      }

      if (winAmount >= 1000) {
        updates['win_1000'] = winAmount
      }

      updates['total_winnings_5000'] = stats.totalWinnings
      updates['millionaire'] = gameState.money + winAmount

    } else if (result === 'lose') {
      stats.handsLost += 1
      stats.currentWinStreak = 0
      stats.currentLossStreak += 1
      stats.totalLosses += bet
      stats.biggestLoss = Math.max(stats.biggestLoss, bet)
      
      // Basic milestone tracking
      updates['hands_10'] = 1
      updates['hands_50'] = 1
      updates['hands_100'] = 1  
      updates['hands_500'] = 1
    } else if (result === 'push') {
      stats.handsPushed += 1
      
      // Basic milestone tracking
      updates['hands_10'] = 1
      updates['hands_50'] = 1
      updates['hands_100'] = 1
      updates['hands_500'] = 1
    }

    // Check for special conditions
    if (Array.isArray(playerHands[0]) && playerHands[0].length === 3) {
      // Skip complex card value calculation for now - would need proper typing
      // updates['perfect_21'] = 1
    }

    // Check for comeback
    if (gameState.money < 100 && result === 'win') {
      updates['comeback_king'] = 1
    }

    saveGameStats(stats)
    await trackAchievements(updates)
  }, [getGameStats, saveGameStats, trackAchievements, gameState.money])

  // Auto-reset after showing results
  useEffect(() => {
    if (gameState.phase === 'finished' && gameState.money > 0) {
      // Track results before resetting
      if (gameState.results && gameState.bets) {
        gameState.results.forEach((result) => {
          trackHandResult(result, gameState.bets[0], gameState.playerHands)
        })
      }

      const timer = setTimeout(() => {
        engine.resetForNextRound()
        setGameState(engine.getState())
      }, 1000) // Show results for 1 seconds before resetting

      return () => clearTimeout(timer)
    }
  }, [gameState.phase, gameState.money, gameState.results, gameState.bets, gameState.playerHands, engine, trackHandResult])

  const updateGameState = () => {
    setGameState(engine.getState())
  }

  const handleAddToBet = (amount: 10 | 25 | 50 | 100) => {
    // Don't allow betting more than player has
    if (currentBet + amount <= gameState.money) {
      setCurrentBet(prev => prev + amount)
    }
  }

  const handleAllIn = () => {
    setCurrentBet(gameState.money)
  }

  const handleClearBet = () => {
    setCurrentBet(0)
  }

  const handlePlaceBet = async () => {
    if (currentBet > 0) {
      engine.placeBet(currentBet)
      updateGameState()
      setCurrentBet(0) // Reset bet for next round
      
      // Track first hand achievement
      await trackAchievements({ 'first_hand': 1 })
    }
  }

  const handleHit = async () => {
    engine.hit()
    updateGameState()
    
    const stats = getGameStats()
    stats.timesHit += 1
    saveGameStats(stats)
  }

  const handleStand = async () => {
    engine.stand()
    updateGameState()
    
    const stats = getGameStats()
    stats.timesStood += 1
    saveGameStats(stats)
  }

  const handleDouble = async () => {
    engine.double()
    updateGameState()
    
    const stats = getGameStats()
    stats.timesDoubled += 1
    saveGameStats(stats)
    
    // Track first double achievement
    await trackAchievements({ 'first_double': 1 })
  }

  const handleSplit = async () => {
    engine.split()
    updateGameState()
    
    const stats = getGameStats()
    stats.timesSplit += 1
    saveGameStats(stats)
    
    // Track first split achievement
    await trackAchievements({ 'first_split': 1 })
  }

  const handleNewGame = () => {
    engine.resetProgress()
    updateGameState()
  }

  const handleRewardClaimed = (amount: number) => {
    // Add reward money to the game engine
    engine.addMoney(amount)
    updateGameState()
  }

  const canDouble = engine.canDoubleCurrentHand()
  const canSplit = engine.canSplitCurrentHand()

  // Dynamic layout for player hands
  const renderPlayerHands = () => {
    const totalHands = gameState.playerHands.length
    
    if (totalHands === 1) {
      // Single hand - centered
      return (
        <div className="flex justify-center">
          <div className={`${0 === gameState.currentHandIndex && gameState.phase === 'playing' ? 'ring-2 ring-yellow-400 rounded-lg p-2' : ''}`}>
            <PlayerHand 
              cards={gameState.playerHands[0]}
              score={gameState.playerScores[0]}
              dealingSequence={gameState.dealingSequences.player[0] || []}
              bet={gameState.bets[0]}
              totalHands={totalHands}
              showScore={gameState.phase === 'playing' || gameState.phase === 'finished'}
            />
          </div>
        </div>
      )
    }
    
    if (totalHands === 2) {
      // Two hands - side by side
      return (
        <div className="flex justify-center gap-8">
          {gameState.playerHands.map((hand, index) => (
            <div key={index} className={`${index === gameState.currentHandIndex && gameState.phase === 'playing' ? 'ring-2 ring-yellow-400 rounded-lg p-2' : ''}`}>
              <PlayerHand 
                cards={hand}
                score={gameState.playerScores[index]}
                dealingSequence={gameState.dealingSequences.player[index] || []}
                handNumber={index + 1}
                isActive={index === gameState.currentHandIndex && gameState.phase === 'playing'}
                bet={gameState.bets[index]}
                totalHands={totalHands}
                showScore={gameState.phase === 'playing' || gameState.phase === 'finished'}
              />
            </div>
          ))}
        </div>
      )
    }
    
    if (totalHands === 3) {
      // Three hands - one on top, two on bottom
      return (
        <div className="space-y-4">
          {/* Top hand */}
          <div className="flex justify-center">
            <div className={`${0 === gameState.currentHandIndex && gameState.phase === 'playing' ? 'ring-2 ring-yellow-400 rounded-lg p-2' : ''}`}>
              <PlayerHand 
                cards={gameState.playerHands[0]}
                score={gameState.playerScores[0]}
                dealingSequence={gameState.dealingSequences.player[0] || []}
                handNumber={1}
                isActive={0 === gameState.currentHandIndex && gameState.phase === 'playing'}
                bet={gameState.bets[0]}
                totalHands={totalHands}
                showScore={gameState.phase === 'playing' || gameState.phase === 'finished'}
              />
            </div>
          </div>
          {/* Bottom two hands */}
          <div className="flex justify-center gap-6">
            {gameState.playerHands.slice(1).map((hand, index) => {
              const actualIndex = index + 1
              return (
                <div key={actualIndex} className={`${actualIndex === gameState.currentHandIndex && gameState.phase === 'playing' ? 'ring-2 ring-yellow-400 rounded-lg p-2' : ''}`}>
                  <PlayerHand 
                    cards={hand}
                    score={gameState.playerScores[actualIndex]}
                    dealingSequence={gameState.dealingSequences.player[actualIndex] || []}
                    handNumber={actualIndex + 1}
                    isActive={actualIndex === gameState.currentHandIndex && gameState.phase === 'playing'}
                    bet={gameState.bets[actualIndex]}
                    totalHands={totalHands}
                    showScore={gameState.phase === 'playing' || gameState.phase === 'finished'}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    
    if (totalHands === 4) {
      // Four hands - two on top, two on bottom
      return (
        <div className="space-y-3">
          {/* Top two hands */}
          <div className="flex justify-center gap-4">
            {gameState.playerHands.slice(0, 2).map((hand, index) => (
              <div key={index} className={`${index === gameState.currentHandIndex && gameState.phase === 'playing' ? 'ring-2 ring-yellow-400 rounded-lg p-1' : ''}`}>
                <PlayerHand 
                  cards={hand}
                  score={gameState.playerScores[index]}
                  dealingSequence={gameState.dealingSequences.player[index] || []}
                  handNumber={index + 1}
                  isActive={index === gameState.currentHandIndex && gameState.phase === 'playing'}
                  bet={gameState.bets[index]}
                  totalHands={totalHands}
                  showScore={gameState.phase === 'playing' || gameState.phase === 'finished'}
                />
              </div>
            ))}
          </div>
          {/* Bottom two hands */}
          <div className="flex justify-center gap-4">
            {gameState.playerHands.slice(2).map((hand, index) => {
              const actualIndex = index + 2
              return (
                <div key={actualIndex} className={`${actualIndex === gameState.currentHandIndex && gameState.phase === 'playing' ? 'ring-2 ring-yellow-400 rounded-lg p-1' : ''}`}>
                  <PlayerHand 
                    cards={hand}
                    score={gameState.playerScores[actualIndex]}
                    dealingSequence={gameState.dealingSequences.player[actualIndex] || []}
                    handNumber={actualIndex + 1}
                    isActive={actualIndex === gameState.currentHandIndex && gameState.phase === 'playing'}
                    bet={gameState.bets[actualIndex]}
                    totalHands={totalHands}
                    showScore={gameState.phase === 'playing' || gameState.phase === 'finished'}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )
    }
  }

  // Show luxury loading screen while initializing
  if (isLoading) {
    return (
      <main className="h-screen bg-black text-white overflow-hidden flex items-center justify-center relative">
        {/* Luxury casino background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-gray-900/40 via-black/80 to-black"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-yellow-400/10 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center">
          {/* Casino loading animation */}
          <div className="mb-8">
            <div className="text-6xl mb-4 animate-spin">🎰</div>
            <div className="flex justify-center gap-2 mb-4">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
          
          <div className="text-2xl font-serif font-bold tracking-wider mb-2">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              LOADING CASINO
            </span>
          </div>
          <div className="text-gray-400 text-sm tracking-widest uppercase">
            Preparing your luxury experience...
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="h-screen bg-black text-white overflow-hidden relative">
      {/* Luxury Casino Background */}
      <div className="absolute inset-0">
        {/* Dark casino atmosphere */}
        <div className="absolute inset-0 bg-gradient-radial from-gray-900/40 via-black/80 to-black"></div>
        
        {/* Subtle casino room elements */}
        <div className="absolute inset-0 opacity-10">
          {/* Blurred casino lights */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full blur-xl"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-red-500 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-16 w-24 h-24 bg-orange-400 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-12 h-12 bg-purple-500 rounded-full blur-xl"></div>
        </div>
        
        {/* Spotlight on table area */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-yellow-400/15 via-yellow-400/5 to-transparent rounded-full blur-2xl"></div>
      </div>

      <BackgroundMusic />
      <DailyRewards onRewardClaimed={handleRewardClaimed} />
      
      {/* Achievement Notifications */}
      {recentUnlocks.map((achievement) => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          onDismiss={() => clearRecentUnlock(achievement.id)}
        />
      ))}

      {/* Welcome Back Message */}
      {showWelcomeBack && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-lg shadow-xl border border-emerald-500 z-50 animate-bounce">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎰</span>
            Welcome back! Your progress has been restored.
          </div>
        </div>
      )}

      {/* Main Game Container */}
      <div className="relative z-10 h-full flex flex-col">
        
        {/* Casino Header Bar */}
        <div className="bg-gradient-to-r from-black via-gray-900 to-black border-b border-yellow-400/30 px-6 py-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <AchievementsButton />
            
            {/* Casino Branding */}
            <div className="text-center">
              <div className="text-2xl font-serif font-bold tracking-widest">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  BLACKJACK
                </span>
              </div>
              <div className="text-xs text-gray-400 tracking-[0.2em] uppercase">
                Premium Table
              </div>
            </div>
            
            {/* Money Display - Enhanced */}
            <div className="text-right">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 rounded-lg border border-yellow-400/50">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Balance</div>
                <div className="text-xl font-bold">
                  <span className="text-yellow-400">${gameState.money.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blackjack Table Area */}
        <div className="flex-1 flex items-start justify-center pt-2 px-4">
          <div className="relative w-full max-w-6xl h-full max-h-[600px]">
            
            {/* Felt Table Surface */}
            <div className="absolute inset-0 rounded-[100px] bg-gradient-to-br from-green-800 via-green-700 to-green-900 shadow-2xl border-8 border-yellow-600/80">
              {/* Table texture overlay */}
              <div className="absolute inset-0 rounded-[92px] opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
              
              {/* Gold trim inner border */}
              <div className="absolute inset-4 rounded-[80px] border-2 border-yellow-400/60"></div>
              
              {/* Dealer area marking */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-green-900/50 rounded-lg px-6 py-2 border border-yellow-400/40">
                  <div className="text-yellow-400 text-sm font-bold tracking-widest uppercase">
                    Dealer
                  </div>
                </div>
              </div>
              
              {/* Player betting areas */}
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                <div className="flex justify-center gap-8">
                  {/* Betting circles for multiple hands */}
                  {Array.from({ length: Math.max(1, gameState.playerHands.length) }).map((_, index) => (
                    <div key={index} className="relative">
                      <div className={`w-24 h-24 rounded-full border-4 ${
                        index === gameState.currentHandIndex && gameState.phase === 'playing' 
                          ? 'border-yellow-400 bg-yellow-400/10' 
                          : 'border-yellow-400/50 bg-green-800/30'
                      }`}>
                        {/* Betting circle content - empty during betting */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          {gameState.bets[index] && gameState.phase !== 'betting' ? (
                            <div className="relative">
                              {/* Render actual chip based on bet amount */}
                              {(() => {
                                const bet = gameState.bets[index]
                                const getChipColor = (amount: number) => {
                                  if (amount >= 100) return 'bg-gradient-to-br from-black via-gray-800 to-black border-2 border-yellow-400'
                                  if (amount >= 50) return 'bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 border-2 border-purple-300'
                                  if (amount >= 25) return 'bg-gradient-to-br from-green-600 via-green-500 to-green-700 border-2 border-green-300'
                                  return 'bg-gradient-to-br from-red-600 via-red-500 to-red-700 border-2 border-red-300'
                                }
                                
                                const getTextColor = (amount: number) => {
                                  if (amount >= 100) return 'text-yellow-400'
                                  return 'text-white'
                                }
                                
                                return (
                                  <div className={`w-16 h-16 rounded-full ${getChipColor(bet)} flex items-center justify-center shadow-lg animate-chip-place`}>
                                    <div className="absolute inset-1 rounded-full border border-white/20"></div>
                                    <span className={`font-bold text-xs ${getTextColor(bet)} font-serif text-shadow`}>
                                      ${bet}
                                    </span>
                                  </div>
                                )
                              })()}
                            </div>
                          ) : (
                            // Empty betting circle during betting phase
                            <div></div>
                          )}
                        </div>
                      </div>
                      {/* Hand number for multiple hands */}
                      {gameState.playerHands.length > 1 && (
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs font-bold">
                          Hand {index + 1}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Table game area markings */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="text-yellow-400/60 text-xs font-bold tracking-widest uppercase">
                  Blackjack Pays 3 to 2
                </div>
              </div>
            </div>

            {/* Game Content Overlay */}
            <div className="relative z-10 h-full flex flex-col justify-between py-8 px-8">
              
              {/* Dealer Area */}
              <div className="flex justify-center mb-4">
                <DealerHand 
                  cards={gameState.dealerHand}
                  hideSecondCard={gameState.isDealerSecondCardHidden}
                  score={gameState.phase === 'finished' || !gameState.isDealerSecondCardHidden ? gameState.dealerScore : gameState.dealerVisibleScore}
                  dealingSequence={gameState.dealingSequences.dealer}
                />
              </div>
              
              {/* Center Game Results/Status Area */}
              <div className="flex-1 flex items-center justify-center">
                {gameState.phase === 'finished' && gameState.results && gameState.messages && gameState.money > 0 ? (
                  <GameResults
                    results={gameState.results}
                    bets={gameState.bets}
                    totalWinnings={gameState.totalWinnings || 0}
                    totalHands={gameState.playerHands.length}
                    money={gameState.money}
                  />
                ) : gameState.phase === 'finished' && gameState.money <= 0 ? (
                  // Game Over screen - luxury styling
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-red-900/90 via-red-800/90 to-red-900/90 rounded-2xl p-8 border-2 border-red-500/50 backdrop-blur-sm">
                      <h2 className="text-4xl font-serif font-bold mb-6 text-red-400">GAME OVER</h2>
                      <p className="text-xl mb-6 text-gray-200">Your bankroll has been depleted!</p>
                      <Button onClick={handleNewGame} variant="primary" className="px-12 py-4 text-lg bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500">
                        Restart with $1,000
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
              
              {/* Player Area */}
              <div className="space-y-5">
                {/* Dynamic player hands layout */}
                <div className="flex justify-center">
                  {renderPlayerHands()}
                </div>
                
                {/* Action buttons area */}
                <div className="flex justify-center">
                  {gameState.phase === 'playing' && (
                    <ActionButtons
                      onHit={handleHit}
                      onStand={handleStand}
                      onDouble={handleDouble}
                      onSplit={handleSplit}
                      canDouble={canDouble}
                      canSplit={canSplit}
                    />
                  )}
                </div>

                {/* Betting Area - luxury casino style */}
                {gameState.phase === 'betting' && (
                  <div className="text-center mt-30">
                    
                    {/* Current Bet Display - Always visible */}
                    <div className="flex justify-center">
                      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-lg px-4 py-2 border border-yellow-400/40 shadow-lg">
                        <div className="text-yellow-400 font-serif font-bold text-base">
                          Current Bet: ${currentBet}
                        </div>
                      </div>
                    </div>
                    
                    {/* Chip tray layout */}
                    <div className="relative">
                      {/* Chip tray background */}
                      <div className="inline-block bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg px-4 py-3 border border-yellow-400/30 shadow-lg">
                        <div className="absolute inset-1 bg-gradient-to-br from-gray-700/20 via-transparent to-gray-900/30 rounded-md"></div>
                        
                        {/* Chip layout with buttons */}
                        <div className="relative flex gap-3 justify-center items-center">
                          {/* Reset Button */}
                          <div className="mr-2">
                            <Button 
                              onClick={handleClearBet}
                              variant="secondary"
                              disabled={currentBet === 0}
                              className="px-3 py-2 text-xs"
                            >
                              🔄 Reset
                            </Button>
                          </div>
                          
                          <Chip 
                            value={10} 
                            isSelected={false} 
                            onClick={handleAddToBet}
                            disabled={currentBet + 10 > gameState.money}
                          />
                          <Chip 
                            value={25} 
                            isSelected={false} 
                            onClick={handleAddToBet}
                            disabled={currentBet + 25 > gameState.money}
                          />
                          <Chip 
                            value={50} 
                            isSelected={false} 
                            onClick={handleAddToBet}
                            disabled={currentBet + 50 > gameState.money}
                          />
                          <Chip 
                            value={100} 
                            isSelected={false} 
                            onClick={handleAddToBet}
                            disabled={currentBet + 100 > gameState.money}
                          />
                          
                          {/* All In Button */}
                          <div className="ml-2">
                            <Button 
                              onClick={handleAllIn}
                              variant="danger"
                              disabled={gameState.money === 0 || currentBet === gameState.money}
                              className="px-3 py-2 text-xs"
                            >
                              🔥 All In
                            </Button>
                          </div>
                          
                          {/* Place Bet Button */}
                          <div className="ml-2">
                            <Button 
                              onClick={handlePlaceBet}
                              variant="primary"
                              disabled={currentBet === 0}
                              className="px-4 py-2 text-sm"
                            >
                              💰 Bet
                            </Button>
                          </div>
                        </div>
                        
                        {/* Tray label */}
                        <div className="text-center mt-2">
                          <div className="text-xs text-yellow-400/60 font-serif tracking-wider">ADD TO BET</div>
                        </div>
                      </div>
                      
                      {/* Subtle glow around tray */}
                      <div className="absolute inset-0 bg-gradient-radial from-yellow-400/10 via-transparent to-transparent blur-lg -z-10"></div>
                    </div>
                  </div>
                )}

                {/* Current bet display */}
                {gameState.phase !== 'betting' && gameState.phase !== 'finished' && (
                  <div className="text-center">
                    <div className="inline-block bg-green-900/50 rounded-lg px-6 py-3 border border-yellow-400/40">
                      {gameState.bets.length === 1 ? (
                        <p className="text-lg font-semibold text-gray-200">
                          Current Bet: <span className="text-yellow-400 font-bold">${gameState.bets[0]}</span>
                        </p>
                      ) : (
                        <p className="text-lg font-semibold text-gray-200">
                          Total Bets: <span className="text-yellow-400 font-bold">${gameState.bets.reduce((sum, bet) => sum + bet, 0)}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}