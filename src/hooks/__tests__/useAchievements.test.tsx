import { renderHook, act } from '@testing-library/react'
import { useAchievements } from '../useAchievements'
import { getAchievementsService } from '../../lib/achievements'

// Mock the achievements service
jest.mock('../../lib/achievements', () => ({
  getAchievementsService: jest.fn()
}))

// Mock the sounds
jest.mock('../../lib/sounds', () => ({
  playAchievement: jest.fn()
}))

const mockAchievementsService = {
  getAllAchievements: jest.fn(),
  updateProgress: jest.fn(),
  checkMultipleProgress: jest.fn(),
  getUnlockedCount: jest.fn(),
  getTotalCoinRewards: jest.fn(),
  getCompletionPercentage: jest.fn(),
  getGameStats: jest.fn(),
  saveGameStats: jest.fn(),
  resetProgress: jest.fn()
}

const mockAchievements = [
  {
    id: 'first_hand',
    title: 'Welcome to the Table',
    description: 'Play your first hand',
    type: 'first_time' as const,
    rarity: 'common' as const,
    icon: '🎯',
    target: 1,
    current: 0,
    coinReward: 50,
    unlocked: false
  },
  {
    id: 'hands_10',
    title: 'Getting Started',
    description: 'Play 10 hands',
    type: 'milestone' as const,
    rarity: 'common' as const,
    icon: '🔢',
    target: 10,
    current: 5,
    coinReward: 100,
    unlocked: false
  }
]

describe('useAchievements', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getAchievementsService as jest.Mock).mockReturnValue(mockAchievementsService)
    mockAchievementsService.getAllAchievements.mockResolvedValue(mockAchievements)
    mockAchievementsService.getUnlockedCount.mockResolvedValue(0)
    mockAchievementsService.getTotalCoinRewards.mockResolvedValue(0)
    mockAchievementsService.getCompletionPercentage.mockResolvedValue(0)
    mockAchievementsService.getGameStats.mockReturnValue({
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
    })
  })

  test('should load achievements on mount', async () => {
    const { result } = renderHook(() => useAchievements())

    expect(result.current.isLoading).toBe(true)

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(mockAchievementsService.getAllAchievements).toHaveBeenCalled()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.achievements).toEqual(mockAchievements)
  })

  test('should categorize achievements correctly', async () => {
    const { result } = renderHook(() => useAchievements())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.unlockedAchievements).toHaveLength(0)
    expect(result.current.lockedAchievements).toHaveLength(2)
    expect(result.current.hiddenAchievements).toHaveLength(0)
  })

  test('should update progress correctly', async () => {
    const unlockedAchievement = {
      ...mockAchievements[0],
      current: 1,
      unlocked: true,
      unlockedAt: new Date()
    }

    mockAchievementsService.updateProgress.mockResolvedValue(unlockedAchievement)

    const { result } = renderHook(() => useAchievements())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await act(async () => {
      await result.current.updateProgress('first_hand', 1)
    })

    expect(mockAchievementsService.updateProgress).toHaveBeenCalledWith('first_hand', 1)
  })

  test('should handle newly unlocked achievements', async () => {
    const unlockedAchievement = {
      ...mockAchievements[0],
      current: 1,
      unlocked: true,
      unlockedAt: new Date()
    }

    mockAchievementsService.updateProgress.mockResolvedValue(unlockedAchievement)

    const { result } = renderHook(() => useAchievements())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await act(async () => {
      await result.current.updateProgress('first_hand', 1)
    })

    expect(result.current.recentUnlocks).toHaveLength(1)
    expect(result.current.recentUnlocks[0].id).toBe('first_hand')
    expect(result.current.hasRecentUnlocks).toBe(true)
  })

  test('should check multiple progress updates', async () => {
    const newlyUnlocked = [mockAchievements[0]]
    mockAchievementsService.checkMultipleProgress.mockResolvedValue(newlyUnlocked)

    const { result } = renderHook(() => useAchievements())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const updates = { 'first_hand': 1, 'hands_10': 2 }

    await act(async () => {
      await result.current.checkMultipleProgress(updates)
    })

    expect(mockAchievementsService.checkMultipleProgress).toHaveBeenCalledWith(updates)
    expect(result.current.recentUnlocks).toHaveLength(1)
  })

  test('should clear recent unlocks', async () => {
    // First, add a recent unlock
    const unlockedAchievement = {
      ...mockAchievements[0],
      current: 1,
      unlocked: true,
      unlockedAt: new Date()
    }

    mockAchievementsService.updateProgress.mockResolvedValue(unlockedAchievement)

    const { result } = renderHook(() => useAchievements())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await act(async () => {
      await result.current.updateProgress('first_hand', 1)
    })

    expect(result.current.recentUnlocks).toHaveLength(1)

    // Clear the specific unlock
    act(() => {
      result.current.clearRecentUnlock('first_hand')
    })

    expect(result.current.recentUnlocks).toHaveLength(0)
  })

  test('should clear all recent unlocks', async () => {
    const { result } = renderHook(() => useAchievements())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Simulate multiple recent unlocks
    act(() => {
      result.current.clearAllRecentUnlocks()
    })

    expect(result.current.recentUnlocks).toHaveLength(0)
  })

  test('should get statistics', async () => {
    const { result } = renderHook(() => useAchievements())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await act(async () => {
      await result.current.getStats()
    })

    expect(mockAchievementsService.getUnlockedCount).toHaveBeenCalled()
    expect(mockAchievementsService.getTotalCoinRewards).toHaveBeenCalled()
    expect(mockAchievementsService.getCompletionPercentage).toHaveBeenCalled()
  })

  test('should handle errors gracefully', async () => {
    mockAchievementsService.getAllAchievements.mockRejectedValue(new Error('Test error'))

    const { result } = renderHook(() => useAchievements())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeTruthy()
    expect(result.current.achievements).toEqual([])
  })

  test('should refresh achievements', async () => {
    const { result } = renderHook(() => useAchievements())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    mockAchievementsService.getAllAchievements.mockClear()

    await act(async () => {
      await result.current.refresh()
    })

    expect(mockAchievementsService.getAllAchievements).toHaveBeenCalled()
  })

  test('should handle game stats operations', async () => {
    const { result } = renderHook(() => useAchievements())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const mockStats = result.current.getGameStats()
    expect(mockAchievementsService.getGameStats).toHaveBeenCalled()

    act(() => {
      result.current.saveGameStats(mockStats)
    })

    expect(mockAchievementsService.saveGameStats).toHaveBeenCalledWith(mockStats)
  })
})