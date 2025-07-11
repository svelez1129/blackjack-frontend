import { Card } from '@/components/ui/Card'
import type { Card as CardType } from '@/types/card'

interface PlayerHandProps {
  cards: CardType[]
  score?: number
}

export function PlayerHand({ cards, score }: PlayerHandProps) {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-3">Your Hand</h2>
      <div className="flex gap-3 justify-center mb-2">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
      {score && (
        <p className="text-lg font-semibold">Score: <span className="text-yellow-400">{score}</span></p>
      )}
    </div>
  )
}