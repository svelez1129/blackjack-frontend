import { Card } from '@/components/ui/Card'
import type { Card as CardType } from '@/types/card'

export default function PlayPage() {
  // Create some test cards to display
  const testCards: CardType[] = [
    { suit: 'hearts', value: 'K', id: 'test-1' },
    { suit: 'spades', value: 'A', id: 'test-2' },
    { suit: 'diamonds', value: '10', id: 'test-3' },
    { suit: 'clubs', value: '7', id: 'test-4' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8 ">
        <h1 className="text-4xl font-bold text-center mb-16">
          Blackjack - Play Mode
        </h1>
        
        <div className="max-w-2xl mx-auto space-y-16">
        {/* Dealer Hand */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Dealer Hand</h2>
            <div className="flex gap-3 justify-center">
              <Card card={testCards[2]} />
              <Card card={testCards[3]} isFlipped={true} />
            </div>
          </div>

          {/* Player Hand */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Your Hand</h2>
            <div className="flex gap-3 justify-center">
              <Card card={testCards[0]} />
              <Card card={testCards[1]} />
            </div>
          </div>
          
          
        </div>
      </div>
    </main>
  )
}