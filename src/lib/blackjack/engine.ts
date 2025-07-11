import type { Card } from '@/types/card'
import { createSixDeckShoe, dealCard } from './deck'
import { calculateHandScore, isBlackjack, isBust } from './scoring'

export type GamePhase = 'betting' | 'playing' | 'dealer' | 'finished'
export type GameResult = 'win' | 'lose' | 'push' | 'blackjack'

export interface GameState {
  playerHand: Card[]
  dealerHand: Card[]
  deck: Card[]
  playerScore: number
  dealerScore: number
  dealerVisibleScore: number  // Score of only visible dealer cards
  currentBet: number
  money: number
  phase: GamePhase
  result?: GameResult
  message?: string
  isDealerSecondCardHidden: boolean
}

export class BlackjackEngine {
  private state: GameState

  constructor(initialMoney: number = 1000) {
    this.state = {
      playerHand: [],
      dealerHand: [],
      deck: createSixDeckShoe(),
      playerScore: 0,
      dealerScore: 0,
      dealerVisibleScore: 0,
      currentBet: 25,
      money: initialMoney,
      phase: 'betting',
      isDealerSecondCardHidden: true
    }
  }

  getState(): GameState {
    return { ...this.state }
  }

  placeBet(amount: number): void {
    if (this.state.phase !== 'betting') return
    if (amount > this.state.money) return
    
    this.state.currentBet = amount
    this.state.money -= amount
    this.dealInitialCards()
  }

  private dealInitialCards(): void {
    // Deal 2 cards to player, 2 to dealer
    const { card: playerCard1, remainingDeck: deck1 } = dealCard(this.state.deck)
    const { card: dealerCard1, remainingDeck: deck2 } = dealCard(deck1)
    const { card: playerCard2, remainingDeck: deck3 } = dealCard(deck2)
    const { card: dealerCard2, remainingDeck: deck4 } = dealCard(deck3)

    this.state.playerHand = [playerCard1, playerCard2]
    this.state.dealerHand = [dealerCard1, dealerCard2]
    this.state.deck = deck4
    this.state.isDealerSecondCardHidden = true

    this.updateScores()

    // Check for blackjacks (dealer checks hole card)
    if (isBlackjack(this.state.playerHand)) {
      if (isBlackjack(this.state.dealerHand)) {
        this.revealDealerCard()
        this.endGame('push', 'Both have blackjack - Push!')
      } else {
        this.endGame('blackjack', 'Blackjack! You win!')
      }
    } else if (isBlackjack(this.state.dealerHand)) {
      this.revealDealerCard()
      this.endGame('lose', 'Dealer has blackjack!')
    } else {
      this.state.phase = 'playing'
    }
  }

  hit(): void {
    if (this.state.phase !== 'playing') return

    const { card, remainingDeck } = dealCard(this.state.deck)
    this.state.playerHand.push(card)
    this.state.deck = remainingDeck
    this.updateScores()

    if (isBust(this.state.playerHand)) {
      this.revealDealerCard()
      this.endGame('lose', 'Bust! You lose.')
    }
  }

  stand(): void {
    if (this.state.phase !== 'playing') return

    this.revealDealerCard()
    this.state.phase = 'dealer'
    this.playDealerHand()
  }

  double(): void {
    if (this.state.phase !== 'playing') return
    if (this.state.playerHand.length !== 2) return
    if (this.state.currentBet > this.state.money) return

    // Double the bet
    this.state.money -= this.state.currentBet
    this.state.currentBet *= 2

    // Hit once and stand
    this.hit()
    if (this.state.phase === 'playing') {
      this.stand()
    }
  }

  private revealDealerCard(): void {
    this.state.isDealerSecondCardHidden = false
    this.updateScores()
  }

  private playDealerHand(): void {
    // Dealer hits on soft 17
    while (this.state.dealerScore < 17 || 
           (this.state.dealerScore === 17 && this.isDealerSoft())) {
      const { card, remainingDeck } = dealCard(this.state.deck)
      this.state.dealerHand.push(card)
      this.state.deck = remainingDeck
      this.updateScores()
    }

    // Determine winner
    if (isBust(this.state.dealerHand)) {
      this.endGame('win', 'Dealer busts! You win!')
    } else if (this.state.playerScore > this.state.dealerScore) {
      this.endGame('win', 'You win!')
    } else if (this.state.playerScore < this.state.dealerScore) {
      this.endGame('lose', 'Dealer wins.')
    } else {
      this.endGame('push', 'Push!')
    }
  }

  private isDealerSoft(): boolean {
    const { isSoft } = calculateHandScore(this.state.dealerHand)
    return isSoft
  }

  private updateScores(): void {
    this.state.playerScore = calculateHandScore(this.state.playerHand).score
    this.state.dealerScore = calculateHandScore(this.state.dealerHand).score
    
    // Calculate visible dealer score (only first card if second is hidden)
    if (this.state.isDealerSecondCardHidden && this.state.dealerHand.length >= 1) {
      this.state.dealerVisibleScore = calculateHandScore([this.state.dealerHand[0]]).score
    } else {
      this.state.dealerVisibleScore = this.state.dealerScore
    }
  }

  private endGame(result: GameResult, message: string): void {
    this.state.phase = 'finished'
    this.state.result = result
    this.state.message = message

    // Award winnings
    if (result === 'win') {
      this.state.money += this.state.currentBet * 2
    } else if (result === 'blackjack') {
      this.state.money += Math.floor(this.state.currentBet * 2.5) // 3:2 payout
    } else if (result === 'push') {
      this.state.money += this.state.currentBet // Return bet
    }
  }

  newGame(): void {
    // Reset for new game but keep money
    const currentMoney = this.state.money
    this.state = {
      playerHand: [],
      dealerHand: [],
      deck: this.state.deck.length < 50 ? createSixDeckShoe() : this.state.deck,
      playerScore: 0,
      dealerScore: 0,
      dealerVisibleScore: 0,
      currentBet: 25,
      money: currentMoney,
      phase: 'betting',
      isDealerSecondCardHidden: true
    }
  }
}