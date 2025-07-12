import { Card } from '@/components/ui/Card'
import type { Card as CardType } from '@/types/card'

interface PlayerHandProps {
  cards: CardType[]
  score?: number
  dealingSequence?: number[]
  handNumber?: number
  isActive?: boolean
  bet?: number
  totalHands?: number
  showScore?: boolean // New prop to control score visibility
}

export function PlayerHand({ 
  cards, 
  score, 
  dealingSequence = [], 
  handNumber,
  isActive = false,
  bet,
  totalHands = 1,
  showScore = false
}: PlayerHandProps) {
  // Dynamic card size based on number of hands
  const getCardSize = (totalHands: number): 'tiny' | 'small' | 'normal' => {
    if (totalHands >= 4) return 'tiny'
    if (totalHands >= 3) return 'small'
    if (totalHands >= 2) return 'small'
    return 'normal'
  }

  const cardSize = getCardSize(totalHands)
  
  // Dynamic spacing based on card size
  const getCardGap = (cardSize: string): string => {
    if (cardSize === 'tiny') return 'gap-1'
    if (cardSize === 'small') return 'gap-2'
    return 'gap-3'
  }

  const cardGap = getCardGap(cardSize)
  
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <h2 className={`${totalHands >= 4 ? 'text-sm' : totalHands >= 2 ? 'text-base' : 'text-xl'} font-serif font-bold text-yellow-400 tracking-wide`}>
          {handNumber ? `Hand ${handNumber}` : 'Your Hand'}
        </h2>
        {isActive && (
          <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-2 py-1 rounded-full font-bold shadow-lg animate-pulse">
            ACTIVE
          </span>
        )}
      </div>
      
      <div className={`flex ${cardGap} justify-center mb-1`}>
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <Card 
              key={card.id} 
              card={card} 
              dealingDelay={dealingSequence[index] || 0}
              size={cardSize}
            />
          ))
        ) : (
          // Show luxury placeholder cards when hand is empty
          <>
            <div className={`${cardSize === 'tiny' ? 'w-12 h-20' : cardSize === 'small' ? 'w-16 h-26' : 'w-20 h-33'} bg-gradient-to-br from-green-800/40 via-green-700/30 to-green-800/40 rounded-lg border-2 border-dashed border-yellow-400/40 flex items-center justify-center opacity-60 backdrop-blur-sm`}>
              <span className="text-yellow-400/70 text-xs font-serif">♠</span>
            </div>
            <div className={`${cardSize === 'tiny' ? 'w-12 h-20' : cardSize === 'small' ? 'w-16 h-26' : 'w-20 h-33'} bg-gradient-to-br from-green-800/40 via-green-700/30 to-green-800/40 rounded-lg border-2 border-dashed border-yellow-400/40 flex items-center justify-center opacity-60 backdrop-blur-sm`}>
              <span className="text-yellow-400/70 text-xs font-serif">♥</span>
            </div>
          </>
        )}
      </div>
      
      {/* Only show score when explicitly requested (during active play) */}
      {showScore && score && (
        <div className="flex justify-center mt-3">
          <div className={`bg-green-900/50 rounded-lg px-3 py-1 border border-yellow-400/30`}>
            <p className={`${totalHands >= 4 ? 'text-xs' : totalHands >= 2 ? 'text-sm' : 'text-base'} font-semibold text-gray-200`}>
              Score: <span className="text-yellow-400 font-bold">{score}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}