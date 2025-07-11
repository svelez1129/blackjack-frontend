'use client'

import { Card as CardType, getCardColor } from '@/types/card'
import { useState, useEffect } from 'react'

interface CardProps {
  card: CardType
  isFlipped?: boolean
  dealingDelay?: number
  size?: 'tiny' | 'small' | 'normal'  // Added tiny size
}

export function Card({ card, isFlipped = false, dealingDelay = 0, size = 'normal' }: CardProps) {
  const [isVisible, setIsVisible] = useState(dealingDelay === 0)
  const cardColor = getCardColor(card.suit)
  
  useEffect(() => {
    if (dealingDelay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, dealingDelay)
      
      return () => clearTimeout(timer)
    }
  }, [dealingDelay])
  
  // Don't render anything until it's time for the card to appear
  if (!isVisible) {
    return null
  }

  // Dynamic sizing based on size prop
  const sizeClasses = {
    normal: "w-20 h-33",
    small: "w-16 h-26",
    tiny: "w-12 h-20"
  }

  const textSizeClasses = {
    normal: {
      corner: "text-sm",
      suit: "text-2xl"
    },
    small: {
      corner: "text-xs",
      suit: "text-xl"
    },
    tiny: {
      corner: "text-xs",
      suit: "text-base"
    }
  }
  
  // Show card back if flipped
  if (isFlipped) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg border border-slate-600 flex items-center justify-center animate-card-deal`}>
        <span className={`text-slate-400 ${size === 'tiny' ? 'text-sm' : size === 'small' ? 'text-base' : 'text-lg'}`}>♣</span>
      </div>
    )
  }
  
  // Show actual card
  const suitSymbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
  }
  
  return (
    <div className={`${sizeClasses[size]} bg-white rounded-lg border border-gray-300 shadow-lg flex flex-col justify-between ${size === 'tiny' ? 'p-1' : 'p-1.5'} animate-card-deal`}>
      {/* Top-left corner */}
      <div className={`${size === 'tiny' ? 'mr-8' : 'mr-16'} ${textSizeClasses[size].corner} font-bold ${cardColor === 'red' ? 'text-red-600' : 'text-black'}`}>
        <div>{card.value}</div>
        <div className={textSizeClasses[size].corner}>{suitSymbols[card.suit]}</div>
      </div>
      
      {/* Center symbol */}
      <div className={`${textSizeClasses[size].suit} self-center ${cardColor === 'red' ? 'text-red-600' : 'text-black'}`}>
        {suitSymbols[card.suit]}
      </div>
      
      {/* Bottom-right corner (rotated) */}
      <div className={`${textSizeClasses[size].corner} font-bold self-end rotate-180 ${cardColor === 'red' ? 'text-red-600' : 'text-black'}`}>
        <div>{card.value}</div>
        <div className={textSizeClasses[size].corner}>{suitSymbols[card.suit]}</div>
      </div>
    </div>
  )
}