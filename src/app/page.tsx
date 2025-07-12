'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [showCards, setShowCards] = useState(false)

  useEffect(() => {
    // Animate cards in after a brief delay
    const timer = setTimeout(() => setShowCards(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-48 bg-white rounded-lg transform rotate-12"></div>
        <div className="absolute top-32 left-32 w-32 h-48 bg-white rounded-lg transform -rotate-6"></div>
        <div className="absolute bottom-20 right-20 w-32 h-48 bg-white rounded-lg transform rotate-45"></div>
        <div className="absolute bottom-32 right-32 w-32 h-48 bg-white rounded-lg transform -rotate-12"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-yellow-400">Free</span>{' '}
            <span className="text-white">Blackjack</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Play instantly. No signup required. Start with <span className="text-yellow-400 font-semibold">$1,000</span> and test your luck!
          </p>

          {/* Animated Cards Preview */}
          <div className={`mb-12 transition-all duration-1000 ${showCards ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            <div className="flex justify-center items-center gap-4">
              {/* Playing cards preview */}
              <div className="w-16 h-24 md:w-20 md:h-32 bg-white rounded-lg shadow-lg flex items-center justify-center transform -rotate-12">
                <div className="text-black text-xl md:text-3xl font-bold">A♠</div>
              </div>
              <div className="w-16 h-24 md:w-20 md:h-32 bg-white rounded-lg shadow-lg flex items-center justify-center transform rotate-6">
                <div className="text-red-600 text-xl md:text-3xl font-bold">K♥</div>
              </div>
              <div className="text-4xl md:text-6xl mx-4 text-yellow-400">21</div>
              <div className="w-16 h-24 md:w-20 md:h-32 bg-white rounded-lg shadow-lg flex items-center justify-center transform -rotate-6">
                <div className="text-black text-xl md:text-3xl font-bold">Q♣</div>
              </div>
              <div className="w-16 h-24 md:w-20 md:h-32 bg-white rounded-lg shadow-lg flex items-center justify-center transform rotate-12">
                <div className="text-red-600 text-xl md:text-3xl font-bold">J♦</div>
              </div>
            </div>
          </div>

          {/* Main CTA Button */}
          <Link 
            href="/play"
            className="group inline-flex items-center justify-center"
          >
            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-xl md:text-2xl px-12 md:px-16 py-4 md:py-6 rounded-full shadow-2xl transform transition-all duration-200 hover:scale-105 hover:shadow-3xl group-hover:shadow-yellow-500/25">
              🎲 PLAY FREE BLACKJACK NOW 🎲
            </button>
          </Link>

          {/* Quick Benefits */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-green-100">
                <div className="font-semibold">Instant Play</div>
                <div className="text-sm opacity-80">No downloads needed</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-green-100">
                <div className="font-semibold">Free $1,000</div>
                <div className="text-sm opacity-80">Start playing immediately</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-green-100">
                <div className="font-semibold">Real Blackjack</div>
                <div className="text-sm opacity-80">Authentic casino rules</div>
              </div>
            </div>
          </div>

          {/* Social Proof / Stats */}
          <div className="mt-16 text-center">
            <p className="text-green-200 text-lg">
              Join thousands of players • No registration required
            </p>
          </div>
        </div>
      </div>

      {/* Floating elements for visual appeal */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-16 w-6 h-6 bg-orange-400 rounded-full animate-pulse delay-300"></div>
      <div className="absolute bottom-16 left-20 w-5 h-5 bg-yellow-300 rounded-full animate-pulse delay-700"></div>
      <div className="absolute bottom-32 right-12 w-3 h-3 bg-orange-300 rounded-full animate-pulse delay-1000"></div>
    </main>
  )
}