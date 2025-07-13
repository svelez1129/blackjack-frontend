import type { Achievement, AchievementServiceInterface, GameStats } from './types'
import { ACHIEVEMENT_DEFINITIONS } from './definitions'

const STORAGE_KEYS = {
  ACHIEVEMENTS: 'achievements_progress',
  GAME_STATS: 'game_statistics'
}

export class LocalStorageAchievementService implements AchievementServiceInterface {
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

  private loadAchievements(): Achievement[] {
    const stored = this.getStorage(STORAGE_KEYS.ACHIEVEMENTS)
    if (!stored) {
      // Return fresh copy of definitions
      return ACHIEVEMENT_DEFINITIONS.map(def => ({ ...def }))
    }

    try {
      const savedProgress = JSON.parse(stored)
      
      // Merge saved progress with current definitions
      return ACHIEVEMENT_DEFINITIONS.map(def => {
        const saved = savedProgress[def.id]
        if (saved) {
          return {
            ...def,
            current: saved.current || 0,
            unlocked: saved.unlocked || false,
            unlockedAt: saved.unlockedAt ? new Date(saved.unlockedAt) : undefined
          }
        }
        return { ...def }
      })
    } catch (error) {
      console.error('Failed to load achievements:', error)
      return ACHIEVEMENT_DEFINITIONS.map(def => ({ ...def }))
    }
  }

  private saveAchievements(achievements: Achievement[]): void {
    const progressData: Record<string, unknown> = {}
    
    achievements.forEach(achievement => {
      progressData[achievement.id] = {
        current: achievement.current,
        unlocked: achievement.unlocked,
        unlockedAt: achievement.unlockedAt?.toISOString()
      }
    })

    this.setStorage(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(progressData))
  }

  private loadGameStats(): GameStats {
    const stored = this.getStorage(STORAGE_KEYS.GAME_STATS)
    const defaultStats: GameStats = {
      handsPlayed: 0,
      handsWon: 0,
      handsLost: 0,
      handsPushed: 0,
      blackjacksHit: 0,
      totalWinnings: 0,
      totalLosses: 0,
      biggestWin: 0,
      biggestLoss: 0,
      timesHit: 0,
      timesStood: 0,
      timesDoubled: 0,
      timesSplit: 0,
      currentWinStreak: 0,
      maxWinStreak: 0,
      currentLossStreak: 0,
      maxLossStreak: 0,
      bustedHands: 0,
      dealerBusts: 0,
      perfectTwentyOnes: 0,
      firstPlayDate: new Date(),
      lastPlayDate: new Date(),
      totalPlayTime: 0
    }

    if (!stored) return defaultStats

    try {
      const parsed = JSON.parse(stored)
      return {
        ...defaultStats,
        ...parsed,
        firstPlayDate: new Date(parsed.firstPlayDate || Date.now()),
        lastPlayDate: new Date(parsed.lastPlayDate || Date.now())
      }
    } catch (error) {
      console.error('Failed to load game stats:', error)
      return defaultStats
    }
  }

  saveGameStats(stats: GameStats): void {
    this.setStorage(STORAGE_KEYS.GAME_STATS, JSON.stringify({
      ...stats,
      firstPlayDate: stats.firstPlayDate.toISOString(),
      lastPlayDate: stats.lastPlayDate.toISOString()
    }))
  }

  getGameStats(): GameStats {
    return this.loadGameStats()
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return this.loadAchievements()
  }

  async getAchievement(id: string): Promise<Achievement | null> {
    const achievements = this.loadAchievements()
    return achievements.find(a => a.id === id) || null
  }

  async updateProgress(achievementId: string, increment: number): Promise<Achievement | null> {
    const achievements = this.loadAchievements()
    const achievement = achievements.find(a => a.id === achievementId)
    
    if (!achievement || achievement.unlocked) {
      return achievement || null
    }

    // Update progress (ensure it doesn't go below 0)
    achievement.current = Math.min(Math.max(achievement.current + increment, 0), achievement.target)
    
    // Check if unlocked
    if (achievement.current >= achievement.target && !achievement.unlocked) {
      achievement.unlocked = true
      achievement.unlockedAt = new Date()
    }

    this.saveAchievements(achievements)
    return achievement
  }

