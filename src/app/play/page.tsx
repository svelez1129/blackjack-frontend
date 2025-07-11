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

  const handleNewGame = () => {
    engine.newGame()
    updateGameState()
  }

  const canDouble = gameState.playerHand.length === 2 && 
                   gameState.currentBet <= gameState.money &&
                   gameState.phase === 'playing'

  return (
    <main className="h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-6 h-full flex flex-col">
        {/* Header with money */}
        <div className="flex justify-end mb-8">
          <div className="text-right">
            <p className="text-xl font-bold">Money: <span className="text-green-400">${gameState.money}</span></p>
          </div>
        </div>
                
        <div className="flex-1 flex flex-col justify-between max-w-2xl mx-auto w-full">
          {/* Dealer Hand */}
          <DealerHand 
            cards={gameState.dealerHand}
            hideSecondCard={gameState.isDealerSecondCardHidden}
            score={gameState.phase === 'finished' || !gameState.isDealerSecondCardHidden ? gameState.dealerScore : gameState.dealerVisibleScore}
            dealingSequence={gameState.dealingSequences.dealer}
          />
          
          {/* Game Message */}
          {gameState.message && (
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{gameState.message}</p>
            </div>
          )}
          
          {/* Player Hand and Actions */}
          <div className="space-y-6">
            <PlayerHand 
              cards={gameState.playerHand}
              score={gameState.playerScore}
              dealingSequence={gameState.dealingSequences.player}
            />
            
            {/* Show action buttons only during player's turn */}
            {gameState.phase === 'playing' && (
              <ActionButtons
                onHit={handleHit}
                onStand={handleStand}
                onDouble={handleDouble}
                canDouble={canDouble}
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

          {/* Show current bet during game */}
          {gameState.phase !== 'betting' && (
            <div className="text-center">
              <p className="text-lg font-semibold">Current Bet: <span className="text-yellow-400">${gameState.currentBet}</span></p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}