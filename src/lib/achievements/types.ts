// Achievement system types
export type AchievementType = 
  | 'first_time'      // First time doing something
  | 'milestone'       // Reaching specific numbers
  | 'streak'          // Consecutive actions
  | 'skill'           // Game strategy achievements
  | 'special'         // Rare/special conditions

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Achievement {
  id: string
  title: string
  description: string
  type: AchievementType
  rarity: AchievementRarity
  icon: string
  
  // Progress tracking
  target: number
  current: number
  
  // Rewards
  coinReward: number
  
  // Status
  unlocked: boolean
  unlockedAt?: Date
  
  // Display
  hidden?: boolean // Don't show until close to completion
}

export interface AchievementProgress {
  achievementId: string
  current: number
  lastUpdated: Date
}

export interface AchievementServiceInterface {
  // Core methods
  getAllAchievements(): Promise<Achievement[]>
  getAchievement(id: string): Promise<Achievement | null>
  updateProgress(achievementId: string, increment: number): Promise<Achievement | null>
  setProgress(achievementId: string, value: number): Promise<Achievement | null>
  
  // Bulk operations
  checkMultipleProgress(updates: Record<string, number>): Promise<Achievement[]>
  
  // Statistics
  getUnlockedCount(): Promise<number>
  getTotalCoinRewards(): Promise<number>
  getCompletionPercentage(): Promise<number>
  
  // Reset/clear
  resetProgress(achievementId?: string): Promise<void>
}

// Game statistics that drive achievements
export interface GameStats {
  // Basic stats
  handsPlayed: number
  handsWon: number
  handsLost: number
  handsPushed: number
  blackjacksHit: number
  
  // Money stats
  totalWinnings: number
  totalLosses: number
  biggestWin: number
  biggestLoss: number
  
  // Action stats
  timesHit: number
  timesStood: number
  timesDoubled: number
  timesSplit: number
  
  // Streak stats
  currentWinStreak: number
  maxWinStreak: number
  currentLossStreak: number
  maxLossStreak: number
  
  // Special events
  bustedHands: number
  dealerBusts: number
  perfectTwentyOnes: number // 21 with 3+ cards
  
  // Time stats
  firstPlayDate: Date
  lastPlayDate: Date
  totalPlayTime: number // in minutes
}