'use client'

import { useState } from 'react'
import { useAchievements } from '@/hooks/useAchievements'
import { AchievementsList } from './AchievementsList'

export function AchievementsButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { unlockedAchievements, achievements, hasRecentUnlocks } = useAchievements()
  
  const totalVisible = achievements.filter(a => !a.hidden).length
  const unlockedCount = unlockedAchievements.length

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`
          relative px-4 py-2 rounded-lg transition-all duration-200
          bg-emerald-600 hover:bg-emerald-500 text-white
          border border-emerald-500 shadow-lg
          ${hasRecentUnlocks ? 'animate-pulse' : ''}
        `}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <span className="font-semibold text-sm">
            {unlockedCount}/{totalVisible}
          </span>
        </div>
        
        {/* Notification dot for recent unlocks */}
        {hasRecentUnlocks && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
        )}
      </button>

      <AchievementsList 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}