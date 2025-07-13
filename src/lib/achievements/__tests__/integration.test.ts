import { LocalStorageAchievementService } from '../localStorage-service'

describe('Achievement Integration Tests', () => {
  let service: LocalStorageAchievementService

  beforeEach(() => {
    localStorage.clear()
    service = new LocalStorageAchievementService()
  })

  test('should track game progression correctly', async () => {
    // Simulate a complete game session
    
    // First hand played
    await service.checkMultipleProgress({ 'first_hand': 1 })
    const firstHand = await service.getAchievement('first_hand')
    expect(firstHand?.unlocked).toBe(true)

    // Multiple hands for milestone
    await service.checkMultipleProgress({ 
      'hands_10': 1, 
      'hands_50': 1, 
      'hands_100': 1 
    })
    
    for (let i = 0; i < 9; i++) {
      await service.checkMultipleProgress({ 
        'hands_10': 1, 
        'hands_50': 1, 
        'hands_100': 1 
      })
    }
    
    const hands10 = await service.getAchievement('hands_10')
    expect(hands10?.unlocked).toBe(true)
    expect(hands10?.current).toBe(10)

    // Win streak
    await service.checkMultipleProgress({ 'win_streak_3': 3 })
    const winStreak = await service.getAchievement('win_streak_3')
    expect(winStreak?.unlocked).toBe(true)

    // Big win
    await service.checkMultipleProgress({ 'win_1000': 1500 })
    const bigWin = await service.getAchievement('win_1000')
    expect(bigWin?.unlocked).toBe(true)

    // Balance tracking (cumulative)
    await service.checkMultipleProgress({ 'balance_5000': 2000 })
    await service.checkMultipleProgress({ 'balance_5000': 3000 })
    await service.checkMultipleProgress({ 'balance_5000': 5000 })
    
    const balanceAchievement = await service.getAchievement('balance_5000')
    expect(balanceAchievement?.unlocked).toBe(true)
    expect(balanceAchievement?.current).toBe(5000)

    // Check statistics
    expect(await service.getUnlockedCount()).toBeGreaterThan(0)
    expect(await service.getTotalCoinRewards()).toBeGreaterThan(0)
    expect(await service.getCompletionPercentage()).toBeGreaterThan(0)
  })

  test('should handle game restart correctly', async () => {
    // Unlock some achievements
    await service.checkMultipleProgress({ 
      'first_hand': 1,
      'first_blackjack': 1,
      'hands_10': 10
    })

    expect(await service.getUnlockedCount()).toBe(3)

    // Reset all progress
    await service.resetProgress()

    // Check everything is reset
    expect(await service.getUnlockedCount()).toBe(0)
    
    const achievements = await service.getAllAchievements()
    expect(achievements.every(a => !a.unlocked)).toBe(true)
    expect(achievements.every(a => a.current === 0)).toBe(true)
  })

  test('should handle edge cases in achievement tracking', async () => {
    // Test blackjack achievements
    await service.checkMultipleProgress({ 'first_blackjack': 1 })
    await service.checkMultipleProgress({ 'blackjacks_5': 1 })
    
    for (let i = 0; i < 4; i++) {
      await service.checkMultipleProgress({ 'blackjacks_5': 1 })
    }
    
    const blackjacks = await service.getAchievement('blackjacks_5')
    expect(blackjacks?.unlocked).toBe(true)

    // Test comeback achievement
    await service.checkMultipleProgress({ 'comeback_king': 1 })
    const comeback = await service.getAchievement('comeback_king')
    expect(comeback?.unlocked).toBe(true)

    // Test millionaire achievement (balance-based)
    await service.checkMultipleProgress({ 'millionaire': 10000 })
    const millionaire = await service.getAchievement('millionaire')
    expect(millionaire?.unlocked).toBe(true)
  })

  test('should not unlock achievements multiple times', async () => {
    // First unlock
    let unlockedAchievements = await service.checkMultipleProgress({ 'first_hand': 1 })
    expect(unlockedAchievements).toHaveLength(1)

    // Try to unlock again - should return empty array
    unlockedAchievements = await service.checkMultipleProgress({ 'first_hand': 1 })
    expect(unlockedAchievements).toHaveLength(0)

    // Total unlocked count should still be 1
    expect(await service.getUnlockedCount()).toBe(1)
  })

  test('should handle partial achievement progress correctly', async () => {
    // Progress toward 10 hands
    await service.checkMultipleProgress({ 'hands_10': 1 })
    await service.checkMultipleProgress({ 'hands_10': 1 })
    await service.checkMultipleProgress({ 'hands_10': 1 })

    let hands10 = await service.getAchievement('hands_10')
    expect(hands10?.current).toBe(3)
    expect(hands10?.unlocked).toBe(false)

    // Complete the achievement
    for (let i = 0; i < 7; i++) {
      await service.checkMultipleProgress({ 'hands_10': 1 })
    }

    hands10 = await service.getAchievement('hands_10')
    expect(hands10?.current).toBe(10)
    expect(hands10?.unlocked).toBe(true)
  })
})