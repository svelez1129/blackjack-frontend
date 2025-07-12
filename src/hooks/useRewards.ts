'use client'

import { useState, useEffect, useCallback } from 'react'
import { getRewardsService, type DailyReward, type RewardStreak } from '@/lib/rewards'

export function useRewards() {
  const [dailyReward, setDailyReward] = useState<DailyReward | null>(null)
  const [streak, setStreak] = useState<RewardStreak | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const rewardsService = getRewardsService()

  // Load initial data
  const loadRewardsData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [rewardData, streakData] = await Promise.all([
        rewardsService.checkDailyReward(),
        rewardsService.getStreak()
      ])

      setDailyReward(rewardData)
      setStreak(streakData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rewards data')
    } finally {
      setIsLoading(false)
    }
  }, [rewardsService])

  // Claim daily reward
  const claimReward = useCallback(async () => {
    try {
      setError(null)
      const result = await rewardsService.claimDailyReward()
      
      if (result.success && result.reward) {
        setDailyReward(result.reward)
        // Refresh streak data
        const newStreak = await rewardsService.getStreak()
        setStreak(newStreak)
        return { success: true, reward: result.reward }
      } else {
        setError(result.error || 'Failed to claim reward')
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to claim reward'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    }
  }, [rewardsService])

  // Reset streak (for testing or admin purposes)
  const resetStreak = useCallback(async () => {
    try {
      await rewardsService.resetStreak()
      await loadRewardsData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset streak')
    }
  }, [rewardsService, loadRewardsData])

  // Load data on mount
  useEffect(() => {
    loadRewardsData()
  }, [loadRewardsData])

  // Derived state
  const canClaim = dailyReward && !dailyReward.claimed
  const nextRewardAmount = dailyReward?.amount || 0
  const currentStreak = streak?.currentStreak || 0

  return {
    // State
    dailyReward,
    streak,
    isLoading,
    error,
    
    // Derived state
    canClaim,
    nextRewardAmount,
    currentStreak,
    
    // Actions
    claimReward,
    resetStreak,
    refresh: loadRewardsData
  }
}