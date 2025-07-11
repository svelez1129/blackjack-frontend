import type { Card } from '@/types/card'
import { createSixDeckShoe, dealCard } from './deck'
import { calculateHandScore, isBlackjack, isBust } from './scoring'

export type GamePhase = 'betting' | 'dealing' | 'playing' | 'dealer' | 'finished'
export type GameResult = 'win' | 'lose' | 'push' | 'blackjack'

export interface GameState {
  playerHand: Card[]
  dealerHand: Card[]
  deck: Card[]
  playerScore: number
  dealerScore: number
  dealerVisibleScore: number
  currentBet: number
  money: number
  phase: GamePhase
  result?: GameResult
  message?: string
  isDealerSecondCardHidden: boolean
  dealingSequences: {
    player: number[]
    dealer: number[]
  }
}

export class BlackjackEngine {
  private state: GameState
  private onStateUpdate?: () => void

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
      isDealerSecondCardHidden: true,
      dealingSequences: {
        player: [],
        dealer: []
      }
    }
  }

  setStateUpdateCallback(callback: () => void): void {
    this.onStateUpdate = callback
  }

  getState(): GameState {
    return { ...this.state }
  }

  placeBet(amount: number): void {
    if (this.state.phase !== 'betting') return
    if (amount > this.state.money) return
    
    this.state.currentBet = amount
    this.state.money -= amount
    this.state.phase = 'dealing'
    this.dealInitialCards()
  }

  private dealInitialCards(): void {
    const CARD_DELAY = 600 // 600ms between each card

    // Deal cards immediately to hands but set up animation timing
    const { card: playerCard1, remainingDeck: deck1 } = dealCard(this.state.deck)
    const { card: dealerCard1, remainingDeck: deck2 } = dealCard(deck1)
    const { card: playerCard2, remainingDeck: deck3 } = dealCard(deck2)
    const { card: dealerCard2, remainingDeck: deck4 } = dealCard(deck3)

    this.state.playerHand = [playerCard1, playerCard2]
    this.state.dealerHand = [dealerCard1, dealerCard2]
    this.state.deck = deck4
    this.state.isDealerSecondCardHidden = true

    // Set up dealing sequence timing
    this.state.dealingSequences = {
      player: [0, CARD_DELAY * 2],           // Player: immediate, then at 1200ms
      dealer: [CARD_DELAY, CARD_DELAY * 3]   // Dealer: 600ms, then 1800ms
    }

    this.updateScores()

    // Transition to playing phase immediately after dealing starts
    // This allows buttons to show while cards are animating
    setTimeout(() => {
      this.state.phase = 'playing'
      this.onStateUpdate?.()

      // Check for blackjacks after all cards are dealt
      setTimeout(() => {
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
        }
        this.onStateUpdate?.()
      }, CARD_DELAY * 2) // Wait for player's second card to appear
    }, 100) // Small delay to show dealing phase briefly
  }

  hit(): void {
    if (this.state.phase !== 'playing') return

    const { card, remainingDeck } = dealCard(this.state.deck)
    this.state.playerHand.push(card)
    this.state.deck = remainingDeck

    // Add timing for new card
    const newCardIndex = this.state.playerHand.length - 1
    this.state.dealingSequences.player[newCardIndex] = 0 // New cards appear immediately

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
    
    // Small delay before dealer starts playing
    setTimeout(() => {
      this.playDealerHand()
    }, 500)
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
      setTimeout(() => {
        this.stand()
      }, 300)
    }
  }

  private revealDealerCard(): void {
    this.state.isDealerSecondCardHidden = false
    this.updateScores()
  }

  private playDealerHand(): void {
    const dealMoreCards = () => {
      this.updateScores()
      
      if (this.state.dealerScore < 17 || 
          (this.state.dealerScore === 17 && this.isDealerSoft())) {
        
        const { card, remainingDeck } = dealCard(this.state.deck)
        this.state.dealerHand.push(card)
        this.state.deck = remainingDeck

        // Add timing for new dealer card
        const newCardIndex = this.state.dealerHand.length - 1
        this.state.dealingSequences.dealer[newCardIndex] = 0

        this.onStateUpdate?.()

        // Continue dealing after animation
        setTimeout(dealMoreCards, 1000)
      } else {
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
        this.onStateUpdate?.()
      }
    }

    dealMoreCards()
  }

  private isDealerSoft(): boolean {
    const { isSoft } = calculateHandScore(this.state.dealerHand)
    return isSoft
  }

  private updateScores(): void {
    this.state.playerScore = calculateHandScore(this.state.playerHand).score
    this.state.dealerScore = calculateHandScore(this.state.dealerHand).score
    
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

    if (result === 'win') {
      this.state.money += this.state.currentBet * 2
    } else if (result === 'blackjack') {
      this.state.money += Math.floor(this.state.currentBet * 2.5)
    } else if (result === 'push') {
      this.state.money += this.state.currentBet
    }
  }

  newGame(): void {
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
      isDealerSecondCardHidden: true,
      dealingSequences: {
        player: [],
        dealer: []
      }
    }
  }
}