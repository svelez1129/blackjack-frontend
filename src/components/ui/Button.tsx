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
  const baseStyles = "px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-200 min-w-[100px] shadow-lg"
  
  const variants = {
    primary: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white",
    secondary: "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black",
    danger: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
  }
  
  const disabledStyles = "opacity-50 cursor-not-allowed"
  const activeStyles = disabled ? "" : "hover:transform hover:scale-105 active:scale-95"
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`${baseStyles} ${variants[variant]} ${disabled ? disabledStyles : activeStyles} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}