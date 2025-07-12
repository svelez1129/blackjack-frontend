export interface SavedGameState {
  money: number
  timestamp: number
}

const GUEST_SAVE_KEY = 'blackjack_guest_save'

export class GameStorage {
  // Save game state for guest
  static saveGuestProgress(money: number): void {
    try {
      const saveData: SavedGameState = {
        money,
        timestamp: Date.now()
      }
      localStorage.setItem(GUEST_SAVE_KEY, JSON.stringify(saveData))
    } catch (error) {
      console.error('Failed to save game progress:', error)
    }
  }

  // Load game state for guest
  static loadGuestProgress(): SavedGameState | null {
    try {
      const saved = localStorage.getItem(GUEST_SAVE_KEY)
      if (!saved) return null

      const saveData: SavedGameState = JSON.parse(saved)
      
      // Check if save is less than 7 days old
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
      if (saveData.timestamp < sevenDaysAgo) {
        // Save is too old, remove it
        localStorage.removeItem(GUEST_SAVE_KEY)
        return null
      }

      return saveData
    } catch (error) {
      console.error('Failed to load game progress:', error)
      return null
    }
  }

  // Clear guest save data
  static clearGuestProgress(): void {
    try {
      localStorage.removeItem(GUEST_SAVE_KEY)
    } catch (error) {
      console.error('Failed to clear game progress:', error)
    }
  }

  // Check if guest has saved progress
  static hasGuestProgress(): boolean {
    return this.loadGuestProgress() !== null
  }
}