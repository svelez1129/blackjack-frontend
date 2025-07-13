'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getAchievementsService, type Achievement, type GameStats } from '@/lib/achievements'
import { playAchievement } from '@/lib/sounds'

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recentUnlocks, setRecentUnlocks] = useState<Achievement[]>([])
  const [updateCounter, setUpdateCounter] = useState(0)

  const achievementsService = getAchievementsService()

  const loadAchievements = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const allAchievements = await achievementsService.getAllAchievements()
      // Create a new array to ensure React detects the change
      setAchievements([...allAchievements])
      setUpdateCounter(prev => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load achievements')
    } finally {
      setIsLoading(false)
    }
  }, [achievementsService])

  const updateProgress = useCallback(async (achievementId: string, increment: number) => {
    try {
      const updatedAchievement = await achievementsService.updateProgress(achievementId, increment)
      if (updatedAchievement) {
        setAchievements(prev => 
          prev.map(a => a.id === achievementId ? updatedAchievement : a)
        )
        
        // If newly unlocked, add to recent unlocks
        if (updatedAchievement.unlocked && updatedAchievement.current >= updatedAchievement.target) {
          setRecentUnlocks(prev => [updatedAchievement, ...prev])
          // Play achievement unlock sound
          playAchievement()
        }
      }
      return updatedAchievement
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress')
      return null
    }
  }, [achievementsService])

  const checkMultipleProgress = useCallback(async (updates: Record<string, number>) => {
    try {
      const newlyUnlocked = await achievementsService.checkMultipleProgress(updates)
      
      // Wait a brief moment for localStorage to be written, then read
      await new Promise(resolve => setTimeout(resolve, 10))
      
      // Get the latest achievements state
      const latestAchievements = await achievementsService.getAllAchievements()
      // Create a new array to ensure React detects the change
      setAchievements([...latestAchievements])
      
      // Force a re-render by updating counter
      setUpdateCounter(prev => prev + 1)
      
      if (newlyUnlocked.length > 0) {
        // Force multiple state updates to ensure re-render
        setTimeout(() => setUpdateCounter(prev => prev + 1), 0)
        setTimeout(() => setUpdateCounter(prev => prev + 1), 10)
        setTimeout(() => setUpdateCounter(prev => prev + 1), 100)
      }
      
      // Add newly unlocked to recent unlocks
      if (newlyUnlocked.length > 0) {
        setRecentUnlocks(prev => [...newlyUnlocked, ...prev])
        // Play achievement unlock sound for each newly unlocked achievement
        newlyUnlocked.forEach(() => playAchievement())
        
        // Force another state update to ensure UI refresh
        setTimeout(() => {
          setAchievements(prev => [...prev])
          setUpdateCounter(prev => prev + 1)
        }, 50)
      }
      
      return newlyUnlocked
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check progress')
      return []
    }
  }, [achievementsService])

  const clearRecentUnlock = useCallback((achievementId: string) => {
    setRecentUnlocks(prev => prev.filter(a => a.id !== achievementId))
  }, [])

  const clearAllRecentUnlocks = useCallback(() => {
    setRecentUnlocks([])
  }, [])

  const getStats = useCallback(async () => {
    try {
      const [unlockedCount, totalRewards, completionPercentage] = await Promise.all([
        achievementsService.getUnlockedCount(),
        achievementsService.getTotalCoinRewards(),
        achievementsService.getCompletionPercentage()
      ])
      
      return {
        unlockedCount,
        totalRewards,
        completionPercentage,
        totalAchievements: achievements.filter(a => !a.hidden).length
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get stats')
      return {
        unlockedCount: 0,
        totalRewards: 0,
        completionPercentage: 0,
        totalAchievements: 0
      }
    }
  }, [achievementsService, achievements])

  const getGameStats = useCallback((): GameStats => {
    const service = achievementsService as unknown as { getGameStats?: () => GameStats }
    return service.getGameStats ? service.getGameStats() : {
      handsPlayed: 0, handsWon: 0, handsLost: 0, handsPushed: 0, blackjacksHit: 0,
      totalWinnings: 0, totalLosses: 0, biggestWin: 0, biggestLoss: 0,
      timesHit: 0, timesStood: 0, timesDoubled: 0, timesSplit: 0,
      currentWinStreak: 0, maxWinStreak: 0, currentLossStreak: 0, maxLossStreak: 0,
      bustedHands: 0, dealerBusts: 0, perfectTwentyOnes: 0,
      firstPlayDate: new Date(), lastPlayDate: new Date(), totalPlayTime: 0
    }
  }, [achievementsService])

  const saveGameStats = useCallback((stats: GameStats) => {
    const service = achievementsService as unknown as { saveGameStats?: (stats: GameStats) => void }
    if (service.saveGameStats) {
      service.saveGameStats(stats)
    }
  }, [achievementsService])

  // Load achievements on mount
  useEffect(() => {
    loadAchievements()
  }, [loadAchievements])

  // Derived state with useMemo to ensure proper re-renders
  const unlockedAchievements = useMemo(() => {
    const unlocked = achievements.filter(a => a.unlocked)
    // Create a new array to ensure reference changes
    return [...unlocked]
  }, [achievements, updateCounter])
  
  const lockedAchievements = useMemo(() => 
    achievements.filter(a => !a.unlocked && !a.hidden), 
    [achievements, updateCounter]
  )
  
  const hiddenAchievements = useMemo(() => 
    achievements.filter(a => !a.unlocked && a.hidden), 
    [achievements, updateCounter]
  )
  
  const hasRecentUnlocks = recentUnlocks.length > 0

  return {
    // State
    achievements,
    unlockedAchievements,
    lockedAchievements,
    hiddenAchievements,
    isLoading,
    error,
    recentUnlocks,
    hasRecentUnlocks,
    updateCounter,
    
    // Actions
    updateProgress,
    checkMultipleProgress,
    clearRecentUnlock,
    clearAllRecentUnlocks,
    refresh: loadAchievements,
    getStats,
    getGameStats,
    saveGameStats
  }
}