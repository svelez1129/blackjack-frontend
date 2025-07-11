import type { Card } from '@/types/card'

// Create a single 52-card deck
export function createDeck(): Card[] {
  const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades']
  const values: Card['value'][] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const values1: Card['value'][] = ['5','5','5','5','5','5']
  const deck: Card[] = []
  
  suits.forEach(suit => {
    values1.forEach(value => {
      deck.push({
        suit,
        value,
        id: `${suit}-${value}-${Date.now()}-${Math.random()}`
      })
    })
  })
  
  return deck
}

// Create 6-deck shoe (standard casino blackjack)
export function createSixDeckShoe(): Card[] {
  const multiDeck: Card[] = []
  
  for (let deckNum = 0; deckNum < 6; deckNum++) {
    const deck = createDeck()
    // Make each card ID unique across decks
    deck.forEach(card => {
      card.id = `deck${deckNum}-${card.suit}-${card.value}-${Date.now()}-${Math.random()}`
    })
    multiDeck.push(...deck)
  }
  
  return shuffleDeck(multiDeck)
}

// Shuffle deck using Fisher-Yates algorithm
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck]
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled
}

// Deal one card from deck
export function dealCard(deck: Card[]): { card: Card; remainingDeck: Card[] } {
  if (deck.length === 0) {
    throw new Error('Cannot deal from empty deck')
  }
  
  const [card, ...remainingDeck] = deck
  return { card, remainingDeck }
}