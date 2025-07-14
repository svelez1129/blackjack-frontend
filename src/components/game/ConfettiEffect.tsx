'use client'

import { useState, useEffect } from 'react'

interface ConfettiParticle {
  id: number
  left: number
  top: number
  animationDelay: number
  animationDuration: number
  emoji: string
}

export default function ConfettiEffect() {
  const [particles, setParticles] = useState<ConfettiParticle[]>([])

  useEffect(() => {
    // Generate confetti particles on client side only
    const emojis = ['🎉', '💰', '✨', '🎊', '💎']
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 2,
      animationDuration: 1 + Math.random(),
      emoji: emojis[Math.floor(Math.random() * 5)]
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-2xl animate-bounce"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  )
}