'use client'

import { Card as CardType, getCardColor } from '@/types/card'
import { useState, useEffect } from 'react'

interface CardProps {
  card: CardType
  isFlipped?: boolean
  dealingDelay?: number  // Delay before this card appears (in ms)
}

export function Card({ card, isFlipped = false, dealingDelay = 0 }: CardProps) {
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
  
  // Show card back if flipped
  if (isFlipped) {
    return (
      <div className="w-20 h-33 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg border border-slate-600 flex items-center justify-center animate-card-deal">
        <span className="text-slate-400 text-lg">♣</span>
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
    <div className="w-20 h-33 bg-white rounded-lg border border-gray-300 shadow-lg flex flex-col justify-between p-1.5 animate-card-deal">
      {/* Top-left corner */}
      <div className={`mr-16 text-sm font-bold ${cardColor === 'red' ? 'text-red-600' : 'text-black'}`}>
        <div>{card.value}</div>
        <div className="text-sm">{suitSymbols[card.suit]}</div>
      </div>
      
      {/* Center symbol */}
      <div className={`text-2xl self-center ${cardColor === 'red' ? 'text-red-600' : 'text-black'}`}>
        {suitSymbols[card.suit]}
      </div>
      
      {/* Bottom-right corner (rotated) */}
      <div className={`text-sm font-bold self-end rotate-180 ${cardColor === 'red' ? 'text-red-600' : 'text-black'}`}>
        <div>{card.value}</div>
        <div className="text-sm">{suitSymbols[card.suit]}</div>
      </div>
    </div>
  )
}