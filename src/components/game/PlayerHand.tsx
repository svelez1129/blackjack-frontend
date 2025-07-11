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
}

export function PlayerHand({ 
  cards, 
  score, 
  dealingSequence = [], 
  handNumber,
  isActive = false,
  bet,
  totalHands = 1
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
      <div className="flex items-center justify-center gap-2 mb-1">
        <h2 className={`${totalHands >= 4 ? 'text-sm' : totalHands >= 2 ? 'text-base' : 'text-xl'} font-bold`}>
          {handNumber ? `Hand ${handNumber}` : 'Your Hand'}
        </h2>
        {isActive && (
          <span className="text-xs bg-yellow-400 text-black px-1 py-0.5 rounded font-bold">
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
          // Show placeholder cards when hand is empty
          <>
            <div className={`${cardSize === 'tiny' ? 'w-12 h-20' : cardSize === 'small' ? 'w-16 h-26' : 'w-20 h-33'} bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center opacity-50`}>
              <span className="text-gray-400 text-xs">1</span>
            </div>
            <div className={`${cardSize === 'tiny' ? 'w-12 h-20' : cardSize === 'small' ? 'w-16 h-26' : 'w-20 h-33'} bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center opacity-50`}>
              <span className="text-gray-400 text-xs">2</span>
            </div>
          </>
        )}
      </div>
      
      <div className="flex justify-center gap-2">
        {score && (
          <p className={`${totalHands >= 4 ? 'text-xs' : totalHands >= 2 ? 'text-sm' : 'text-lg'} font-semibold`}>
            Score: <span className="text-yellow-400">{score}</span>
          </p>
        )}
        {bet && (
          <p className={`${totalHands >= 4 ? 'text-xs' : totalHands >= 2 ? 'text-sm' : 'text-lg'} font-semibold`}>
            Bet: <span className="text-green-400">${bet}</span>
          </p>
        )}
      </div>
    </div>
  )
}