import { GameStorage } from '../storage'

describe('GameStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('saveGuestProgress', () => {
    test('should save progress to localStorage', () => {
      const mockProgress = {
        money: 1500,
        timestamp: Date.now()
      }

      GameStorage.saveGuestProgress(mockProgress)

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'blackjack_guest_save',
        expect.stringContaining('"money":1500')
      )
    })

    test('should handle save errors gracefully', () => {
      // Mock localStorage to throw error
      const originalSetItem = localStorage.setItem
      const originalConsoleError = console.error
      
      // Suppress console.error for this test
      console.error = jest.fn()
      
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage full')
      })

      expect(() => {
        GameStorage.saveGuestProgress({ money: 1000 })
      }).not.toThrow()

      // Restore originals
      localStorage.setItem = originalSetItem
      console.error = originalConsoleError
    })
  })

  describe('loadGuestProgress', () => {
    test('should load progress from localStorage', () => {
      const mockProgress = {
        money: 1200,
        timestamp: Date.now(),
        playerHands: [[]],
        dealerHand: [],
        currentHandIndex: 0,
        playerScores: [0],
        dealerScore: 0,
        dealerVisibleScore: 0,
        bets: [],
        phase: 'betting' as const,
        isDealerSecondCardHidden: true,
        dealingSequences: { player: [[]], dealer: [] }
      }

      localStorage.setItem('blackjack_guest_save', JSON.stringify(mockProgress))

      const result = GameStorage.loadGuestProgress()

      expect(result).toBeTruthy()
      expect(result?.money).toBe(1200)
    })

    test('should save and load insurance state correctly', () => {
      const mockProgress = {
        money: 850,
        timestamp: Date.now(),
        playerHands: [[{ suit: 'hearts', value: '10' }, { suit: 'spades', value: '7' }]],
        dealerHand: [{ suit: 'diamonds', value: 'A' }, { suit: 'clubs', value: 'K' }],
        currentHandIndex: 0,
        playerScores: [17],
        dealerScore: 21,
        dealerVisibleScore: 11,
        bets: [100],
        phase: 'finished' as const,
        isDealerSecondCardHidden: false,
        dealingSequences: { player: [[]], dealer: [] },
        insuranceOffered: true,
        insuranceTaken: true,
        insuranceBet: 50,
        insuranceResult: 'win' as const
      }

      GameStorage.saveGuestProgress(mockProgress)
      const result = GameStorage.loadGuestProgress()

      expect(result).toBeTruthy()
      expect(result?.insuranceOffered).toBe(true)
      expect(result?.insuranceTaken).toBe(true)
      expect(result?.insuranceBet).toBe(50)
      expect(result?.insuranceResult).toBe('win')
      expect(result?.money).toBe(850)
    })

    test('should handle missing insurance fields with defaults', () => {
      const mockProgressWithoutInsurance = {
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
        // Note: No insurance fields
      }

      localStorage.setItem('blackjack_guest_save', JSON.stringify(mockProgressWithoutInsurance))
      const result = GameStorage.loadGuestProgress()

      expect(result).toBeTruthy()
      expect(result?.insuranceOffered).toBe(false)
      expect(result?.insuranceTaken).toBe(false)
      expect(result?.insuranceBet).toBe(0)
      expect(result?.insuranceResult).toBeUndefined()
    })

    test('should return null when no progress exists', () => {
      const result = GameStorage.loadGuestProgress()
      expect(result).toBeNull()
    })

    test('should handle corrupted data gracefully', () => {
      // Suppress console.error for this test
      const originalConsoleError = console.error
      console.error = jest.fn()
      
      localStorage.setItem('blackjack_guest_save', 'invalid json')

      const result = GameStorage.loadGuestProgress()
      expect(result).toBeNull()
      
      // Restore console.error
      console.error = originalConsoleError
    })
  })

  describe('clearGuestProgress', () => {
    test('should remove progress from localStorage', () => {
      GameStorage.clearGuestProgress()
      expect(localStorage.removeItem).toHaveBeenCalledWith('blackjack_guest_save')
    })
  })

  describe('Daily Rewards', () => {
    test('should save last claim date', () => {
      const date = new Date('2025-01-13')
      GameStorage.saveLastClaimDate(date)

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'blackjack_last_claim',
        date.toISOString()
      )
    })

    test('should load last claim date', () => {
      const dateString = '2025-01-13T00:00:00.000Z'
      localStorage.setItem('blackjack_last_claim', dateString)

      const result = GameStorage.getLastClaimDate()

      expect(result).toEqual(new Date(dateString))
    })

    test('should return null for invalid claim date', () => {
      localStorage.setItem('blackjack_last_claim', 'invalid date')

      const result = GameStorage.getLastClaimDate()
      expect(result).toBeNull()
    })

    test('should handle missing claim date', () => {
      const result = GameStorage.getLastClaimDate()
      expect(result).toBeNull()
    })
  })

  describe('Error Handling', () => {
    test('should handle localStorage access errors', () => {
      // Mock localStorage to be unavailable (some browsers/modes)
      const originalLocalStorage = window.localStorage
      const originalConsoleError = console.error
      
      // Suppress console.error for this test
      console.error = jest.fn()
      
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true
      })

      expect(() => {
        GameStorage.saveGuestProgress({ money: 1000 })
      }).not.toThrow()

      expect(() => {
        GameStorage.loadGuestProgress()
      }).not.toThrow()

      // Restore
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true
      })
      console.error = originalConsoleError
    })
  })
})