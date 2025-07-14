'use client'

import { useState, useEffect } from 'react'

interface GameResultsProps {
  results: string[]
  bets: number[]
  totalWinnings: number
  totalHands: number
  money: number
  insuranceTaken?: boolean
  insuranceBet?: number
  insuranceResult?: 'win' | 'lose'
}

export function GameResults({ results, bets, totalWinnings, totalHands, money, insuranceTaken, insuranceBet, insuranceResult }: GameResultsProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    setShowAnimation(true)
    
    // Show confetti for big wins or blackjacks
    const hasBlackjack = results.some(r => r === 'blackjack')
    const isBigWin = totalWinnings >= 100
    
    if (hasBlackjack || isBigWin) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [results, totalWinnings])
  const getResultColor = (result: string) => {
    switch (result) {
      case 'win':
      case 'blackjack':
        return 'text-emerald-400'
      case 'lose':
        return 'text-red-400'
      case 'push':
        return 'text-yellow-400'
      default:
        return 'text-white'
    }
  }

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'blackjack':
        return '👑'
      case 'win':
        return '💰'
      case 'lose':
        return '💸'
      case 'push':
        return '🤝'
      default:
        return '🎲'
    }
  }

  const getAnimationClass = (result: string) => {
    switch (result) {
      case 'blackjack':
        return 'animate-bounce'
      case 'win':
        return 'animate-pulse'
      case 'lose':
        return 'animate-pulse'
      default:
        return ''
    }
  }

  const getResultTitle = () => {
    const hasWin = results.some(r => r === 'win' || r === 'blackjack')
    const hasLose = results.some(r => r === 'lose')
    
    if (results.length === 1) {
      if (results[0] === 'blackjack') return 'BLACKJACK!'
      if (results[0] === 'win') return 'YOU WIN!'
      if (results[0] === 'lose') return 'YOU LOSE'
      if (results[0] === 'push') return 'PUSH'
    }
    
    // Multiple hands
    if (hasWin && !hasLose) return 'YOU WIN!'
    if (hasLose && !hasWin) return 'YOU LOSE'
    return 'MIXED RESULTS'
  }

  const getTotalResultColor = () => {
    if (totalWinnings > 0) return 'text-emerald-400'
    if (totalWinnings < 0) return 'text-red-400'
    return 'text-yellow-400'
  }

  // Compact mode for 3+ hands
  const isCompact = totalHands >= 3

  if (isCompact) {
    return (
      <div className={`text-center transition-all duration-500 ${showAnimation ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
        {/* Compact single-line result with luxury styling */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-xl p-3 border-2 border-yellow-400/30 shadow-2xl backdrop-blur-sm">
          <div className="absolute inset-1 bg-gradient-to-r from-gray-800/20 via-transparent to-gray-900/30 rounded-lg"></div>
          
          <div className="relative flex items-center justify-between">
            <h2 className={`text-lg font-bold font-serif tracking-wide ${getTotalResultColor()} ${getAnimationClass(results[0])}`}>
              {getResultTitle()}
            </h2>
            
            <div className={`text-lg font-bold font-serif ${getTotalResultColor()}`}>
              {totalWinnings > 0 && '+'}${totalWinnings}
            </div>
          </div>
        </div>
        
        {/* Show individual results in a single compact row for 4 hands */}
        {totalHands === 4 && (
          <div className="flex justify-center gap-1 mt-2">
            {results.map((result, index) => {
              const handWinnings = result === 'win' ? bets[index] : 
                                  result === 'blackjack' ? Math.floor(bets[index] * 1.5) :
                                  result === 'push' ? 0 : -bets[index]
              
              return (
                <div key={index} className="bg-gray-700 rounded px-2 py-1 text-xs">
                  <span className="text-xs">{getResultIcon(result)}</span>
                  <span className={`ml-1 ${getResultColor(result)}`}>
                    {handWinnings > 0 && '+'}${handWinnings}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Game Over message if no money left */}
        {money <= 0 && (
          <p className="text-red-400 text-sm mt-2 font-bold">
            Game Over - No money left!
          </p>
        )}
      </div>
    )
  }

  // Normal mode for 1-2 hands with enhanced animations
  return (
    <div className={`text-center space-y-4 transition-all duration-500 ${showAnimation ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
      {/* Confetti effect for big wins */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              {['🎉', '💰', '✨', '🎊', '💎'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}
      
      {/* Luxury Main Result Panel */}
      <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-6 border-2 border-yellow-400/40 shadow-2xl backdrop-blur-sm">
        <div className="absolute inset-1 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30 rounded-xl"></div>
        
        <div className="relative z-10">
          <h2 className={`text-3xl font-bold mb-4 font-serif tracking-wider ${getTotalResultColor()} ${getAnimationClass(results[0])}`}>
            {getResultTitle()}
          </h2>
          
          {/* Enhanced Money Change Display */}
          <div className={`text-2xl font-bold mb-2 font-serif ${getTotalResultColor()}`}>
            {totalWinnings > 0 && '+'}${totalWinnings}
          </div>
          <p className="text-gray-300 text-sm tracking-wide">
            {totalWinnings > 0 ? 'Money Won' : totalWinnings < 0 ? 'Money Lost' : 'No Change'}
          </p>

          {/* Insurance Result Display */}
          {insuranceTaken && (
            <div className="mt-4 p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-blue-400/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">🛡️</span>
                  <span className="text-blue-200 font-semibold">Insurance</span>
                </div>
                <div className={`font-bold ${insuranceResult === 'win' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {insuranceResult === 'win' ? (
                    <span>+${insuranceBet! * 2} 🎉</span>
                  ) : (
                    <span>-${insuranceBet} ❌</span>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {insuranceResult === 'win' 
                  ? 'Dealer had blackjack - Insurance pays 2:1!' 
                  : 'Dealer did not have blackjack - Insurance lost'
                }
              </p>
            </div>
          )}

          {/* Game Over message with dramatic styling */}
          {money <= 0 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-red-900/50 to-red-800/50 rounded-lg border border-red-500/50">
              <p className="text-red-400 text-lg font-bold font-serif animate-pulse">
                💀 GAME OVER 💀
              </p>
              <p className="text-red-300 text-sm mt-1">
                No money left to continue!
              </p>
            </div>
          )}
        </div>
        
        {/* Subtle shine effect */}
        <div className="absolute top-2 left-2 right-2 h-4 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent rounded-t-xl"></div>
      </div>

      {/* Enhanced Individual Hand Results */}
      {results.length > 1 && (
        <div className="space-y-3">
          {results.map((result, index) => {
            const bet = bets[index]
            const handWinnings = result === 'win' ? bet : 
                                result === 'blackjack' ? Math.floor(bet * 1.5) :
                                result === 'push' ? 0 : -bet
            
            return (
              <div 
                key={index} 
                className={`flex items-center justify-between bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-xl p-3 border border-yellow-400/20 shadow-lg transition-all duration-300 hover:border-yellow-400/40 ${getAnimationClass(result)}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getResultIcon(result)}</span>
                  <p className={`text-sm font-semibold font-serif tracking-wide ${getResultColor(result)}`}>
                    Hand {index + 1}: {result.toUpperCase()}
                  </p>
                </div>
                
                <div className={`text-sm font-bold font-serif ${getResultColor(result)}`}>
                  {handWinnings > 0 && '+'}${handWinnings}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}