export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'
  value: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'
  id: string
}

export type CardColor = 'red' | 'black'

//get card color based on suit
export function getCardColor(suit: Card['suit']): CardColor {
  return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black'
}
