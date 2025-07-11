import type { Card } from '@/types/card'

export function calculateHandScore(cards: Card[]): { score: number; isSoft: boolean } {
  let score = 0
  let aces = 0
  
  // Count all cards except aces first
  for (const card of cards) {
    if (card.value === 'A') {
      aces++
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      score += 10
    } else {
      score += parseInt(card.value)
    }
  }
  
  // Add aces (start with all as 11, then convert to 1 if needed)
  score += aces * 11
  let acesAsEleven = aces
  
  // Convert aces from 11 to 1 if score is over 21
  while (score > 21 && acesAsEleven > 0) {
    score -= 10
    acesAsEleven--
  }
  
  const isSoft = acesAsEleven > 0 // Hand is "soft" if it contains an ace counted as 11
  
  return { score, isSoft }
}

export function isBlackjack(cards: Card[]): boolean {
  if (cards.length !== 2) return false
  
  const { score } = calculateHandScore(cards)
  return score === 21
}

export function isBust(cards: Card[]): boolean {
  const { score } = calculateHandScore(cards)
  return score > 21
}