// Main rewards service entry point
// This is where we can easily swap implementations in the future

import { LocalStorageRewardService } from './localStorage-service'
import type { RewardServiceInterface } from './types'

// Factory function to create the rewards service
// In the future, this could check env vars or user status to decide which implementation to use
export function createRewardsService(): RewardServiceInterface {
  // For now, always return localStorage implementation
  // Future: could be API service, Firebase, etc.
  return new LocalStorageRewardService()
}

// Singleton instance for the app
let rewardsServiceInstance: RewardServiceInterface | null = null

export function getRewardsService(): RewardServiceInterface {
  if (!rewardsServiceInstance) {
    rewardsServiceInstance = createRewardsService()
  }
  return rewardsServiceInstance
}

// Export types for consumers
export type { DailyReward, RewardStreak, RewardServiceInterface } from './types'