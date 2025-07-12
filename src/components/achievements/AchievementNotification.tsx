'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Achievement } from '@/lib/achievements'

interface AchievementNotificationProps {
  achievement: Achievement
  onDismiss: () => void
  autoHide?: boolean
  duration?: number
}

export function AchievementNotification({ 
  achievement, 
  onDismiss, 
  autoHide = true, 
  duration = 4000 
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const handleDismiss = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      onDismiss()
    }, 300)
  }, [onDismiss])

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!autoHide) return

    const timer = setTimeout(() => {
      handleDismiss()
    }, duration)

    return () => clearTimeout(timer)
  }, [autoHide, duration, handleDismiss])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-600 to-gray-700 border-gray-500'
      case 'rare': return 'from-blue-600 to-blue-700 border-blue-500'
      case 'epic': return 'from-purple-600 to-purple-700 border-purple-500'
      case 'legendary': return 'from-yellow-600 to-orange-600 border-yellow-500'
      default: return 'from-gray-600 to-gray-700 border-gray-500'
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'shadow-blue-500/25'
      case 'epic': return 'shadow-purple-500/25'
      case 'legendary': return 'shadow-yellow-500/25'
      default: return ''
    }
  }

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-sm
      transform transition-all duration-300 ease-out
      ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className={`
        bg-gradient-to-r ${getRarityColor(achievement.rarity)}
        text-white p-4 rounded-lg shadow-xl border-2
        ${getRarityGlow(achievement.rarity)}
        ${achievement.rarity === 'legendary' ? 'animate-pulse' : ''}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{achievement.icon}</span>
            <span className="text-xs font-semibold uppercase tracking-wide opacity-75">
              Achievement Unlocked
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/70 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        {/* Achievement Info */}
        <div className="mb-3">
          <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
          <p className="text-sm opacity-90">{achievement.description}</p>
        </div>

        {/* Reward */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">💰</span>
            <span className="font-semibold">+{achievement.coinReward} coins</span>
          </div>
          <div className={`
            text-xs px-2 py-1 rounded-full
            ${achievement.rarity === 'common' ? 'bg-gray-500' : ''}
            ${achievement.rarity === 'rare' ? 'bg-blue-500' : ''}
            ${achievement.rarity === 'epic' ? 'bg-purple-500' : ''}
            ${achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black' : ''}
          `}>
            {achievement.rarity.toUpperCase()}
          </div>
        </div>

        {/* Legendary effects */}
        {achievement.rarity === 'legendary' && (
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg -z-10 opacity-20 animate-pulse"></div>
        )}
      </div>

      {/* Confetti effect for epic+ achievements */}
      {(achievement.rarity === 'epic' || achievement.rarity === 'legendary') && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`
                  absolute w-2 h-2 rounded-full
                  ${i % 2 === 0 ? 'bg-yellow-400' : 'bg-orange-400'}
                  animate-ping
                `}
                style={{
                  left: `${(i - 3) * 10}px`,
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}