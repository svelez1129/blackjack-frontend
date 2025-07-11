'use client'

import { PlayerHand } from '@/components/game/PlayerHand'
import { DealerHand } from '@/components/game/DealerHand'
import { ActionButtons } from '@/components/game/ActionButtons'
import { Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { BlackjackEngine } from '@/lib/blackjack/engine'
import { useState, useEffect } from 'react'

export default function PlayPage() {
  const [engine] = useState(() => new BlackjackEngine(1000))
  const [gameState, setGameState] = useState(engine.getState())

  useEffect(() => {
    // Set up callback for engine to trigger UI updates
    engine.setStateUpdateCallback(() => {
      setGameState(engine.getState())
    })
  }, [engine])

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
          
          {/* Game Messages */}
          {gameState.messages && gameState.messages.length > 0 && (
            <div className="text-center">
              {gameState.messages.map((message, index) => (
                <p key={index} className="text-lg font-bold text-yellow-400">{message}</p>
              ))}
            </div>
          )}
          
          {/* Player Hands and Actions */}
          <div className="space-y-6">
            {/* Display all player hands */}
            <div className="space-y-4">
              {gameState.playerHands.map((hand, index) => (
                <div key={index} className={`${index === gameState.currentHandIndex && gameState.phase === 'playing' ? 'ring-2 ring-yellow-400 rounded-lg p-2' : ''}`}>
                  <PlayerHand 
                    cards={hand}
                    score={gameState.playerScores[index]}
                    dealingSequence={gameState.dealingSequences.player[index] || []}
                    handNumber={gameState.playerHands.length > 1 ? index + 1 : undefined}
                    isActive={index === gameState.currentHandIndex && gameState.phase === 'playing'}
                    bet={gameState.bets[index]}
                  />
                </div>
              ))}
            </div>
            
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

            {/* Show new game button when game is finished */}
            {gameState.phase === 'finished' && (
              <div className="flex justify-center">
                <Button onClick={handleNewGame} variant="primary">
                  New Game
                </Button>
              </div>
            )}
          </div>

          {/* Betting Area - only show during betting phase */}
          {gameState.phase === 'betting' && (
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
          {gameState.phase !== 'betting' && (
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