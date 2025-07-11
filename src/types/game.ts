import { Card } from './card'

// Game state types
export interface GameState {
  playerHands: Card[][]  // Array of hands (for splits)
  dealerHand: Card[]
  currentHandIndex: number
  money: number
  bets: number[]  // Bet for each hand
  gamePhase: 'betting' | 'dealing' | 'playing' | 'dealer' | 'finished'
  deck: Card[]
  gameResult?: GameResult[]  // Result for each hand
}

export interface GameResult {
  type: 'win' | 'lose' | 'push' | 'blackjack'
  winnings: number
  message: string
}

export type BetAmount = 10 | 25 | 50 | 100

export type GameAction = 'hit' | 'stand' | 'double' | 'split'

// Hand evaluation
export interface HandInfo {
  cards: Card[]
  score: number
  isSoft: boolean  // Contains ace counted as 11
  isBlackjack: boolean
  isBust: boolean
}

// Helper function to check if hand can be split
export function canSplit(hand: Card[]): boolean {
  if (hand.length !== 2) return false
  
  // Can split if both cards have same value
  const [card1, card2] = hand
  
  // All 10-value cards can be split together (10, J, Q, K)
  const getValue = (card: Card): string => {
    return ['J', 'Q', 'K'].includes(card.value) ? '10' : card.value
  }
  
  return getValue(card1) === getValue(card2)
}