'use client'

import { Button } from '@/components/ui/Button'

interface ActionButtonsProps {
  onHit: () => void
  onStand: () => void
  onDouble: () => void
  onSplit?: () => void
  canDouble?: boolean
  canSplit?: boolean
  disabled?: boolean
}

export function ActionButtons({ 
  onHit, 
  onStand, 
  onDouble, 
  onSplit,
  canDouble = true,
  canSplit = false,
  disabled = false 
}: ActionButtonsProps) {
  return (
    <div className="relative">
      {/* Luxury control panel background */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-6 border-2 border-yellow-400/30 shadow-2xl backdrop-blur-sm">
        <div className="absolute inset-1 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30 rounded-xl"></div>
        
        {/* Action buttons grid */}
        <div className="relative z-10 flex gap-4 justify-center flex-wrap">
          <Button 
            onClick={onHit} 
            variant="primary"
            disabled={disabled}
          >
            🎯 Hit
          </Button>
          <Button 
            onClick={onStand} 
            variant="secondary"
            disabled={disabled}
          >
            ✋ Stand  
          </Button>
          <Button 
            onClick={onDouble} 
            variant="danger"
            disabled={disabled || !canDouble}
          >
            💰 Double
          </Button>
          {canSplit && onSplit && (
            <Button 
              onClick={onSplit} 
              variant="primary"
              disabled={disabled}
              className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 hover:from-purple-500 hover:via-purple-400 hover:to-purple-500 border-purple-400 shadow-purple-500/30"
            >
              ⚡ Split
            </Button>
          )}
        </div>
        
        {/* Control panel label */}
        <div className="text-center mt-4">
          <div className="text-xs text-yellow-400/60 font-serif tracking-widest uppercase">Game Controls</div>
        </div>
      </div>
      
      {/* Subtle glow around control panel */}
      <div className="absolute inset-0 bg-gradient-radial from-yellow-400/10 via-transparent to-transparent blur-xl -z-10"></div>
    </div>
  )
}