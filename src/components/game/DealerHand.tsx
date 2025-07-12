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
      <div className="mb-12"></div> {/* Larger spacing where title was */}
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
          // Show luxury placeholder cards when hand is empty
          <>
            <div className="w-20 h-33 bg-gradient-to-br from-green-800/40 via-green-700/30 to-green-800/40 rounded-lg border-2 border-dashed border-yellow-400/40 flex items-center justify-center opacity-60 backdrop-blur-sm">
              <span className="text-yellow-400/70 text-sm font-serif">♣</span>
            </div>
            <div className="w-20 h-33 bg-gradient-to-br from-green-800/40 via-green-700/30 to-green-800/40 rounded-lg border-2 border-dashed border-yellow-400/40 flex items-center justify-center opacity-60 backdrop-blur-sm">
              <span className="text-yellow-400/70 text-sm font-serif">♦</span>
            </div>
          </>
        )}
      </div>
      {score && !hideSecondCard && (
        <div className="inline-block bg-green-900/50 rounded-lg px-4 py-2 border border-yellow-400/30 mt-3">
          <p className="text-lg font-semibold text-gray-200">
            Score: <span className="text-red-400 font-bold">{score}</span>
          </p>
        </div>
      )}
    </div>
  )
}