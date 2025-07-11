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
    <div className="flex gap-3 justify-center flex-wrap">
      <Button 
        onClick={onHit} 
        variant="primary"
        disabled={disabled}
      >
        Hit
      </Button>
      <Button 
        onClick={onStand} 
        variant="secondary"
        disabled={disabled}
      >
        Stand  
      </Button>
      <Button 
        onClick={onDouble} 
        variant="danger"
        disabled={disabled || !canDouble}
      >
        Double
      </Button>
      {canSplit && onSplit && (
        <Button 
          onClick={onSplit} 
          variant="primary"
          disabled={disabled}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
        >
          Split
        </Button>
      )}
    </div>
  )
}