'use client'

interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  className?: string
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = ''
}: ButtonProps) {
  const baseStyles = "relative px-8 py-4 rounded-xl font-bold text-base uppercase tracking-widest transition-all duration-300 min-w-[120px] shadow-2xl border-2 group overflow-hidden"
  
  const variants = {
    primary: "bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-500 hover:via-green-400 hover:to-green-500 text-white border-green-400 shadow-green-500/30",
    secondary: "bg-gradient-to-r from-yellow-600 via-yellow-500 to-orange-600 hover:from-yellow-500 hover:via-yellow-400 hover:to-orange-500 text-black border-yellow-400 shadow-yellow-500/30",
    danger: "bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:via-red-400 hover:to-red-500 text-white border-red-400 shadow-red-500/30"
  }
  
  const disabledStyles = "opacity-40 cursor-not-allowed grayscale"
  const activeStyles = disabled ? "" : "hover:transform hover:scale-110 hover:shadow-3xl active:scale-95"
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`${baseStyles} ${variants[variant]} ${disabled ? disabledStyles : activeStyles} ${className}`}
      disabled={disabled}
    >
      {/* Button shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      
      {/* Button content */}
      <span className="relative z-10 font-serif text-shadow">{children}</span>
      
      {/* Button glow on hover */}
      <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
      
      {/* Subtle inner border */}
      <div className="absolute inset-1 rounded-lg border border-white/20 group-hover:border-white/30 transition-all duration-300"></div>
    </button>
  )
}