import { LocalStorageAchievementService } from '../localStorage-service'

describe('Win Achievement Tracking', () => {
  let service: LocalStorageAchievementService

  beforeEach(() => {
    localStorage.clear()
    service = new LocalStorageAchievementService()
  })

  test('should unlock win_1000 achievement when winning >= $1000 in single hand', async () => {
    // Test with exactly $1000
    const updates = { 'win_1000': 1000 }
    const unlockedAchievements = await service.checkMultipleProgress(updates)
    
    expect(unlockedAchievements).toHaveLength(1)
    expect(unlockedAchievements[0].id).toBe('win_1000')
    expect(unlockedAchievements[0].current).toBe(1)
    expect(unlockedAchievements[0].unlocked).toBe(true)
  })

  test('should unlock win_1000 achievement when winning > $1000 in single hand', async () => {
    // Test with more than $1000
    const updates = { 'win_1000': 1500 }
    const unlockedAchievements = await service.checkMultipleProgress(updates)
    
    expect(unlockedAchievements).toHaveLength(1)
    expect(unlockedAchievements[0].id).toBe('win_1000')
    expect(unlockedAchievements[0].current).toBe(1)
    expect(unlockedAchievements[0].unlocked).toBe(true)
  })

  test('should NOT unlock win_1000 achievement when winning < $1000', async () => {
    const updates = { 'win_1000': 500 }
    const unlockedAchievements = await service.checkMultipleProgress(updates)
    
    expect(unlockedAchievements).toHaveLength(0)
    
    const achievement = await service.getAchievement('win_1000')
    expect(achievement?.current).toBe(0)
    expect(achievement?.unlocked).toBe(false)
  })

  test('should track balance_5000 as cumulative maximum', async () => {
    // Track cumulative balance
    await service.checkMultipleProgress({ 'balance_5000': 2000 })
    let achievement = await service.getAchievement('balance_5000')
    expect(achievement?.current).toBe(2000)
    expect(achievement?.unlocked).toBe(false)

    // Update with higher value
    await service.checkMultipleProgress({ 'balance_5000': 3000 })
    achievement = await service.getAchievement('balance_5000')
    expect(achievement?.current).toBe(3000)

    // Update with lower value (should not decrease)
    await service.checkMultipleProgress({ 'balance_5000': 2500 })
    achievement = await service.getAchievement('balance_5000')
    expect(achievement?.current).toBe(3000) // Should remain at max

    // Reach target
    await service.checkMultipleProgress({ 'balance_5000': 5000 })
    achievement = await service.getAchievement('balance_5000')
    expect(achievement?.current).toBe(5000)
    expect(achievement?.unlocked).toBe(true)
  })

  test('should track millionaire achievement based on current balance', async () => {
    const updates = { 'millionaire': 10000 }
    const unlockedAchievements = await service.checkMultipleProgress(updates)
    
    expect(unlockedAchievements).toHaveLength(1)
    expect(unlockedAchievements[0].id).toBe('millionaire')
    expect(unlockedAchievements[0].current).toBe(10000)
    expect(unlockedAchievements[0].unlocked).toBe(true)
  })

  test('should track win streaks correctly', async () => {
    // Test win streak of 3
    let updates = { 'win_streak_3': 3 }
    let unlockedAchievements = await service.checkMultipleProgress(updates)
    
    expect(unlockedAchievements).toHaveLength(1)
    expect(unlockedAchievements[0].id).toBe('win_streak_3')
    expect(unlockedAchievements[0].current).toBe(3)

    // Update with higher streak (should update to exact value)
    updates = { 'win_streak_5': 5 }
    unlockedAchievements = await service.checkMultipleProgress(updates)
    
    expect(unlockedAchievements).toHaveLength(1)
    expect(unlockedAchievements[0].id).toBe('win_streak_5')
    expect(unlockedAchievements[0].current).toBe(5)

    // Reset streak to 2 (should update to exact value, not unlock 3-streak again)
    updates = { 'win_streak_3': 2, 'win_streak_5': 2 }
    unlockedAchievements = await service.checkMultipleProgress(updates)
    
    expect(unlockedAchievements).toHaveLength(0) // No new unlocks
    
    const streak3 = await service.getAchievement('win_streak_3')
    expect(streak3?.current).toBe(2) // Should be updated to current streak
    expect(streak3?.unlocked).toBe(true) // But should remain unlocked
  })
})