// Main achievements service entry point
import { LocalStorageAchievementService } from './localStorage-service'
import type { AchievementServiceInterface } from './types'

// Factory function for achievements service
export function createAchievementsService(): AchievementServiceInterface {
  return new LocalStorageAchievementService()
}

// Singleton instance
let achievementsServiceInstance: AchievementServiceInterface | null = null

export function getAchievementsService(): AchievementServiceInterface {
  if (!achievementsServiceInstance) {
    achievementsServiceInstance = createAchievementsService()
  }
  return achievementsServiceInstance
}

// Export types and definitions
export type { 
  Achievement, 
  AchievementServiceInterface, 
  AchievementType, 
  AchievementRarity,
  GameStats 
} from './types'

export { ACHIEVEMENT_DEFINITIONS, ACHIEVEMENT_CATEGORIES } from './definitions'