  async setProgress(achievementId: string, value: number): Promise<Achievement | null> {
    const achievements = this.loadAchievements()
    const achievement = achievements.find(a => a.id === achievementId)
    
    if (!achievement || achievement.unlocked) {
      return achievement || null
    }

    // Set progress (for things like max values)
    const oldCurrent = achievement.current
    achievement.current = Math.min(Math.max(value, oldCurrent), achievement.target)
    
    // Check if unlocked
    if (achievement.current >= achievement.target && !achievement.unlocked) {
      achievement.unlocked = true
      achievement.unlockedAt = new Date()
    }

    this.saveAchievements(achievements)
    return achievement
  }

  async checkMultipleProgress(updates: Record<string, number>): Promise<Achievement[]> {
    console.log('🔧 localStorage checkMultipleProgress: Starting with updates:', updates)
    const achievements = this.loadAchievements()
    const unlockedAchievements: Achievement[] = []

    Object.entries(updates).forEach(([achievementId, value]) => {
      const achievement = achievements.find(a => a.id === achievementId)
      
      if (!achievement) {
        console.log('🔧 localStorage: Achievement not found:', achievementId)
        return
      }

      const wasUnlocked = achievement.unlocked
      const oldCurrent = achievement.current
      console.log('🔧 localStorage:', achievementId, 'before update - current:', oldCurrent, 'unlocked:', wasUnlocked)
      
      // Skip updates for already unlocked non-streak achievements
      if (achievement.unlocked && achievement.type !== 'streak') return
      
      // Different update logic based on achievement type
      if (achievement.type === 'milestone' && (achievementId.includes('balance_') || achievementId.includes('millionaire'))) {
        // For balance achievements, use setProgress (max value)
        achievement.current = Math.max(achievement.current, value)
      } else if (achievement.type === 'streak') {
        // For streaks, use exact value and reset if value is 0 or decreases below target
        achievement.current = Math.max(0, value)
        
        // Important: Don't reset unlocked status - once unlocked, stay unlocked
        // But do update the current value to show current streak progress
      } else if (achievementId === 'win_1000') {
        // For single hand win achievements, increment only if threshold met
        if (value >= 1000) {
          achievement.current = Math.min(achievement.current + 1, achievement.target)
        }
        // If value < 1000, don't update progress at all
      } else {
        // For counters, increment (ensure no negative values)
        achievement.current = Math.min(Math.max(achievement.current + value, 0), achievement.target)
      }
      
      // Check if newly unlocked
      if (achievement.current >= achievement.target && !wasUnlocked) {
        achievement.unlocked = true
        achievement.unlockedAt = new Date()
        unlockedAchievements.push(achievement)
        console.log('🔧 localStorage: NEWLY UNLOCKED:', achievementId)
      }
      
      console.log('🔧 localStorage:', achievementId, 'after update - current:', achievement.current, 'unlocked:', achievement.unlocked)
    })

    console.log('🔧 localStorage: Saving achievements, newly unlocked count:', unlockedAchievements.length)
    this.saveAchievements(achievements)
    return unlockedAchievements
  }

  async getUnlockedCount(): Promise<number> {
    const achievements = this.loadAchievements()
    return achievements.filter(a => a.unlocked).length
  }

  async getTotalCoinRewards(): Promise<number> {
    const achievements = this.loadAchievements()
    return achievements
      .filter(a => a.unlocked)
      .reduce((total, a) => total + a.coinReward, 0)
  }

  async getCompletionPercentage(): Promise<number> {
    const achievements = this.loadAchievements()
    const totalAchievements = achievements.filter(a => !a.hidden).length
    const unlockedAchievements = achievements.filter(a => a.unlocked && !a.hidden).length
    
    if (totalAchievements === 0) return 0
    return Math.round((unlockedAchievements / totalAchievements) * 100)
  }

  async resetProgress(achievementId?: string): Promise<void> {
    if (achievementId) {
      // Reset specific achievement
      const achievements = this.loadAchievements()
      const achievement = achievements.find(a => a.id === achievementId)
      if (achievement) {
        achievement.current = 0
        achievement.unlocked = false
        achievement.unlockedAt = undefined
        this.saveAchievements(achievements)
      }
    } else {
      // Reset all achievements AND game stats
      if (this.isClient()) {
        localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS)
        localStorage.removeItem(STORAGE_KEYS.GAME_STATS)
      }
    }
  }
}