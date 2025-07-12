import type { DailyReward, RewardStreak, RewardServiceInterface } from './types'

const STORAGE_KEYS = {
  LAST_CLAIM: 'daily_reward_last_claim',
  STREAK: 'daily_reward_streak',
  TOTAL_CLAIMED: 'daily_reward_total_claimed',
  MAX_STREAK: 'daily_reward_max_streak'
}

// Daily reward amounts - progressively increases
const REWARD_SCHEDULE = [
  100,  // Day 1
  150,  // Day 2  
  200,  // Day 3
  300,  // Day 4
  400,  // Day 5
  500,  // Day 6
  1000, // Day 7 (big bonus)
  // After day 7, cycle repeats with slight increase
]

export class LocalStorageRewardService implements RewardServiceInterface {
  private isClient(): boolean {
    return typeof window !== 'undefined'
  }

  private getStorage(key: string): string | null {
    if (!this.isClient()) return null
    return localStorage.getItem(key)
  }

  private setStorage(key: string, value: string): void {
    if (!this.isClient()) return
    localStorage.setItem(key, value)
  }

  private getTodayString(): string {
    return new Date().toDateString()
  }

  private getYesterdayString(): string {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toDateString()
  }

  private isConsecutiveDay(lastClaim: string): boolean {
    const yesterday = this.getYesterdayString()
    return lastClaim === yesterday
  }

  private getRewardAmount(day: number): number {
    // Get base reward for the day (1-7)
    const dayIndex = ((day - 1) % 7)
    const baseReward = REWARD_SCHEDULE[dayIndex]
    
    // Add bonus for each completed week
    const weekBonus = Math.floor((day - 1) / 7) * 50
    
    return baseReward + weekBonus
  }

  async checkDailyReward(): Promise<DailyReward | null> {
    const today = this.getTodayString()
    const lastClaim = this.getStorage(STORAGE_KEYS.LAST_CLAIM)
    const currentStreak = parseInt(this.getStorage(STORAGE_KEYS.STREAK) || '0')

    // If already claimed today
    if (lastClaim === today) {
      return {
        day: currentStreak,
        amount: this.getRewardAmount(currentStreak),
        claimed: true,
        claimedAt: new Date(today)
      }
    }

    // Calculate what the streak would be if claimed today
    let newStreak: number
    if (!lastClaim) {
      // First time
      newStreak = 1
    } else if (this.isConsecutiveDay(lastClaim)) {
      // Consecutive day
      newStreak = currentStreak + 1
    } else {
      // Streak broken, restart
      newStreak = 1
    }

    return {
      day: newStreak,
      amount: this.getRewardAmount(newStreak),
      claimed: false
    }
  }

  async claimDailyReward(): Promise<{ success: boolean; reward?: DailyReward; error?: string }> {
    const availableReward = await this.checkDailyReward()
    
    if (!availableReward) {
      return { success: false, error: 'No reward available' }
    }

    if (availableReward.claimed) {
      return { success: false, error: 'Reward already claimed today' }
    }

    // Update storage
    const today = this.getTodayString()
    const newStreak = availableReward.day
    const totalClaimed = parseInt(this.getStorage(STORAGE_KEYS.TOTAL_CLAIMED) || '0') + 1
    const maxStreak = Math.max(newStreak, parseInt(this.getStorage(STORAGE_KEYS.MAX_STREAK) || '0'))

    this.setStorage(STORAGE_KEYS.LAST_CLAIM, today)
    this.setStorage(STORAGE_KEYS.STREAK, newStreak.toString())
    this.setStorage(STORAGE_KEYS.TOTAL_CLAIMED, totalClaimed.toString())
    this.setStorage(STORAGE_KEYS.MAX_STREAK, maxStreak.toString())

    const claimedReward: DailyReward = {
      ...availableReward,
      claimed: true,
      claimedAt: new Date()
    }

    return { success: true, reward: claimedReward }
  }

  async getStreak(): Promise<RewardStreak> {
    const lastClaim = this.getStorage(STORAGE_KEYS.LAST_CLAIM)
    const currentStreak = parseInt(this.getStorage(STORAGE_KEYS.STREAK) || '0')
    const totalClaimed = parseInt(this.getStorage(STORAGE_KEYS.TOTAL_CLAIMED) || '0')
    const maxStreak = parseInt(this.getStorage(STORAGE_KEYS.MAX_STREAK) || '0')

    // Check if streak is broken (missed yesterday)
    const today = this.getTodayString()
    const yesterday = this.getYesterdayString()
    
    let actualStreak = currentStreak
    if (lastClaim && lastClaim !== today && lastClaim !== yesterday) {
      // Streak is broken
      actualStreak = 0
      this.setStorage(STORAGE_KEYS.STREAK, '0')
    }

    return {
      currentStreak: actualStreak,
      lastClaimDate: lastClaim,
      totalClaimed,
      maxStreak
    }
  }

  async canClaimToday(): Promise<boolean> {
    const reward = await this.checkDailyReward()
    return reward ? !reward.claimed : false
  }

  async getNextRewardAmount(): Promise<number> {
    const reward = await this.checkDailyReward()
    return reward?.amount || this.getRewardAmount(1)
  }

  async resetStreak(): Promise<void> {
    if (!this.isClient()) return
    
    localStorage.removeItem(STORAGE_KEYS.LAST_CLAIM)
    localStorage.removeItem(STORAGE_KEYS.STREAK)
    // Keep total claimed and max streak for stats
  }
}