// Types for the rewards system
export interface DailyReward {
  day: number
  amount: number
  claimed: boolean
  claimedAt?: Date
}

export interface RewardStreak {
  currentStreak: number
  lastClaimDate: string | null
  totalClaimed: number
  maxStreak: number
}

export interface RewardServiceInterface {
  // Core methods
  checkDailyReward(): Promise<DailyReward | null>
  claimDailyReward(): Promise<{ success: boolean; reward?: DailyReward; error?: string }>
  getStreak(): Promise<RewardStreak>
  
  // Helper methods
  canClaimToday(): Promise<boolean>
  getNextRewardAmount(): Promise<number>
  resetStreak(): Promise<void>
}