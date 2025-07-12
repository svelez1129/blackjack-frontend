'use client'

interface ChipProps {
  value: 10 | 25 | 50 | 100
  isSelected?: boolean
  onClick: (value: 10 | 25 | 50 | 100) => void
}

export function Chip({ value, isSelected = false, onClick }: ChipProps) {
  const chipColors = {
    10: "bg-gradient-to-br from-red-500 to-red-700",
    25: "bg-gradient-to-br from-emerald-500 to-emerald-700", 
    50: "bg-gradient-to-br from-yellow-500 to-orange-500",
    100: "bg-gradient-to-br from-amber-600 to-yellow-700"
  }

  const selectedStyle = isSelected ? "ring-4 ring-yellow-400 scale-110" : ""
  
  return (
    <button
      onClick={() => onClick(value)}
      className={`
        w-16 h-16 rounded-full 
        ${chipColors[value]} 
        text-white font-bold text-sm
        shadow-lg border-4 border-white
        transition-all duration-200
        hover:scale-105 active:scale-95
        ${selectedStyle}
      `}
    >
      ${value}
    </button>
  )
}