import type { Card } from '@/types/card'
import { createSixDeckShoe, dealCard } from './deck'
import { calculateHandScore, isBlackjack, isBust } from './scoring'
import { canSplit } from '@/types/game'

export type GamePhase = 'betting' | 'dealing' | 'playing' | 'dealer' | 'finished'
export type GameResult = 'win' | 'lose' | 'push' | 'blackjack'

export interface GameState {
  playerHands: Card[][]  // Array of hands for splitting
  dealerHand: Card[]
  deck: Card[]
  currentHandIndex: number
  playerScores: number[]
  dealerScore: number
  dealerVisibleScore: number
  bets: number[]  // Bet for each hand
  money: number
  phase: GamePhase
  results?: GameResult[]
  messages?: string[]
  totalWinnings?: number
  isDealerSecondCardHidden: boolean
  dealingSequences: {
    player: number[][]  // Sequences for each hand
    dealer: number[]
  }
}

export class BlackjackEngine {
  private state: GameState
  private onStateUpdate?: () => void

  constructor(initialMoney: number = 1000) {
    this.state = {
      playerHands: [[]],
      dealerHand: [],
      deck: createSixDeckShoe(),
      currentHandIndex: 0,
      playerScores: [0],
      dealerScore: 0,
      dealerVisibleScore: 0,
      bets: [25],
      money: initialMoney,
      phase: 'betting',
      totalWinnings: 0,
      isDealerSecondCardHidden: true,
      dealingSequences: {
        player: [[]],
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
    
    this.state.bets = [amount]
    this.state.money -= amount
    this.state.phase = 'dealing'
    this.dealInitialCards()
  }

  private dealInitialCards(): void {
    const CARD_DELAY = 600

    // Deal 2 cards to player, 2 to dealer
    const { card: playerCard1, remainingDeck: deck1 } = dealCard(this.state.deck)
    const { card: dealerCard1, remainingDeck: deck2 } = dealCard(deck1)
    const { card: playerCard2, remainingDeck: deck3 } = dealCard(deck2)
    const { card: dealerCard2, remainingDeck: deck4 } = dealCard(deck3)

    this.state.playerHands = [[playerCard1, playerCard2]]
    this.state.dealerHand = [dealerCard1, dealerCard2]
    this.state.deck = deck4
    this.state.currentHandIndex = 0
    this.state.isDealerSecondCardHidden = true

    // Set up dealing sequence timing
    this.state.dealingSequences = {
      player: [[0, CARD_DELAY * 2]],  // Player: immediate, then at 1200ms
      dealer: [CARD_DELAY, CARD_DELAY * 3]   // Dealer: 600ms, then 1800ms
    }

    this.updateScores()

    // Transition to playing phase
    setTimeout(() => {
      this.state.phase = 'playing'
      this.onStateUpdate?.()

      // Check for blackjacks after dealing
      setTimeout(() => {
        if (isBlackjack(this.state.playerHands[0])) {
          if (isBlackjack(this.state.dealerHand)) {
            this.revealDealerCard()
            this.endGame(['push'], ['Both have blackjack - Push!'])
          } else {
            this.endGame(['blackjack'], ['Blackjack! You win!'])
          }
        } else if (isBlackjack(this.state.dealerHand)) {
          this.revealDealerCard()
          this.endGame(['lose'], ['Dealer has blackjack!'])
        }
        this.onStateUpdate?.()
      }, CARD_DELAY * 2)
    }, 100)
  }

  hit(): void {
    if (this.state.phase !== 'playing') return
    
    const handIndex = this.state.currentHandIndex
    const { card, remainingDeck } = dealCard(this.state.deck)
    
    this.state.playerHands[handIndex].push(card)
    this.state.deck = remainingDeck

    // Add timing for new card
    const newCardIndex = this.state.playerHands[handIndex].length - 1
    this.state.dealingSequences.player[handIndex][newCardIndex] = 0

    this.updateScores()

    if (isBust(this.state.playerHands[handIndex])) {
      this.moveToNextHand()
    }
  }

  stand(): void {
    if (this.state.phase !== 'playing') return
    this.moveToNextHand()
  }

  double(): void {
    if (this.state.phase !== 'playing') return
    
    const handIndex = this.state.currentHandIndex
    if (this.state.playerHands[handIndex].length !== 2) return
    if (this.state.bets[handIndex] > this.state.money) return

    // Double the bet
    this.state.money -= this.state.bets[handIndex]
    this.state.bets[handIndex] *= 2

    // Hit once and move to next hand
    this.hit()
    if (this.state.phase === 'playing') {
      setTimeout(() => {
        this.moveToNextHand()
      }, 300)
    }
  }

split(): void {
  if (this.state.phase !== 'playing') return
  
  const handIndex = this.state.currentHandIndex
  const currentHand = this.state.playerHands[handIndex]
  
  if (!canSplit(currentHand)) return
  if (this.state.bets[handIndex] > this.state.money) return
  if (this.state.playerHands.length >= 4) return // Max 4 hands (3 splits)

  // Rest of split logic remains the same...
  // Deduct money for split bet
  this.state.money -= this.state.bets[handIndex]

  // Split the hand
  const [card1, card2] = currentHand
  this.state.playerHands[handIndex] = [card1]
  this.state.playerHands.splice(handIndex + 1, 0, [card2])

  // Add bet for new hand
  this.state.bets.splice(handIndex + 1, 0, this.state.bets[handIndex])

  // Add dealing sequence for new hand
  this.state.dealingSequences.player.splice(handIndex + 1, 0, [0])

  // Deal one card to each split hand
  const { card: newCard1, remainingDeck: deck1 } = dealCard(this.state.deck)
  const { card: newCard2, remainingDeck: deck2 } = dealCard(deck1)
  
  this.state.playerHands[handIndex].push(newCard1)
  this.state.playerHands[handIndex + 1].push(newCard2)
  this.state.deck = deck2

  // Set up animations for new cards
  this.state.dealingSequences.player[handIndex][1] = 0
  this.state.dealingSequences.player[handIndex + 1][1] = 300

  this.updateScores()
  this.onStateUpdate?.()
}

  private moveToNextHand(): void {
    if (this.state.currentHandIndex < this.state.playerHands.length - 1) {
      this.state.currentHandIndex++
      this.onStateUpdate?.()
    } else {
      // All hands played, move to dealer
      this.revealDealerCard()
      this.state.phase = 'dealer'
      setTimeout(() => {
        this.playDealerHand()
      }, 500)
    }
  }

  canSplitCurrentHand(): boolean {
  const handIndex = this.state.currentHandIndex
  const currentHand = this.state.playerHands[handIndex]
  return canSplit(currentHand) && 
         this.state.bets[handIndex] <= this.state.money &&
         this.state.playerHands.length < 4  // Max 4 hands
}

  canDoubleCurrentHand(): boolean {
    const handIndex = this.state.currentHandIndex
    return this.state.playerHands[handIndex].length === 2 && 
           this.state.bets[handIndex] <= this.state.money &&
           this.state.phase === 'playing'
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

        const newCardIndex = this.state.dealerHand.length - 1
        this.state.dealingSequences.dealer[newCardIndex] = 0

        this.onStateUpdate?.()
        setTimeout(dealMoreCards, 1000)
      } else {
        this.determineWinners()
      }
    }

    dealMoreCards()
  }

