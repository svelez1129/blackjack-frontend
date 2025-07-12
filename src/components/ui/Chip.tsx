'use client'

interface ChipProps {
  value: 10 | 25 | 50 | 100
  isSelected?: boolean
  onClick: (value: 10 | 25 | 50 | 100) => void
  disabled?: boolean
}

export function Chip({ value, isSelected = false, onClick, disabled = false }: ChipProps) {
  // Authentic casino chip colors and styling
  const chipStyles = {
    10: {
      bg: "bg-gradient-to-br from-red-600 via-red-500 to-red-700",
      border: "border-red-300",
      accent: "text-red-100",
      pattern: "from-red-400/30 to-red-800/30"
    },
    25: {
      bg: "bg-gradient-to-br from-green-600 via-green-500 to-green-700",
      border: "border-green-300",
      accent: "text-green-100",
      pattern: "from-green-400/30 to-green-800/30"
    },
    50: {
      bg: "bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700",
      border: "border-purple-300",
      accent: "text-purple-100",
      pattern: "from-purple-400/30 to-purple-800/30"
    },
    100: {
      bg: "bg-gradient-to-br from-black via-gray-800 to-black",
      border: "border-yellow-400",
      accent: "text-yellow-400",
      pattern: "from-yellow-400/20 to-gray-900/40"
    }
  }

  const selectedStyle = isSelected ? "ring-4 ring-yellow-400 scale-110 shadow-yellow-400/50" : ""
  
  const currentStyle = chipStyles[value]
  
  return (
    <button
      onClick={() => !disabled && onClick(value)}
      disabled={disabled}
      className={`
        relative w-16 h-12 rounded-full 
        ${currentStyle.bg} 
        ${currentStyle.accent} font-bold text-xs
        shadow-lg border ${currentStyle.border}
        transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:shadow-xl active:scale-95'}
        ${selectedStyle}
        group
      `}
    >
      {/* Chip rim pattern */}
      <div className="absolute inset-0.5 rounded-full border border-white/20"></div>
      
      {/* Chip center pattern */}
      <div className={`absolute inset-2 rounded-full bg-gradient-radial ${currentStyle.pattern} border border-white/10`}></div>
      
      {/* Chip stripes/pattern for authenticity */}
      <div className="absolute inset-0 rounded-full">
        {/* Radial stripes */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0.5 bottom-0.5 w-0.5 bg-white/10"
            style={{
              left: '50%',
              transformOrigin: 'center bottom',
              transform: `translateX(-50%) rotate(${i * 60}deg)`
            }}
          />
        ))}
      </div>
      
      {/* Value text */}
      <div className="relative z-10 font-serif font-black text-shadow">
        ${value}
      </div>
      
      {/* Subtle shine effect */}
      <div className="absolute top-0.5 left-0.5 right-0.5 h-1.5 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-full"></div>
      
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
    </button>
  )
}