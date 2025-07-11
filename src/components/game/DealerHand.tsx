import { Card } from '@/components/ui/Card'
import type { Card as CardType } from '@/types/card'

interface DealerHandProps {
  cards: CardType[]
  hideSecondCard?: boolean
  score?: number
  dealingSequence?: number[]  // Array of delays for each card position
}

export function DealerHand({ cards, hideSecondCard = true, score, dealingSequence = [] }: DealerHandProps) {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-3">Dealer Hand</h2>
      <div className="flex gap-3 justify-center mb-2">
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <Card 
              key={card.id} 
              card={card} 
              isFlipped={hideSecondCard && index === 1}
              dealingDelay={dealingSequence[index] || 0}
            />
          ))
        ) : (
          // Show placeholder cards when hand is empty
          <>
            <div className="w-20 h-33 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center opacity-50">
              <span className="text-gray-400 text-xs">Card 1</span>
            </div>
            <div className="w-20 h-33 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center opacity-50">
              <span className="text-gray-400 text-xs">Card 2</span>
            </div>
          </>
        )}
      </div>
      {score && !hideSecondCard && (
        <p className="text-lg font-semibold">Score: <span className="text-red-400">{score}</span></p>
      )}
    </div>
  )
}