'use client'

import { Card as CardType, getCardColor } from '@/types/card'
import { useState, useEffect } from 'react'
import { playCardDeal } from '@/lib/sounds'

interface CardProps {
  card: CardType
  isFlipped?: boolean
  dealingDelay?: number
  size?: 'tiny' | 'small' | 'normal'
  isRevealing?: boolean // New prop for flip animation
}

export function Card({ card, isFlipped = false, dealingDelay = 0, size = 'normal', isRevealing = false }: CardProps) {
  const [isVisible, setIsVisible] = useState(dealingDelay === 0)
  const cardColor = getCardColor(card.suit)
  
  useEffect(() => {
    if (dealingDelay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        // Play card dealing sound when card becomes visible
        playCardDeal()
      }, dealingDelay)
      
      return () => clearTimeout(timer)
    } else if (dealingDelay === 0) {
      // Play sound immediately for cards with no delay
      playCardDeal()
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
  
  // Show card back if flipped - luxury casino design
  if (isFlipped) {
    return (
      <div className={`${sizeClasses[size]} relative bg-gradient-to-br from-red-900 via-red-800 to-red-900 rounded-lg border-2 border-yellow-400/60 flex items-center justify-center ${isRevealing ? 'animate-card-flip' : 'animate-card-deal'} shadow-xl`}>
        {/* Luxury card back pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-700/20 via-transparent to-red-900/20 rounded-lg"></div>
        <div className="absolute inset-1 border border-yellow-400/30 rounded-md"></div>
        
        {/* Casino logo/pattern */}
        <div className="relative flex flex-col items-center">
          <span className={`text-yellow-400 ${size === 'tiny' ? 'text-xs' : size === 'small' ? 'text-sm' : 'text-lg'} font-bold mb-0.5`}>♠</span>
          <span className={`text-yellow-400 ${size === 'tiny' ? 'text-xs' : size === 'small' ? 'text-sm' : 'text-lg'} font-bold`}>♦</span>
        </div>
        
        {/* Subtle shine effect */}
        <div className="absolute top-1 left-1 right-1 h-2 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent rounded-t-lg"></div>
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
    <div className={`${sizeClasses[size]} relative bg-gradient-to-br from-white via-gray-50 to-white rounded-lg border-2 border-gray-200 shadow-2xl flex flex-col justify-between ${size === 'tiny' ? 'p-1' : 'p-1.5'} animate-card-deal hover:shadow-yellow-400/20 transition-shadow duration-300`}>
      {/* Premium card edge effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-gray-100/50 via-transparent to-gray-200/30"></div>
      
      {/* Inner border for luxury feel */}
      <div className="absolute inset-1 border border-gray-300/40 rounded-md"></div>
      
      {/* Top-left corner */}
      <div className={`relative z-10 ${size === 'tiny' ? 'mr-8' : 'mr-16'} ${textSizeClasses[size].corner} font-bold ${cardColor === 'red' ? 'text-red-600' : 'text-black'}`}>
        <div className="font-serif font-black">{card.value}</div>
        <div className={`${textSizeClasses[size].corner} font-normal`}>{suitSymbols[card.suit]}</div>
      </div>
      
      {/* Center symbol with enhanced styling */}
      <div className={`relative z-10 ${textSizeClasses[size].suit} self-center font-bold ${cardColor === 'red' ? 'text-red-600 drop-shadow-sm' : 'text-black drop-shadow-sm'}`}>
        {suitSymbols[card.suit]}
      </div>
      
      {/* Bottom-right corner (rotated) */}
      <div className={`relative z-10 ${textSizeClasses[size].corner} font-bold self-end rotate-180 ${cardColor === 'red' ? 'text-red-600' : 'text-black'}`}>
        <div className="font-serif font-black">{card.value}</div>
        <div className={`${textSizeClasses[size].corner} font-normal`}>{suitSymbols[card.suit]}</div>
      </div>
      
      {/* Subtle highlight for face cards */}
      {(card.value === 'J' || card.value === 'Q' || card.value === 'K' || card.value === 'A') && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-400/10 rounded-lg"></div>
      )}
      
      {/* Card shine effect */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-lg"></div>
    </div>
  )
}