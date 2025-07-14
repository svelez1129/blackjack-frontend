'use client'

import { useState } from 'react'
import { useAchievements } from '@/hooks/useAchievements'
import { ACHIEVEMENT_CATEGORIES } from '@/lib/achievements'
import type { Achievement } from '@/lib/achievements'
import { Button } from '@/components/ui/Button'

interface AchievementsListProps {
  isOpen: boolean
  onClose: () => void
}

export function AchievementsList({ isOpen, onClose }: AchievementsListProps) {
  const { 
    achievements, 
    isLoading
  } = useAchievements()
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Calculate stats directly from achievements (reactive)
  const unlockedAchievements = achievements.filter(a => a.unlocked && !a.hidden)
  const visibleAchievements = achievements.filter(a => !a.hidden)
  const totalRewards = unlockedAchievements.reduce((total, a) => total + a.coinReward, 0)
  const completionPercentage = visibleAchievements.length > 0 
    ? Math.round((unlockedAchievements.length / visibleAchievements.length) * 100) 
    : 0
  
  const stats = {
    unlockedCount: unlockedAchievements.length,
    totalRewards,
    completionPercentage,
    totalAchievements: visibleAchievements.length
  }

  // Debug logging for achievements list
  const hands10 = achievements.find(a => a.id === 'hands_10')
  if (isOpen && hands10) {
    console.log('📊 AchievementsList render: hands_10 current/target:', hands10.current, '/', hands10.target)
  }

  if (!isOpen) return null

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements.filter(a => !a.hidden)
    : achievements.filter(a => 
        ACHIEVEMENT_CATEGORIES[selectedCategory as keyof typeof ACHIEVEMENT_CATEGORIES]?.includes(a.id)
      )

  const categories = ['all', ...Object.keys(ACHIEVEMENT_CATEGORIES)]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-xl md:rounded-2xl max-w-4xl w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden border border-emerald-600">
        {/* Header */}
        <div className="p-3 md:p-6 border-b border-emerald-600">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-2">
              <h2 className="text-xl md:text-3xl font-bold text-white mb-2">Achievements</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm md:text-base text-emerald-200">
                <span>{stats.unlockedCount}/{stats.totalAchievements} Unlocked</span>
                <span>{stats.completionPercentage}% Complete</span>
                <span>💰 {stats.totalRewards} Coins</span>
              </div>
            </div>
            <Button onClick={onClose} variant="secondary" className="px-3 md:px-4 py-2 flex-shrink-0">
              ✕
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-emerald-700 rounded-full h-3">
              <div 
                className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="p-2 md:p-4 border-b border-emerald-600 overflow-x-auto">
          <div className="flex gap-1 md:gap-2 min-w-max">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex-shrink-0
                  ${selectedCategory === category 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-emerald-700/50 text-emerald-200 hover:bg-emerald-600/50'
                  }
                `}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements List */}
        <div className="p-3 md:p-6 overflow-y-auto max-h-[60vh] md:max-h-[50vh]">
          {isLoading ? (
            <div className="text-center text-emerald-200">Loading achievements...</div>
          ) : (
            <div className="grid gap-3 md:gap-4">
              {filteredAchievements.map(achievement => (
                <AchievementCard 
                  key={`${achievement.id}-${achievement.current}-${achievement.unlocked}`} 
                  achievement={achievement} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const progress = achievement.target > 0 ? (achievement.current / achievement.target) * 100 : 0
  const isUnlocked = achievement.unlocked
  
  // Debug logging for hands_10 achievement card
  if (achievement.id === 'hands_10') {
    console.log('💳 AchievementCard hands_10 render: current/target/progress:', achievement.current, '/', achievement.target, '=', progress + '%')
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400'
      case 'rare': return 'border-blue-400'
      case 'epic': return 'border-purple-400'
      case 'legendary': return 'border-yellow-400'
      default: return 'border-gray-400'
    }
  }

  const getProgressBarColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-400'
      case 'rare': return 'bg-blue-400'
      case 'epic': return 'bg-purple-400'
      case 'legendary': return 'bg-yellow-400'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div className={`
      p-3 md:p-4 rounded-lg border-2 transition-all
      ${isUnlocked 
        ? `bg-emerald-700/30 ${getRarityColor(achievement.rarity)}` 
        : 'bg-emerald-800/20 border-emerald-600 opacity-75'
      }
    `}>
      <div className="flex items-start gap-3 md:gap-4">
        {/* Icon */}
        <div className={`
          text-2xl md:text-3xl p-1 md:p-2 rounded-lg flex-shrink-0
          ${isUnlocked ? 'opacity-100' : 'opacity-50 grayscale'}
        `}>
          {achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-bold text-base md:text-lg truncate pr-2 ${isUnlocked ? 'text-white' : 'text-emerald-300'}`}>
              {achievement.title}
            </h3>
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              {isUnlocked && (
                <span className="text-yellow-400 text-sm">✅</span>
              )}
              <span className={`
                text-xs px-2 py-1 rounded-full
                ${achievement.rarity === 'common' ? 'bg-gray-500' : ''}
                ${achievement.rarity === 'rare' ? 'bg-blue-500' : ''}
                ${achievement.rarity === 'epic' ? 'bg-purple-500' : ''}
                ${achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black' : ''}
              `}>
                {achievement.rarity.toUpperCase()}
              </span>
            </div>
          </div>

          <p className={`text-sm mb-3 ${isUnlocked ? 'text-emerald-100' : 'text-emerald-400'}`}>
            {achievement.description}
          </p>

          {/* Progress */}
          {!isUnlocked && achievement.target > 1 && (
            <div className="mb-2">
              <div className="flex justify-between text-xs text-emerald-300 mb-1">
                <span>Progress: {achievement.current}/{achievement.target}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-emerald-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(achievement.rarity)}`}
                  style={{ 
                    width: `${Math.min(progress, 100)}%`,
                    // Force a repaint by using a slightly different property
                    transform: `translateX(0px)`
                  }}
                />
              </div>
            </div>
          )}

          {/* Reward */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-yellow-400">💰</span>
              <span className={isUnlocked ? 'text-yellow-400' : 'text-emerald-300'}>
                {achievement.coinReward} coins
              </span>
            </div>
            {isUnlocked && achievement.unlockedAt && (
              <span className="text-xs text-emerald-400">
                Unlocked {achievement.unlockedAt.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}