  private determineWinners(): void {
    const results: GameResult[] = []
    const messages: string[] = []

    this.state.playerHands.forEach((hand, index) => {
      const playerScore = this.state.playerScores[index]
      
      if (isBust(hand)) {
        results.push('lose')
        messages.push(`Hand ${index + 1}: Bust!`)
      } else if (isBust(this.state.dealerHand)) {
        results.push('win')
        messages.push(`Hand ${index + 1}: Dealer busts - You win!`)
      } else if (playerScore > this.state.dealerScore) {
        results.push('win')
        messages.push(`Hand ${index + 1}: You win!`)
      } else if (playerScore < this.state.dealerScore) {
        results.push('lose')
        messages.push(`Hand ${index + 1}: Dealer wins`)
      } else {
        results.push('push')
        messages.push(`Hand ${index + 1}: Push`)
      }
    })

    this.endGame(results, messages)
  }

  private isDealerSoft(): boolean {
    const { isSoft } = calculateHandScore(this.state.dealerHand)
    return isSoft
  }

  private updateScores(): void {
    this.state.playerScores = this.state.playerHands.map(hand => 
      calculateHandScore(hand).score
    )
    
    this.state.dealerScore = calculateHandScore(this.state.dealerHand).score
    
    if (this.state.isDealerSecondCardHidden && this.state.dealerHand.length >= 1) {
      this.state.dealerVisibleScore = calculateHandScore([this.state.dealerHand[0]]).score
    } else {
      this.state.dealerVisibleScore = this.state.dealerScore
    }
  }

  private endGame(results: GameResult[], messages: string[]): void {
    this.state.phase = 'finished'
    this.state.results = results
    this.state.messages = messages

    let totalWinnings = 0

    // Award winnings for each hand
    results.forEach((result, index) => {
        const bet = this.state.bets[index]
        let handWinnings = 0
        
        if (result === 'win') {
        handWinnings = bet  // Win the bet amount
        this.state.money += bet * 2  // Get bet back + winnings
        } else if (result === 'blackjack') {
        handWinnings = Math.floor(bet * 1.5)  // 3:2 payout
        this.state.money += bet + handWinnings  // Get bet back + winnings
        } else if (result === 'push') {
        handWinnings = 0  // No change
        this.state.money += bet  // Just get bet back
        } else {
        handWinnings = -bet  // Lose the bet
        // Money already deducted when bet was placed
        }
        
        totalWinnings += handWinnings
    })

    // Store total winnings for display
    this.state.totalWinnings = totalWinnings

    this.onStateUpdate?.()
  }

  // Add this new method after the endGame method
  resetForNextRound(): void {
        this.state.playerHands = [[]]
        this.state.dealerHand = []
        this.state.currentHandIndex = 0
        this.state.playerScores = [0]
        this.state.dealerScore = 0
        this.state.dealerVisibleScore = 0
        this.state.bets = [25]
        this.state.phase = 'betting'
        this.state.results = undefined
        this.state.messages = undefined
        this.state.totalWinnings = 0
        this.state.isDealerSecondCardHidden = true
        this.state.dealingSequences = {
            player: [[]],
            dealer: []
        }
        // Keep money and deck as they are
        // Reshuffle deck if getting low
        if (this.state.deck.length < 50) {
            this.state.deck = createSixDeckShoe()
        }
  }
  newGame(): void {
    const currentMoney = this.state.money
    this.state = {
      playerHands: [[]],
      dealerHand: [],
      deck: this.state.deck.length < 50 ? createSixDeckShoe() : this.state.deck,
      currentHandIndex: 0,
      playerScores: [0],
      dealerScore: 0,
      dealerVisibleScore: 0,
      bets: [25],
      money: currentMoney,
      phase: 'betting',
      totalWinnings: 0,
      isDealerSecondCardHidden: true,
      dealingSequences: {
        player: [[]],
        dealer: []
      }
    }
  }
}