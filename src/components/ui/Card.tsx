import { Card as CardType, getCardColor } from '@/types/card'

interface CardProps {
  card: CardType
  isFlipped?: boolean  // For dealer's hidden card
}

export function Card({ card, isFlipped = false }: CardProps) {
  const cardColor = getCardColor(card.suit)
  
  // Show card back if flipped
  if (isFlipped) {
    return (
      <div className="w-20 h-33 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg border border-slate-600 flex items-center justify-center">
        <span className="text-slate-400 text-lg">♣</span>
      </div>
    )
  }
  
  // Show actual card
  const suitSymbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
  }
  
  return (
    <div className="w-20 h-33 bg-white rounded-lg border border-gray-300 shadow-lg flex flex-col justify-between p-1.5">
      {/* Top-left corner */}
      <div className={`mr-16 text-sm font-bold ${cardColor === 'red' ? 'text-red-600' : 'text-black'}`}>
        <div>{card.value}</div>
        <div className="text-sm">{suitSymbols[card.suit]}</div>
      </div>
      
      {/* Center symbol */}
      <div className={`text-2xl self-center ${cardColor === 'red' ? 'text-red-600' : 'text-black'}`}>
        {suitSymbols[card.suit]}
      </div>
      
      {/* Bottom-right corner (rotated) */}
      <div className={`text-sm font-bold self-end rotate-180 ${cardColor === 'red' ? 'text-red-600' : 'text-black'}`}>
        <div>{card.value}</div>
        <div className="text-sm">{suitSymbols[card.suit]}</div>
      </div>
    </div>
  )
}