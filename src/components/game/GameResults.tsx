'use client'

interface GameResultsProps {
  results: string[]
  bets: number[]
  totalWinnings: number
  totalHands: number
  money: number  // Add money prop to check if player can bet
}

export function GameResults({ results, bets, totalWinnings, totalHands, money }: GameResultsProps) {
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
      case 'win':
      case 'blackjack':
        return '🎉'
      case 'lose':
        return '💸'
      case 'push':
        return '🤝'
      default:
        return '🎲'
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
      <div className="text-center">
        {/* Compact single-line result */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-2 border border-gray-600 flex items-center justify-between">
          <h2 className={`text-lg font-bold ${getTotalResultColor()}`}>
            {getResultTitle()}
          </h2>
          
          <div className={`text-lg font-bold ${getTotalResultColor()}`}>
            {totalWinnings > 0 && '+'}${totalWinnings}
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

  // Normal mode for 1-2 hands
  return (
    <div className="text-center space-y-4">
      {/* Main Result Title */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-4 border border-gray-600">
        <h2 className={`text-2xl font-bold mb-2 ${getTotalResultColor()}`}>
          {getResultTitle()}
        </h2>
        
        {/* Money Change Display */}
        <div className={`text-xl font-bold ${getTotalResultColor()}`}>
          {totalWinnings > 0 && '+'}${totalWinnings}
        </div>
        <p className="text-gray-300 text-sm">
          {totalWinnings > 0 ? 'Money Won' : totalWinnings < 0 ? 'Money Lost' : 'No Change'}
        </p>

        {/* Game Over message if no money left */}
        {money <= 0 && (
          <p className="text-red-400 text-sm mt-2 font-bold">
            Game Over - No money left!
          </p>
        )}
      </div>

      {/* Individual Hand Results - Only show if multiple hands */}
      {results.length > 1 && (
        <div className="space-y-2">
          {results.map((result, index) => {
            const bet = bets[index]
            const handWinnings = result === 'win' ? bet : 
                                result === 'blackjack' ? Math.floor(bet * 1.5) :
                                result === 'push' ? 0 : -bet
            
            return (
              <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getResultIcon(result)}</span>
                  <p className={`text-sm font-semibold ${getResultColor(result)}`}>
                    Hand {index + 1}: {result.toUpperCase()}
                  </p>
                </div>
                
                <div className={`text-sm font-bold ${getResultColor(result)}`}>
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