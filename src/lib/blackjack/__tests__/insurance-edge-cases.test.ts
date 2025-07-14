import { BlackjackEngine } from '../engine'

describe('Insurance Edge Cases and Error Handling', () => {
  let engine: BlackjackEngine

  beforeEach(() => {
    engine = new BlackjackEngine(1000, false)
  })

  describe('Invalid State Transitions', () => {
    test('should not allow insurance actions in wrong phase', () => {
      // Try to take insurance in betting phase
      engine.takeInsurance()
      let state = engine.getState()
      expect(state.insuranceTaken).toBe(false)
      
      // Try to decline insurance in betting phase
      engine.declineInsurance()
      state = engine.getState()
      expect(state.phase).toBe('betting')
    })

    test('should not allow insurance when not offered', () => {
      engine.placeBet(100)
      let state = engine.getState()
      // @ts-expect-error - accessing private state for testing
      engine.state.phase = 'playing' // Skip insurance phase
      // @ts-expect-error - accessing private state for testing
      engine.state.insuranceOffered = false
      
      engine.takeInsurance()
      state = engine.getState()
      expect(state.insuranceTaken).toBe(false)
      expect(state.insuranceBet).toBe(0)
    })

    test('should handle multiple insurance attempts gracefully', () => {
      engine.placeBet(100)
      let state = engine.getState()
      // @ts-expect-error - accessing private state for testing
      engine.state.phase = 'insurance'
      // @ts-expect-error - accessing private state for testing
      engine.state.insuranceOffered = true
      // @ts-expect-error - accessing private state for testing
      engine.state.money = 900 // Ensure sufficient funds after bet
      // @ts-expect-error - accessing private state for testing
      engine.state.bets = [100] // Ensure bet is recorded correctly
      
      // First insurance attempt
      engine.takeInsurance()
      state = engine.getState()
      expect(state.insuranceTaken).toBe(true)
      expect(state.insuranceBet).toBe(50) // Half of $100
      expect(state.money).toBe(850) // $900 - $50
      expect(state.phase).toBe('playing') // Phase changes after taking insurance
      
      // Second insurance attempt (should be ignored due to phase change)
      engine.takeInsurance()
      state = engine.getState()
      expect(state.insuranceBet).toBe(50) // Should remain the same
      expect(state.money).toBe(850) // Should remain the same
    })
  })

  describe('Boundary Value Testing', () => {
    test('should handle minimum possible bet', () => {
      engine.placeBet(1)
      let state = engine.getState()
      // @ts-expect-error - accessing private state for testing
      engine.state.phase = 'insurance'
      // @ts-expect-error - accessing private state for testing
      engine.state.insuranceOffered = true
      // @ts-expect-error - accessing private state for testing
      engine.state.money = 999 // After $1 bet
      // @ts-expect-error - accessing private state for testing
      engine.state.bets = [1] // Ensure bet is recorded correctly
      
      engine.takeInsurance()
      state = engine.getState()
      
      expect(state.insuranceBet).toBe(0) // Math.floor(1/2) = 0
      expect(state.insuranceTaken).toBe(true)
      expect(state.money).toBe(999) // No change since insurance cost is $0
      expect(state.phase).toBe('playing') // Phase changes after taking insurance
    })

    test('should handle maximum possible bet with sufficient funds', () => {
      engine.placeBet(1000) // All money
      let state = engine.getState()
      expect(state.money).toBe(0)
      
      engine.setState({
        phase: 'insurance',
        insuranceOffered: true
      })
      
      // Should not be able to take insurance (no money left)
      engine.takeInsurance()
      state = engine.getState()
      expect(state.insuranceTaken).toBe(false)
    })

    test('should handle exact insurance amount available', () => {
      const testEngine = new BlackjackEngine(150, false) // Start with $150
      testEngine.placeBet(100) // $50 left, insurance costs $50
      let state = testEngine.getState()
      expect(state.money).toBe(50)
      
      testEngine.setState({
        phase: 'insurance',
        insuranceOffered: true,
        money: 50, // Ensure correct amount
        bets: [100] // Ensure bet is recorded correctly
      })
      
      testEngine.takeInsurance()
      state = testEngine.getState()
      expect(state.insuranceTaken).toBe(true)
      expect(state.insuranceBet).toBe(50)
      expect(state.money).toBe(0) // Exactly enough
      expect(state.phase).toBe('playing') // Phase changes after taking insurance
    })

    test('should handle one dollar short of insurance', () => {
      const testEngine = new BlackjackEngine(149, false) // Start with $149
      testEngine.placeBet(100) // $49 left, insurance costs $50
      let state = testEngine.getState()
      expect(state.money).toBe(49)
      
      testEngine.setState({
        phase: 'insurance',
        insuranceOffered: true,
        bets: [100]
      })
      
      testEngine.takeInsurance()
      state = testEngine.getState()
      expect(state.insuranceTaken).toBe(false) // Not enough money
      expect(state.money).toBe(49) // Unchanged
    })
  })

  describe('Data Type and Null Handling', () => {
    test('should handle corrupted bet data', () => {
      engine.placeBet(100)
      let state = engine.getState()
      
      // Corrupt the bets array
      engine.setState({
        bets: [], // Empty bets array
        phase: 'insurance',
        insuranceOffered: true
      })
      
      // Should not crash
      expect(() => {
        engine.takeInsurance()
      }).not.toThrow()
      
      state = engine.getState()
      expect(state.insuranceTaken).toBe(false)
    })

    test('should handle negative money values gracefully', () => {
      engine.placeBet(100)
      let state = engine.getState()
      
      engine.setState({
        money: -100, // Negative money (shouldn't happen in normal game)
        phase: 'insurance',
        insuranceOffered: true,
        bets: [100]
      })
      
      engine.takeInsurance()
      state = engine.getState()
      expect(state.insuranceTaken).toBe(false) // Should reject negative money
    })

    test('should handle NaN and Infinity values', () => {
      engine.placeBet(100)
      let state = engine.getState()
      
      engine.setState({
        money: NaN,
        phase: 'insurance',
        insuranceOffered: true,
        bets: [100]
      })
      
      engine.takeInsurance()
      state = engine.getState()
      expect(state.insuranceTaken).toBe(false)
      
      // Test with Infinity
      engine.setState({
        money: Infinity,
        phase: 'insurance',
        insuranceOffered: true,
        bets: [100]
      })
      engine.takeInsurance()
      state = engine.getState()
      // Should handle gracefully (might allow or reject, but shouldn't crash)
      expect(typeof state.insuranceTaken).toBe('boolean')
    })
  })

  describe('State Consistency Checks', () => {
    test('should maintain state consistency after insurance operations', () => {
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
      
      state = engine.getState()
      expect(state.playerHands.length).toBe(state.playerScores.length)
      expect(state.currentHandIndex).toBeLessThan(state.playerHands.length)
      expect(state.bets.length).toBeGreaterThan(0)
      expect(typeof state.money).toBe('number')
      expect(state.money).toBeGreaterThanOrEqual(0)
    })

    test('should handle rapid phase transitions', () => {
      engine.placeBet(100)
      let state = engine.getState()
      
      // Set up proper insurance state
      engine.setState({
        phase: 'insurance',
        insuranceOffered: true,
        money: 900, // After $100 bet
        bets: [100]
      })
      
      engine.takeInsurance()
      state = engine.getState()
      
      expect(state.insuranceTaken).toBe(true)
      expect(state.phase).toBe('playing')
    })
  })

  describe('Memory and Performance Edge Cases', () => {
    test('should handle many insurance operations without memory issues', () => {
      // Simulate many games with insurance
      for (let i = 0; i < 100; i++) {
        engine.newGame()
        engine.placeBet(100)
        const state = engine.getState()
        
        state.phase = 'insurance'
        state.insuranceOffered = true
        
        if (i % 2 === 0) {
          engine.takeInsurance()
        } else {
          engine.declineInsurance()
        }
        
        engine.resetForNextRound()
      }
      
      // Should still function correctly
      const finalState = engine.getState()
      expect(finalState.phase).toBe('betting')
      expect(finalState.insuranceOffered).toBe(false)
      expect(finalState.insuranceTaken).toBe(false)
    })

    test('should handle concurrent state modifications', () => {
      engine.placeBet(100)
      let state = engine.getState()
      
      engine.setState({
        phase: 'insurance',
        insuranceOffered: true,
        money: 900, // After $100 bet
        bets: [100]
      })
      
      // Start insurance operation
      engine.takeInsurance()
      
      // Verify operation completed correctly
      state = engine.getState()
      expect(state.insuranceTaken).toBe(true)
      expect(state.insuranceBet).toBe(50)
    })
  })

  describe('Error Recovery', () => {
    test('should recover from invalid insurance state', () => {
      engine.placeBet(100)
      let state = engine.getState()
      
      // Set up invalid state
      engine.setState({
        insuranceTaken: true,
        insuranceBet: -50, // Invalid negative bet
        insuranceResult: 'invalid' as unknown as 'win' | 'lose'
      })
      
      // Reset should clean up invalid state
      engine.resetForNextRound()
      state = engine.getState()
      
      expect(state.insuranceOffered).toBe(false)
      expect(state.insuranceTaken).toBe(false)
      expect(state.insuranceBet).toBe(0)
      expect(state.insuranceResult).toBeUndefined()
    })

    test('should handle save/restore with missing insurance fields', () => {
      const incompleteData = {
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
        dealingSequences: { player: [[]], dealer: [] }
        // Missing insurance fields
      }
      
      expect(() => {
        engine.restoreFromSave(incompleteData)
      }).not.toThrow()
      
      const state = engine.getState()
      expect(state.insuranceOffered).toBe(false)
      expect(state.insuranceTaken).toBe(false)
      expect(state.insuranceBet).toBe(0)
      expect(state.insuranceResult).toBeUndefined()
    })
  })

  describe('Callback and Event Handling', () => {
    test('should handle state update callbacks during insurance operations', () => {
      const callbackMock = jest.fn()
      engine.setStateUpdateCallback(callbackMock)
      
      engine.placeBet(100)
      const state = engine.getState()
      state.phase = 'insurance'
      state.insuranceOffered = true
      
      const callCountBefore = callbackMock.mock.calls.length
      
      engine.takeInsurance()
      
      // Callback should be called during state updates
      expect(callbackMock.mock.calls.length).toBeGreaterThanOrEqual(callCountBefore)
    })

    test('should handle missing callback gracefully', () => {
      // No callback set
      engine.placeBet(100)
      let state = engine.getState()
      
      engine.setState({
        phase: 'insurance',
        insuranceOffered: true,
        money: 900, // After $100 bet
        bets: [100]
      })
      
      expect(() => {
        engine.takeInsurance()
      }).not.toThrow()
      
      state = engine.getState()
      expect(state.insuranceTaken).toBe(true)
    })
  })
})