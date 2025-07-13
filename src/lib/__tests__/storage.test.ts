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
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage full')
      })

      expect(() => {
        GameStorage.saveGuestProgress({ money: 1000 })
      }).not.toThrow()

      // Restore original
      localStorage.setItem = originalSetItem
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

    test('should return null when no progress exists', () => {
      const result = GameStorage.loadGuestProgress()
      expect(result).toBeNull()
    })

    test('should handle corrupted data gracefully', () => {
      localStorage.setItem('blackjack_guest_save', 'invalid json')

      const result = GameStorage.loadGuestProgress()
      expect(result).toBeNull()
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
    })
  })
})