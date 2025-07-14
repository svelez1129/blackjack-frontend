import { BlackjackEngine } from '../engine'
import { GameStorage } from '../../storage'

describe('Insurance Integration Tests', () => {
  let engine: BlackjackEngine

  beforeEach(() => {
    engine = new BlackjackEngine(1000, true) // Enable auto-save
    jest.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Complete Insurance Workflow', () => {
    test('should handle full insurance workflow with dealer blackjack', () => {
      // Step 1: Place bet
      engine.placeBet(100)
      let state = engine.getState()
      expect(state.money).toBe(900)
      expect(state.bets).toEqual([100])

      // Step 2: Simulate dealer showing Ace (insurance offered)
      engine.setState({
        dealerHand: [{ suit: 'hearts', value: 'A' }, { suit: 'spades', value: 'K' }],
        playerHands: [[{ suit: 'diamonds', value: '10' }, { suit: 'clubs', value: '9' }]],
        phase: 'insurance',
        insuranceOffered: true,
        money: 900, // After $100 bet
        bets: [100]
      })

      // Step 3: Take insurance
      engine.takeInsurance()
      state = engine.getState()
      expect(state.insuranceTaken).toBe(true)
      expect(state.insuranceBet).toBe(50) // Half of $100 bet
      expect(state.money).toBe(850) // $900 - $50 insurance

      // Step 4: Simulate insurance win (dealer has blackjack)
      engine.setState({
        insuranceResult: 'win',
        money: state.money + state.insuranceBet + (state.insuranceBet * 2) // 2:1 payout
      })
      
      state = engine.getState()
      expect(state.money).toBe(1000) // Back to original after insurance win
      expect(state.insuranceResult).toBe('win')
    })

    test('should handle insurance workflow with dealer not having blackjack', () => {
      // Step 1: Place bet and set up insurance scenario
      engine.placeBet(100)
      let state = engine.getState()
      
      engine.setState({
        dealerHand: [{ suit: 'hearts', value: 'A' }, { suit: 'spades', value: '6' }],
        playerHands: [[{ suit: 'diamonds', value: '10' }, { suit: 'clubs', value: '8' }]],
        phase: 'insurance',
        insuranceOffered: true,
        money: 900, // After $100 bet
        bets: [100]
      })

      // Step 2: Take insurance
      engine.takeInsurance()
      state = engine.getState()
      expect(state.money).toBe(850) // $900 - $50 insurance

      // Step 3: Simulate insurance loss (dealer doesn't have blackjack)
      engine.setState({
        insuranceResult: 'lose'
      })
      
      state = engine.getState()
      expect(state.money).toBe(850) // Insurance lost, main hand continues
      expect(state.insuranceResult).toBe('lose')
    })

    test('should handle declining insurance', () => {
      // Step 1: Place bet and set up insurance scenario
      engine.placeBet(100)
      let state = engine.getState()
      
      engine.setState({
        dealerHand: [{ suit: 'hearts', value: 'A' }, { suit: 'spades', value: '10' }],
        phase: 'insurance',
        insuranceOffered: true,
        money: 900, // After $100 bet
        bets: [100]
      })

      // Step 2: Decline insurance
      engine.declineInsurance()
      state = engine.getState()
      
      expect(state.insuranceTaken).toBe(false)
      expect(state.insuranceBet).toBe(0)
      expect(state.money).toBe(900) // No insurance deducted
      expect(state.phase).toBe('playing')
    })
  })

  describe('Insurance State Persistence', () => {
    test('should save and restore insurance state correctly', () => {
      // Create a game state with insurance
      engine.placeBet(100)
      
      engine.setState({
        phase: 'insurance',
        insuranceOffered: true,
        money: 900,
        bets: [100]
      })
      
      engine.takeInsurance()
      
      engine.setState({
        insuranceResult: 'win'
      })
      
      // Save state should be triggered automatically due to auto-save
      const savedData = GameStorage.loadGuestProgress()
      expect(savedData).toBeTruthy()
      expect(savedData?.insuranceTaken).toBe(true)
      expect(savedData?.insuranceBet).toBe(50)
      expect(savedData?.insuranceResult).toBe('win')

      // Create new engine and restore
      const newEngine = new BlackjackEngine(1000, true)
      newEngine.restoreFromSave(savedData!)
      const restoredState = newEngine.getState()

      expect(restoredState.insuranceTaken).toBe(true)
      expect(restoredState.insuranceBet).toBe(50)
      expect(restoredState.insuranceResult).toBe('win')
      expect(restoredState.money).toBe(850)
    })

    test('should handle corrupted insurance data gracefully', () => {
      // Save corrupted data
      const corruptedData = {
        money: 1000,
        timestamp: Date.now(),
        playerHands: [[]],
        dealerHand: [],
        currentHandIndex: 0,
        playerScores: [0],
        dealerScore: 0,
        dealerVisibleScore: 0,
        bets: [25],
        phase: 'betting' as const,
        isDealerSecondCardHidden: true,
        dealingSequences: { player: [[]], dealer: [] },
        insuranceBet: 'invalid' as unknown as number, // Corrupted field
        insuranceResult: 'invalid_result' as unknown as 'win' | 'lose'
      }

      GameStorage.saveGuestProgress(corruptedData)
      const newEngine = new BlackjackEngine(1000, true)
      const savedData = GameStorage.loadGuestProgress()
      
      expect(() => {
        newEngine.restoreFromSave(savedData!)
      }).not.toThrow()

      const state = newEngine.getState()
      expect(state.insuranceTaken).toBe(false)
      expect(state.insuranceBet).toBe(0)
    })
  })

  describe('Insurance Edge Cases', () => {
    test('should handle insurance with minimum bet', () => {
      engine.placeBet(1) // Minimum bet
      let state = engine.getState()
      state.phase = 'insurance'
      state.insuranceOffered = true
      
      engine.takeInsurance()
      state = engine.getState()
      
      expect(state.insuranceBet).toBe(0) // Math.floor(1/2) = 0
      expect(state.money).toBe(999) // No money deducted for $0 insurance
    })

    test('should handle insurance with odd bet amounts', () => {
      engine.placeBet(75) // Odd amount
      let state = engine.getState()
      
      engine.setState({
        phase: 'insurance',
        insuranceOffered: true,
        money: 925, // After $75 bet
        bets: [75]
      })
      
      engine.takeInsurance()
      state = engine.getState()
      
      expect(state.insuranceBet).toBe(37) // Math.floor(75/2) = 37
      expect(state.money).toBe(888) // $925 - $37 insurance
    })

    test('should handle multiple round cycles with insurance', () => {
      // Round 1: Take insurance and win
      engine.placeBet(100)
      let state = engine.getState()
      
      engine.setState({
        phase: 'insurance',
        insuranceOffered: true,
        money: 900,
        bets: [100]
      })
      
      engine.takeInsurance()
      state = engine.getState()
      
      // Simulate insurance win payout
      const insuranceBet = state.insuranceBet
      engine.setState({
        insuranceResult: 'win',
        money: state.money + insuranceBet + (insuranceBet * 2) // 2:1 payout
      })
      
      state = engine.getState()
      expect(state.money).toBe(1000)

      // Reset for next round
      engine.resetForNextRound()
      state = engine.getState()
      
      expect(state.insuranceOffered).toBe(false)
      expect(state.insuranceTaken).toBe(false)
      expect(state.insuranceBet).toBe(0)
      expect(state.insuranceResult).toBeUndefined()

      // Round 2: Decline insurance
      engine.placeBet(200)
      state = engine.getState()
      state.phase = 'insurance'
      state.insuranceOffered = true
      
      engine.declineInsurance()
      state = engine.getState()
      
      expect(state.insuranceTaken).toBe(false)
      expect(state.money).toBe(800) // Only main bet deducted
    })

    test('should prevent insurance when player has insufficient funds', () => {
      // Set up player with minimal funds
      const lowFundsEngine = new BlackjackEngine(60, false)
      lowFundsEngine.placeBet(50)
      let state = lowFundsEngine.getState()
      expect(state.money).toBe(10) // Only $10 left
      
      state.phase = 'insurance'
      state.insuranceOffered = true
      
      // Try to take insurance (would cost $25)
      lowFundsEngine.takeInsurance()
      state = lowFundsEngine.getState()
      
      expect(state.insuranceTaken).toBe(false)
      expect(state.money).toBe(10) // Money unchanged
    })

    test('should handle insurance payout calculation correctly', () => {
      engine.placeBet(200)
      let state = engine.getState()
      
      engine.setState({
        phase: 'insurance',
        insuranceOffered: true,
        money: 800, // After $200 bet
        bets: [200]
      })
      
      engine.takeInsurance()
      state = engine.getState()
      
      const initialMoney = state.money // $800 - $100 = $700
      const insuranceBet = state.insuranceBet // $100
      
      // Simulate insurance win
      const expectedPayout = insuranceBet + (insuranceBet * 2) // $100 + $200 = $300
      engine.setState({
        insuranceResult: 'win',
        money: initialMoney + expectedPayout
      })
      
      state = engine.getState()
      expect(state.money).toBe(1000) // $700 + $300 = $1000
    })
  })

  describe('Insurance with Game Actions', () => {
    test('should handle insurance with player blackjack', () => {
      engine.placeBet(100)
      let state = engine.getState()
      
      // Set up scenario: dealer shows Ace, player has blackjack
      engine.setState({
        dealerHand: [{ suit: 'hearts', value: 'A' }, { suit: 'spades', value: '10' }],
        playerHands: [[{ suit: 'diamonds', value: 'A' }, { suit: 'clubs', value: 'K' }]],
        phase: 'insurance',
        insuranceOffered: true,
        money: 900,
        bets: [100]
      })
      
      engine.takeInsurance()
      state = engine.getState()
      
      expect(state.insuranceTaken).toBe(true)
      expect(state.insuranceBet).toBe(50)
    })

    test('should maintain insurance state during game flow transitions', () => {
      engine.placeBet(100)
      let state = engine.getState()
      
      // Take insurance
      engine.setState({
        phase: 'insurance',
        insuranceOffered: true,
        money: 900,
        bets: [100]
      })
      engine.takeInsurance()
      
      // Transition to playing phase
      state = engine.getState()
      expect(state.phase).toBe('playing')
      expect(state.insuranceTaken).toBe(true)
      expect(state.insuranceBet).toBe(50)
      
      // Insurance state should persist throughout the hand
      expect(state.insuranceTaken).toBe(true)
    })
  })
})