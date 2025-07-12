'use client'

import { useState } from 'react'
import { useRewards } from '@/hooks/useRewards'
import { Button } from '@/components/ui/Button'

interface DailyRewardsProps {
  onRewardClaimed?: (amount: number) => void
}

export function DailyRewards({ onRewardClaimed }: DailyRewardsProps) {
  const { dailyReward, streak, claimReward, isLoading } = useRewards()
  const [isVisible, setIsVisible] = useState(true)
  const [isClaiming, setIsClaiming] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  if (!isVisible || isLoading || !dailyReward) {
    return null
  }

  const handleClaim = async () => {
    setIsClaiming(true)
    const result = await claimReward()
    
    if (result.success && result.reward) {
      setShowSuccess(true)
      onRewardClaimed?.(result.reward.amount)
      
      // Hide success message after 3 seconds, then hide component
      setTimeout(() => {
        setShowSuccess(false)
        setTimeout(() => setIsVisible(false), 500)
      }, 3000)
    }
    
    setIsClaiming(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  // Success state
  if (showSuccess && dailyReward.claimed) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-emerald-500">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-2">Reward Claimed!</h2>
          <div className="text-5xl font-bold text-yellow-400 mb-4">
            +${dailyReward.amount}
          </div>
          <p className="text-emerald-100 mb-4">
            Day {dailyReward.day} reward added to your balance!
          </p>
          {streak && streak.currentStreak > 1 && (
            <p className="text-sm text-emerald-200">
              🔥 {streak.currentStreak} day streak!
            </p>
          )}
        </div>
      </div>
    )
  }

  // Already claimed today
  if (dailyReward.claimed) {
    return (
      <div className="fixed top-4 right-4 bg-emerald-800 text-white p-4 rounded-lg shadow-lg z-40 max-w-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold">Daily reward claimed!</p>
              <p className="text-sm text-emerald-200">Come back tomorrow for more</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-emerald-300 hover:text-white ml-2"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  // Available to claim
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-emerald-500">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Daily Reward</h2>
          <button
            onClick={handleDismiss}
            className="text-emerald-300 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Reward Amount */}
        <div className="mb-6">
          <div className="text-6xl mb-2">💰</div>
          <div className="text-4xl font-bold text-yellow-400 mb-2">
            ${dailyReward.amount}
          </div>
          <p className="text-emerald-100">
            Day {dailyReward.day} Bonus
          </p>
        </div>

        {/* Streak Info */}
        {streak && (
          <div className="mb-6 p-4 bg-emerald-600/50 rounded-lg">
            <div className="flex items-center justify-center gap-4 text-white">
              <div className="text-center">
                <div className="text-xl font-bold">{streak.currentStreak}</div>
                <div className="text-xs text-emerald-200">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{streak.maxStreak}</div>
                <div className="text-xs text-emerald-200">Best Streak</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{streak.totalClaimed}</div>
                <div className="text-xs text-emerald-200">Total Claimed</div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="space-y-3">
          <Button
            onClick={handleClaim}
            disabled={isClaiming}
            variant="secondary"
            className="w-full text-lg py-4"
          >
            {isClaiming ? 'Claiming...' : 'Claim Reward'}
          </Button>
          
          <p className="text-sm text-emerald-200">
            Come back tomorrow for an even bigger reward!
          </p>
        </div>

        {/* Next reward preview */}
        <div className="mt-4 p-3 bg-emerald-900/50 rounded-lg">
          <p className="text-xs text-emerald-300">
            Tomorrow: ${getNextDayReward(dailyReward.day + 1)}
          </p>
        </div>
      </div>
    </div>
  )
}

// Helper function to calculate next day reward
function getNextDayReward(day: number): number {
  const REWARD_SCHEDULE = [100, 150, 200, 300, 400, 500, 1000]
  const dayIndex = ((day - 1) % 7)
  const baseReward = REWARD_SCHEDULE[dayIndex]
  const weekBonus = Math.floor((day - 1) / 7) * 50
  return baseReward + weekBonus
}