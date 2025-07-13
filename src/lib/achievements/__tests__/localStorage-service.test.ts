import { LocalStorageAchievementService } from '../localStorage-service'
import { ACHIEVEMENT_DEFINITIONS } from '../definitions'
import type { GameStats } from '../types'

describe('LocalStorageAchievementService', () => {
  let service: LocalStorageAchievementService

  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    service = new LocalStorageAchievementService()
  })

  describe('Basic Operations', () => {
    test('should initialize with default achievements', async () => {
      const achievements = await service.getAllAchievements()
      
      expect(achievements).toHaveLength(ACHIEVEMENT_DEFINITIONS.length)
      expect(achievements.every(a => a.current === 0)).toBe(true)
      expect(achievements.every(a => a.unlocked === false)).toBe(true)
    })

    test('should get specific achievement by id', async () => {
      const achievement = await service.getAchievement('first_hand')
      
      expect(achievement).not.toBeNull()
      expect(achievement?.id).toBe('first_hand')
      expect(achievement?.title).toBe('Welcome to the Table')
    })

    test('should return null for non-existent achievement', async () => {
      const achievement = await service.getAchievement('non_existent')
      expect(achievement).toBeNull()
    })
  })

  describe('Progress Updates', () => {
    test('should update progress correctly', async () => {
      const result = await service.updateProgress('first_hand', 1)
      
      expect(result).not.toBeNull()
      expect(result?.current).toBe(1)
      expect(result?.unlocked).toBe(true)
      expect(result?.unlockedAt).toBeInstanceOf(Date)
    })

    test('should not exceed target value', async () => {
      await service.updateProgress('first_hand', 5) // target is 1
      const achievement = await service.getAchievement('first_hand')
      
      expect(achievement?.current).toBe(1) // Should cap at target
    })

    test('should not update already unlocked achievements', async () => {
      // Unlock achievement first
      await service.updateProgress('first_hand', 1)
      
      // Try to update again
      const result = await service.updateProgress('first_hand', 1)
      
      expect(result?.current).toBe(1) // Should remain the same
    })

    test('should set progress to specific value', async () => {
      const result = await service.setProgress('hands_10', 5)
      
      expect(result?.current).toBe(5)
      expect(result?.unlocked).toBe(false)
    })

    test('should unlock achievement when reaching target via setProgress', async () => {
      const result = await service.setProgress('hands_10', 10)
      
      expect(result?.current).toBe(10)
      expect(result?.unlocked).toBe(true)
    })
  })

  describe('Multiple Progress Updates', () => {
    test('should handle multiple updates correctly', async () => {
      const updates = {
        'first_hand': 1,
        'hands_10': 10,
        'first_blackjack': 1
      }
      
      const unlockedAchievements = await service.checkMultipleProgress(updates)
      
      expect(unlockedAchievements).toHaveLength(3)
      expect(unlockedAchievements.map(a => a.id)).toEqual(
        expect.arrayContaining(['first_hand', 'hands_10', 'first_blackjack'])
      )
    })

    test('should handle streak achievements correctly', async () => {
      const updates = { 'win_streak_3': 3 }
      
      const unlockedAchievements = await service.checkMultipleProgress(updates)
      
      expect(unlockedAchievements).toHaveLength(1)
      expect(unlockedAchievements[0].id).toBe('win_streak_3')
      expect(unlockedAchievements[0].current).toBe(3)
    })

    test('should handle milestone achievements with max values', async () => {
      // First update
      await service.checkMultipleProgress({ 'balance_5000': 2000 })
      
      // Second update with higher value
      await service.checkMultipleProgress({ 'balance_5000': 3000 })
      
      const achievement = await service.getAchievement('balance_5000')
      expect(achievement?.current).toBe(3000) // Should use max value
    })

    test('should not unlock achievements multiple times', async () => {
      // First unlock
      await service.checkMultipleProgress({ 'first_hand': 1 })
      
      // Try to unlock again
      const unlockedAchievements = await service.checkMultipleProgress({ 'first_hand': 1 })
      
      expect(unlockedAchievements).toHaveLength(0) // Should not unlock again
    })
  })

  describe('Statistics', () => {
    test('should count unlocked achievements correctly', async () => {
      expect(await service.getUnlockedCount()).toBe(0)
      
      await service.updateProgress('first_hand', 1)
      await service.updateProgress('first_blackjack', 1)
      
      expect(await service.getUnlockedCount()).toBe(2)
    })

    test('should calculate total coin rewards correctly', async () => {
      expect(await service.getTotalCoinRewards()).toBe(0)
      
      await service.updateProgress('first_hand', 1) // 50 coins
      await service.updateProgress('first_blackjack', 1) // 100 coins
      
      expect(await service.getTotalCoinRewards()).toBe(150)
    })

    test('should calculate completion percentage correctly', async () => {
      const visibleAchievements = ACHIEVEMENT_DEFINITIONS.filter(a => !a.hidden)
      const totalVisible = visibleAchievements.length
      
      expect(await service.getCompletionPercentage()).toBe(0)
      
      // Unlock 2 achievements
      await service.updateProgress('first_hand', 1)
      await service.updateProgress('first_blackjack', 1)
      
      const expectedPercentage = Math.round((2 / totalVisible) * 100)
      expect(await service.getCompletionPercentage()).toBe(expectedPercentage)
    })
  })

  describe('Reset Functionality', () => {
    test('should reset specific achievement', async () => {
      // Unlock achievement first
      await service.updateProgress('first_hand', 1)
      expect((await service.getAchievement('first_hand'))?.unlocked).toBe(true)
      
      // Reset it
      await service.resetProgress('first_hand')
      
      const achievement = await service.getAchievement('first_hand')
      expect(achievement?.current).toBe(0)
      expect(achievement?.unlocked).toBe(false)
      expect(achievement?.unlockedAt).toBeUndefined()
    })

    test('should reset all achievements', async () => {
      // Unlock multiple achievements
      await service.updateProgress('first_hand', 1)
      await service.updateProgress('first_blackjack', 1)
      
      expect(await service.getUnlockedCount()).toBe(2)
      
      // Reset all
      await service.resetProgress()
      
      expect(await service.getUnlockedCount()).toBe(0)
      const achievements = await service.getAllAchievements()
      expect(achievements.every(a => a.current === 0)).toBe(true)
      expect(achievements.every(a => a.unlocked === false)).toBe(true)
    })
  })

  describe('Game Stats Integration', () => {
    test('should save and load game stats', () => {
      const testStats: GameStats = {
        handsPlayed: 10,
        handsWon: 6,
        handsLost: 4,
        handsPushed: 0,
        blackjacksHit: 2,
        totalWinnings: 500,
        totalLosses: 200,
        biggestWin: 150,
        biggestLoss: 100,
        timesHit: 15,
        timesStood: 8,
        timesDoubled: 2,
        timesSplit: 1,
        currentWinStreak: 3,
        maxWinStreak: 5,
        currentLossStreak: 0,
        maxLossStreak: 2,
        bustedHands: 2,
        dealerBusts: 1,
        perfectTwentyOnes: 1,
        firstPlayDate: new Date('2025-01-01'),
        lastPlayDate: new Date('2025-01-13'),
        totalPlayTime: 120
      }

      service.saveGameStats(testStats)
      const loadedStats = service.getGameStats()

      expect(loadedStats.handsPlayed).toBe(10)
      expect(loadedStats.handsWon).toBe(6)
      expect(loadedStats.totalWinnings).toBe(500)
      expect(loadedStats.firstPlayDate).toEqual(new Date('2025-01-01'))
    })

    test('should return default stats when none saved', () => {
      const stats = service.getGameStats()
      
      expect(stats.handsPlayed).toBe(0)
      expect(stats.handsWon).toBe(0)
      expect(stats.firstPlayDate).toBeInstanceOf(Date)
    })
  })

  describe('Persistence', () => {
    test('should persist achievements across service instances', async () => {
      // Update with first instance
      await service.updateProgress('first_hand', 1)
      
      // Create new instance
      const newService = new LocalStorageAchievementService()
      const achievement = await newService.getAchievement('first_hand')
      
      expect(achievement?.unlocked).toBe(true)
      expect(achievement?.current).toBe(1)
    })

    test('should handle corrupted localStorage gracefully', async () => {
      // Corrupt the stored data
      localStorage.setItem('achievements_progress', 'invalid json')
      
      const newService = new LocalStorageAchievementService()
      const achievements = await newService.getAllAchievements()
      
      // Should fall back to defaults
      expect(achievements).toHaveLength(ACHIEVEMENT_DEFINITIONS.length)
      expect(achievements.every(a => a.current === 0)).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    test('should handle negative progress values', async () => {
      const result = await service.updateProgress('hands_10', -5)
      
      expect(result?.current).toBe(0) // Should not go below 0
    })

    test('should handle achievement tracking logic correctly', async () => {
      // Test win_1000 achievement - should track single hand wins >= 1000
      // The achievement should increment when winAmount >= 1000
      const updates = { 'win_1000': 1500 }
      const unlockedAchievements = await service.checkMultipleProgress(updates)
      
      expect(unlockedAchievements).toHaveLength(1)
      expect(unlockedAchievements[0].id).toBe('win_1000')
      expect(unlockedAchievements[0].current).toBe(1)
    })
  })
})