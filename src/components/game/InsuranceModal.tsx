'use client'

import { Button } from '@/components/ui/Button'

interface InsuranceModalProps {
  maxBet: number
  playerMoney: number
  onTakeInsurance: () => void
  onDeclineInsurance: () => void
  disabled?: boolean
}

export function InsuranceModal({ 
  maxBet, 
  playerMoney,
  onTakeInsurance, 
  onDeclineInsurance,
  disabled = false 
}: InsuranceModalProps) {
  const canAffordInsurance = playerMoney >= maxBet

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-md">
        {/* Luxury modal background */}
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl md:rounded-2xl p-4 md:p-8 border-2 border-yellow-400/50 shadow-2xl backdrop-blur-sm">
          <div className="absolute inset-1 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30 rounded-xl"></div>
          
          {/* Modal content */}
          <div className="relative z-10 text-center">
            {/* Header */}
            <div className="mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-2">🛡️ Insurance</h2>
              <p className="text-gray-300 text-sm">
                Dealer shows an Ace. Protect against dealer blackjack?
              </p>
            </div>

            {/* Insurance details */}
            <div className="bg-gray-800/50 rounded-lg p-3 md:p-4 mb-4 md:mb-6 border border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Insurance Cost:</span>
                <span className="text-white font-bold">${maxBet}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Potential Payout:</span>
                <span className="text-emerald-400 font-bold">${maxBet * 2}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Pays 2:1 if dealer has blackjack
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                onClick={onTakeInsurance} 
                variant="primary"
                disabled={disabled || !canAffordInsurance}
                className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:via-emerald-400 hover:to-emerald-500 border-emerald-400 shadow-emerald-500/30 text-sm sm:text-base px-4 py-2"
              >
                🛡️ Take Insurance
              </Button>
              <Button 
                onClick={onDeclineInsurance} 
                variant="secondary"
                disabled={disabled}
                className="text-sm sm:text-base px-4 py-2"
              >
                ❌ No Insurance
              </Button>
            </div>

            {!canAffordInsurance && (
              <div className="mt-4 text-red-400 text-sm">
                Insufficient funds for insurance
              </div>
            )}
          </div>
        </div>
        
        {/* Subtle glow around modal */}
        <div className="absolute inset-0 bg-gradient-radial from-yellow-400/10 via-transparent to-transparent blur-xl -z-10"></div>
      </div>
    </div>
  )
}