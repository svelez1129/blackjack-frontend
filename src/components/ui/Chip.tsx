'use client'

interface ChipProps {
  value: 10 | 25 | 50 | 100
  isSelected?: boolean
  onClick: (value: 10 | 25 | 50 | 100) => void
}

export function Chip({ value, isSelected = false, onClick }: ChipProps) {
  const chipColors = {
    10: "bg-gradient-to-br from-red-500 to-red-700",
    25: "bg-gradient-to-br from-green-500 to-green-700", 
    50: "bg-gradient-to-br from-blue-500 to-blue-700",
    100: "bg-gradient-to-br from-purple-500 to-purple-700"
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