import { Card } from '@/components/ui/Card'
import type { Card as CardType } from '@/types/card'

interface DealerHandProps {
  cards: CardType[]
  hideSecondCard?: boolean
  score?: number
}

export function DealerHand({ cards, hideSecondCard = true, score }: DealerHandProps) {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-3">Dealer Hand</h2>
      <div className="flex gap-3 justify-center mb-2">
        {cards.map((card, index) => (
          <Card 
            key={card.id} 
            card={card} 
            isFlipped={hideSecondCard && index === 1}
          />
        ))}
      </div>
      {score && !hideSecondCard && (
        <p className="text-lg font-semibold">Score: <span className="text-red-400">{score}</span></p>
      )}
    </div>
  )
}