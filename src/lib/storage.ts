import type { Card } from '@/types/card'
export type GameResult = 'win' | 'lose' | 'push' | 'blackjack'

export interface SavedGameState {
  money: number
  timestamp: number
  // Add full game state
  playerHands: Card[][]
  dealerHand: Card[]
  currentHandIndex: number
  playerScores: number[]
  dealerScore: number
  dealerVisibleScore: number
  bets: number[]
  phase: 'betting' | 'dealing' | 'playing' | 'dealer' | 'finished'
  results?: GameResult[]  // Use the correct type
  messages?: string[]
  totalWinnings?: number
  isDealerSecondCardHidden: boolean
  dealingSequences: {
    player: number[][]
    dealer: number[]
  }
}

const GUEST_SAVE_KEY = 'blackjack_guest_save'

export class GameStorage {
  // Save complete game state
  static saveGuestProgress(gameState: Partial<SavedGameState>): void {
    if (typeof window === 'undefined') return // Server-side check
    
    try {
      // Ensure all required fields have default values
      const saveData: SavedGameState = {
        money: 1000,
        playerHands: [[]],
        dealerHand: [],
        currentHandIndex: 0,
        playerScores: [0],
        dealerScore: 0,
        dealerVisibleScore: 0,
        bets: [25],
        phase: 'betting',
        isDealerSecondCardHidden: true,
        dealingSequences: {
          player: [[]],
          dealer: []
        },
        ...gameState,
        timestamp: Date.now()
      }
      
      localStorage.setItem(GUEST_SAVE_KEY, JSON.stringify(saveData))
    } catch (error) {
      console.error('Failed to save game progress:', error)
    }
  }

  // Load complete game state
  static loadGuestProgress(): SavedGameState | null {
    if (typeof window === 'undefined') return null // Server-side check
    
    try {
      const saved = localStorage.getItem(GUEST_SAVE_KEY)
      if (!saved) return null

      const saveData = JSON.parse(saved)
      
      // Validate required fields exist
      if (!saveData || typeof saveData.money !== 'number' || !Array.isArray(saveData.playerHands)) {
        console.warn('Invalid save data format, clearing save')
        localStorage.removeItem(GUEST_SAVE_KEY)
        return null
      }
      
      // Check if save is less than 7 days old
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
      if (saveData.timestamp < sevenDaysAgo) {
        localStorage.removeItem(GUEST_SAVE_KEY)
        return null
      }

      return saveData as SavedGameState
    } catch (error) {
      console.error('Failed to load game progress:', error)
      // Clear corrupted save data - but only if localStorage is available
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem(GUEST_SAVE_KEY)
        }
      } catch {
        // Ignore removal errors in edge cases
      }
      return null
    }
  }

  // Clear guest save data
  static clearGuestProgress(): void {
    if (typeof window === 'undefined') return // Server-side check
    
    try {
      localStorage.removeItem(GUEST_SAVE_KEY)
    } catch (error) {
      console.error('Failed to clear game progress:', error)
    }
  }

  // Check if guest has saved progress
  static hasGuestProgress(): boolean {
    if (typeof window === 'undefined') return false // Server-side check
    return this.loadGuestProgress() !== null
  }

  // Daily rewards functionality
  static saveLastClaimDate(date: Date): void {
    if (typeof window === 'undefined') return // Server-side check
    
    try {
      localStorage.setItem('blackjack_last_claim', date.toISOString())
    } catch (error) {
      console.error('Failed to save last claim date:', error)
    }
  }

  static getLastClaimDate(): Date | null {
    if (typeof window === 'undefined') return null // Server-side check
    
    try {
      const dateString = localStorage.getItem('blackjack_last_claim')
      if (!dateString) return null
      
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? null : date
    } catch (error) {
      console.error('Failed to get last claim date:', error)
      return null
    }
  }
}