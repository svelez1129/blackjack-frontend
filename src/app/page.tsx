'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [showCards, setShowCards] = useState(false)
  const [showChips, setShowChips] = useState(false)

  useEffect(() => {
    // Staggered animations for dramatic effect
    const timer1 = setTimeout(() => setShowCards(true), 800)
    const timer2 = setTimeout(() => setShowChips(true), 1200)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Luxury casino background */}
      <div className="absolute inset-0">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-gray-900/30 via-black/60 to-black"></div>
        
        {/* Subtle casino table texture */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-green-900 to-green-800"></div>
        </div>
        
        {/* Blurred casino elements in background */}
        <div className="absolute inset-0 opacity-8">
          {/* Scattered playing cards */}
          <div className="absolute top-1/4 left-1/4 w-12 h-18 bg-white rounded transform rotate-45 opacity-20"></div>
          <div className="absolute top-1/3 right-1/3 w-10 h-15 bg-white rounded transform -rotate-12 opacity-15"></div>
          <div className="absolute bottom-1/4 left-1/3 w-14 h-20 bg-white rounded transform rotate-23 opacity-25"></div>
          
          {/* Casino chips scattered */}
          <div className="absolute top-20 right-20 w-8 h-8 bg-red-600 rounded-full opacity-30"></div>
          <div className="absolute top-32 right-32 w-6 h-6 bg-green-600 rounded-full opacity-20"></div>
          <div className="absolute bottom-40 left-16 w-10 h-10 bg-purple-600 rounded-full opacity-25"></div>
        </div>
        
        {/* Spotlight effects */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-yellow-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-radial from-orange-500/8 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto">
          
          {/* Casino Branding */}
          <div className="mb-8">
            <div className="text-6xl md:text-8xl font-serif font-bold tracking-wider mb-4">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl">
                BLACKJACK
              </span>
            </div>
            <div className="text-xl md:text-2xl font-light tracking-[0.3em] text-gray-300 uppercase">
              <span className="border-l-2 border-r-2 border-yellow-400 px-6 py-2">
                Premium Casino Experience
              </span>
            </div>
          </div>

          {/* Luxury tagline */}
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Step into the world of high-stakes blackjack. Start with 
            <span className="text-yellow-400 font-semibold mx-2 text-2xl">$1,000</span>
            and experience the thrill of authentic casino gaming.
          </p>

          {/* Animated Cards Preview - More realistic */}
          <div className={`mb-16 transition-all duration-1500 ${showCards ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-12'}`}>
            <div className="flex justify-center items-center gap-6">
              {/* More realistic playing cards */}
              <div className="relative">
                <div className="w-20 h-32 md:w-24 md:h-36 bg-white rounded-lg shadow-2xl flex flex-col justify-between p-2 transform -rotate-12 border border-gray-200">
                  <div className="text-black text-lg md:text-2xl font-bold self-start">A</div>
                  <div className="text-black text-4xl md:text-5xl self-center">♠</div>
                  <div className="text-black text-lg md:text-2xl font-bold self-end rotate-180">A</div>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-20 h-32 md:w-24 md:h-36 bg-white rounded-lg shadow-2xl flex flex-col justify-between p-2 transform rotate-8 border border-gray-200">
                  <div className="text-red-600 text-lg md:text-2xl font-bold self-start">K</div>
                  <div className="text-red-600 text-4xl md:text-5xl self-center">♥</div>
                  <div className="text-red-600 text-lg md:text-2xl font-bold self-end rotate-180">K</div>
                </div>
              </div>

              {/* Blackjack indicator */}
              <div className="mx-8">
                <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
                  21
                </div>
                <div className="text-yellow-400 text-sm md:text-base font-semibold tracking-widest">
                  BLACKJACK
                </div>
              </div>
              
              <div className="relative">
                <div className="w-20 h-32 md:w-24 md:h-36 bg-white rounded-lg shadow-2xl flex flex-col justify-between p-2 transform -rotate-6 border border-gray-200">
                  <div className="text-black text-lg md:text-2xl font-bold self-start">Q</div>
                  <div className="text-black text-4xl md:text-5xl self-center">♣</div>
                  <div className="text-black text-lg md:text-2xl font-bold self-end rotate-180">Q</div>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-20 h-32 md:w-24 md:h-36 bg-white rounded-lg shadow-2xl flex flex-col justify-between p-2 transform rotate-15 border border-gray-200">
                  <div className="text-red-600 text-lg md:text-2xl font-bold self-start">J</div>
                  <div className="text-red-600 text-4xl md:text-5xl self-center">♦</div>
                  <div className="text-red-600 text-lg md:text-2xl font-bold self-end rotate-180">J</div>
                </div>
              </div>
            </div>
          </div>

          {/* Animated casino chips */}
          <div className={`mb-12 transition-all duration-1000 delay-500 ${showChips ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            <div className="flex justify-center items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold transform -rotate-12">
                $5
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold">
                $25
              </div>
              <div className="w-24 h-24 bg-gradient-to-br from-black to-gray-800 rounded-full border-4 border-yellow-400 shadow-xl flex items-center justify-center text-yellow-400 font-bold text-lg transform rotate-6">
                $100
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold">
                $50
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold transform rotate-12">
                $10
              </div>
            </div>
          </div>

          {/* Main CTA Button - Enhanced with urgency */}
          <Link 
            href="/play"
            className="group inline-block"
          >
            <button className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:via-red-400 hover:to-orange-400 text-white font-bold text-xl md:text-3xl px-16 md:px-20 py-6 md:py-8 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-red-500/50 animate-pulse">
              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 to-orange-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              
              <span className="relative flex items-center gap-4">
                <span className="text-4xl">🎰</span>
                DEAL ME IN
                <span className="text-4xl">🎰</span>
              </span>
              
              {/* Pulsing ring */}
              <div className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-ping opacity-25"></div>
            </button>
          </Link>

          {/* VIP Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black text-2xl font-bold group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <div className="text-gray-200">
                <div className="font-bold text-xl mb-2 text-yellow-400">Instant Action</div>
                <div className="text-sm opacity-80">No downloads, no waiting. Pure casino excitement.</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform">
                💎
              </div>
              <div className="text-gray-200">
                <div className="font-bold text-xl mb-2 text-yellow-400">VIP Experience</div>
                <div className="text-sm opacity-80">$1,000 starting bankroll + daily bonuses</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform">
                🏆
              </div>
              <div className="text-gray-200">
                <div className="font-bold text-xl mb-2 text-yellow-400">Authentic Rules</div>
                <div className="text-sm opacity-80">Real casino blackjack with professional standards</div>
              </div>
            </div>
          </div>

          {/* Social Proof with premium styling */}
          <div className="mt-20 text-center">
            <div className="inline-block px-8 py-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-full border border-yellow-400/30">
              <p className="text-gray-300 text-lg">
                <span className="text-yellow-400 font-semibold">Join 50,000+</span> players worldwide
                <span className="mx-4 text-yellow-400">•</span>
                <span className="text-yellow-400 font-semibold">No registration</span> required
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced floating elements with casino theme */}
      <div className="absolute top-20 left-20 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
      <div className="absolute top-40 right-24 w-2 h-2 bg-red-500 rounded-full animate-pulse delay-300"></div>
      <div className="absolute bottom-32 left-16 w-4 h-4 bg-orange-400 rounded-full animate-ping delay-700"></div>
      <div className="absolute bottom-20 right-20 w-2 h-2 bg-green-400 rounded-full animate-bounce delay-1000"></div>
      
      {/* Subtle light rays */}
      <div className="absolute top-0 left-0 w-1 h-40 bg-gradient-to-b from-yellow-400/20 to-transparent rotate-12"></div>
      <div className="absolute top-0 right-0 w-1 h-32 bg-gradient-to-b from-orange-400/20 to-transparent -rotate-12"></div>
    </main>
  )
}