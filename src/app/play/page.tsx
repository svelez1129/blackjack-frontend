'use client'

import { PlayerHand } from '@/components/game/PlayerHand'
import { DealerHand } from '@/components/game/DealerHand'
import { ActionButtons } from '@/components/game/ActionButtons'
import { Chip } from '@/components/ui/Chip'
import { Button} from '@/components/ui/Button'
import { BlackjackEngine } from '@/lib/blackjack/engine'
import { useState, useEffect } from 'react'
import { GameResults } from '@/components/game/GameResults'

export default function PlayPage() {
  const [engine] = useState(() => new BlackjackEngine(1000))
  const [gameState, setGameState] = useState(engine.getState())

  useEffect(() => {
    // Set up callback for engine to trigger UI updates
    engine.setStateUpdateCallback(() => {
      setGameState(engine.getState())
    })
  }, [engine])

  // Auto-reset after showing results
  useEffect(() => {
    if (gameState.phase === 'finished' && gameState.money > 0) {
      const timer = setTimeout(() => {
        engine.resetForNextRound()
        setGameState(engine.getState())
      }, 2000) // Show results for 2 seconds before resetting

      return () => clearTimeout(timer)
    }
  }, [gameState.phase, gameState.money, engine])

  const updateGameState = () => {
    setGameState(engine.getState())
  }

  const handlePlaceBet = (amount: 10 | 25 | 50 | 100) => {
    engine.placeBet(amount)
    updateGameState()
  }

  const handleHit = () => {
    engine.hit()
    updateGameState()
  }

  const handleStand = () => {
    engine.stand()
    updateGameState()
  }

  const handleDouble = () => {
    engine.double()
    updateGameState()
  }

  const handleSplit = () => {
    engine.split()
    updateGameState()
  }

  const handleNewGame = () => {
    engine.newGame()
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
                  />
                </div>
              )
            })}
          </div>
        </div>
      )
    }
  }

  return (
    <main className="h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-6 h-full flex flex-col">
        {/* Header with money */}
        <div className="flex justify-end mb-8">
          <div className="text-right">
            <p className="text-xl font-bold">Money: <span className="text-green-400">${gameState.money}</span></p>
          </div>
        </div>
                
        <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full">
          {/* Dealer Hand */}
          <DealerHand 
            cards={gameState.dealerHand}
            hideSecondCard={gameState.isDealerSecondCardHidden}
            score={gameState.phase === 'finished' || !gameState.isDealerSecondCardHidden ? gameState.dealerScore : gameState.dealerVisibleScore}
            dealingSequence={gameState.dealingSequences.dealer}
          />
          
          {/* Game Results - Only show temporarily */}
          {gameState.phase === 'finished' && gameState.results && gameState.messages && gameState.money > 0 ? (
            <GameResults
              results={gameState.results}
              messages={gameState.messages}
              bets={gameState.bets}
              totalWinnings={gameState.totalWinnings || 0}
              totalHands={gameState.playerHands.length}
              money={gameState.money}
            />
          ) : gameState.phase === 'finished' && gameState.money <= 0 ? (
            // Game Over screen - stays until manual restart
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-800 to-red-700 rounded-lg p-6 border border-red-600">
                <h2 className="text-3xl font-bold mb-4 text-red-400">GAME OVER</h2>
                <p className="text-xl mb-4">You're out of money!</p>
                <Button onClick={handleNewGame} variant="primary" className="px-8 py-3">
                  Start Over ($1000)
                </Button>
              </div>
            </div>
          ) : null}
          
          {/* Player Hands and Actions */}
          <div className="space-y-4">
            {/* Dynamic player hands layout */}
            {renderPlayerHands()}
            
            {/* Show action buttons only during player's turn */}
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

          {/* Betting Area - only show during betting phase */}
          {(gameState.phase === 'betting' || (gameState.phase === 'finished' && gameState.money > 0))  && (
            <div className="text-center">
              <div className="mb-3">
                <p className="text-lg font-semibold">Choose Your Bet:</p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Chip value={10} isSelected={false} onClick={handlePlaceBet} />
                <Chip value={25} isSelected={false} onClick={handlePlaceBet} />
                <Chip value={50} isSelected={false} onClick={handlePlaceBet} />
                <Chip value={100} isSelected={false} onClick={handlePlaceBet} />
              </div>
            </div>
          )}

          {/* Show current bets during game */}
          {gameState.phase !== 'betting' && gameState.phase !== 'finished' && (
            <div className="text-center">
              {gameState.bets.length === 1 ? (
                <p className="text-lg font-semibold">Current Bet: <span className="text-yellow-400">${gameState.bets[0]}</span></p>
              ) : (
                <p className="text-lg font-semibold">
                  Total Bets: <span className="text-yellow-400">${gameState.bets.reduce((sum, bet) => sum + bet, 0)}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}