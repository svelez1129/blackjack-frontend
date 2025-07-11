'use client'

import { Button } from '@/components/ui/Button'

interface ActionButtonsProps {
  onHit: () => void
  onStand: () => void
  onDouble: () => void
  canDouble?: boolean
  canSplit?: boolean
  disabled?: boolean
}

export function ActionButtons({ 
  onHit, 
  onStand, 
  onDouble, 
  canDouble = true,
  canSplit = false,
  disabled = false 
}: ActionButtonsProps) {
  return (
    <div className="flex gap-4 justify-center">
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
    </div>
  )
}