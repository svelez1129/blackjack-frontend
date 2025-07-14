import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { GameResults } from '../GameResults'

describe('GameResults', () => {
  const defaultProps = {
    results: ['win'],
    bets: [100],
    totalWinnings: 100,
    totalHands: 1,
    money: 1100
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders basic game results without insurance', () => {
    render(<GameResults {...defaultProps} />)
    
    expect(screen.getByText('YOU WIN!')).toBeInTheDocument()
    expect(screen.getByText('+$100')).toBeInTheDocument()
    expect(screen.getByText('Money Won')).toBeInTheDocument()
  })

  test('displays insurance win result', () => {
    const propsWithInsurance = {
      ...defaultProps,
      insuranceTaken: true,
      insuranceBet: 50,
      insuranceResult: 'win' as const
    }
    
    render(<GameResults {...propsWithInsurance} />)
    
    expect(screen.getByText('🛡️')).toBeInTheDocument()
    expect(screen.getByText('Insurance')).toBeInTheDocument()
    expect(screen.getByText('+$100 🎉')).toBeInTheDocument()
    expect(screen.getByText('Dealer had blackjack - Insurance pays 2:1!')).toBeInTheDocument()
  })

  test('displays insurance loss result', () => {
    const propsWithInsurance = {
      ...defaultProps,
      insuranceTaken: true,
      insuranceBet: 50,
      insuranceResult: 'lose' as const
    }
    
    render(<GameResults {...propsWithInsurance} />)
    
    expect(screen.getByText('🛡️')).toBeInTheDocument()
    expect(screen.getByText('Insurance')).toBeInTheDocument()
    expect(screen.getByText('-$50 ❌')).toBeInTheDocument()
    expect(screen.getByText('Dealer did not have blackjack - Insurance lost')).toBeInTheDocument()
  })

  test('does not display insurance section when insurance not taken', () => {
    const propsWithoutInsurance = {
      ...defaultProps,
      insuranceTaken: false,
      insuranceBet: 0,
      insuranceResult: undefined
    }
    
    render(<GameResults {...propsWithoutInsurance} />)
    
    expect(screen.queryByText('Insurance')).not.toBeInTheDocument()
    expect(screen.queryByText('🛡️')).not.toBeInTheDocument()
  })

  test('handles insurance with zero bet amount', () => {
    const propsWithZeroInsurance = {
      ...defaultProps,
      insuranceTaken: true,
      insuranceBet: 0,
      insuranceResult: 'lose' as const
    }
    
    render(<GameResults {...propsWithZeroInsurance} />)
    
    expect(screen.getByText('Insurance')).toBeInTheDocument()
    expect(screen.getByText('-$0 ❌')).toBeInTheDocument()
  })

  test('displays correct insurance payout amounts', () => {
    const propsWithLargeInsurance = {
      ...defaultProps,
      insuranceTaken: true,
      insuranceBet: 100,
      insuranceResult: 'win' as const
    }
    
    render(<GameResults {...propsWithLargeInsurance} />)
    
    expect(screen.getByText('+$200 🎉')).toBeInTheDocument() // 2:1 payout
  })

  test('handles multiple hands with insurance', () => {
    const multiHandProps = {
      results: ['win', 'lose'],
      bets: [100, 100],
      totalWinnings: 0,
      totalHands: 2,
      money: 1000,
      insuranceTaken: true,
      insuranceBet: 50,
      insuranceResult: 'win' as const
    }
    
    render(<GameResults {...multiHandProps} />)
    
    expect(screen.getByText('MIXED RESULTS')).toBeInTheDocument()
    expect(screen.getByText('Insurance')).toBeInTheDocument()
    expect(screen.getByText('+$100 🎉')).toBeInTheDocument()
  })

  test('displays correct styling for insurance win', () => {
    const propsWithInsuranceWin = {
      ...defaultProps,
      insuranceTaken: true,
      insuranceBet: 50,
      insuranceResult: 'win' as const
    }
    
    const { container } = render(<GameResults {...propsWithInsuranceWin} />)
    
    const insuranceSection = container.querySelector('.border-blue-400\\/30')
    expect(insuranceSection).toBeInTheDocument()
    
    const winAmount = screen.getByText('+$100 🎉')
    // The class is on the parent div, not the span
    expect(winAmount.parentElement).toHaveClass('text-emerald-400')
  })

  test('displays correct styling for insurance loss', () => {
    const propsWithInsuranceLoss = {
      ...defaultProps,
      insuranceTaken: true,
      insuranceBet: 50,
      insuranceResult: 'lose' as const
    }
    
    render(<GameResults {...propsWithInsuranceLoss} />)
    
    const lossAmount = screen.getByText('-$50 ❌')
    // The class is on the parent div, not the span
    expect(lossAmount.parentElement).toHaveClass('text-red-400')
  })

  test('handles game over scenario with insurance', () => {
    const gameOverProps = {
      results: ['lose'],
      bets: [100],
      totalWinnings: -100,
      totalHands: 1,
      money: 0, // Game over
      insuranceTaken: true,
      insuranceBet: 50,
      insuranceResult: 'lose' as const
    }
    
    render(<GameResults {...gameOverProps} />)
    
    expect(screen.getByText('💀 GAME OVER 💀')).toBeInTheDocument()
    expect(screen.getByText('Insurance')).toBeInTheDocument()
    expect(screen.getByText('-$50 ❌')).toBeInTheDocument()
  })

  test('handles blackjack result with insurance', () => {
    const blackjackWithInsuranceProps = {
      results: ['blackjack'],
      bets: [100],
      totalWinnings: 150,
      totalHands: 1,
      money: 1150,
      insuranceTaken: true,
      insuranceBet: 50,
      insuranceResult: 'lose' as const
    }
    
    render(<GameResults {...blackjackWithInsuranceProps} />)
    
    expect(screen.getByText('BLACKJACK!')).toBeInTheDocument()
    expect(screen.getByText('Insurance')).toBeInTheDocument()
    expect(screen.getByText('-$50 ❌')).toBeInTheDocument()
  })

  test('handles push result with insurance win', () => {
    const pushWithInsuranceProps = {
      results: ['push'],
      bets: [100],
      totalWinnings: 0,
      totalHands: 1,
      money: 1000,
      insuranceTaken: true,
      insuranceBet: 50,
      insuranceResult: 'win' as const
    }
    
    render(<GameResults {...pushWithInsuranceProps} />)
    
    expect(screen.getByText('PUSH')).toBeInTheDocument()
    expect(screen.getByText('Insurance')).toBeInTheDocument()
    expect(screen.getByText('+$100 🎉')).toBeInTheDocument()
  })

  test('renders compact mode with insurance (3+ hands)', () => {
    const compactProps = {
      results: ['win', 'lose', 'push'],
      bets: [100, 100, 100],
      totalWinnings: 0,
      totalHands: 3,
      money: 1000,
      insuranceTaken: true,
      insuranceBet: 50,
      insuranceResult: 'win' as const
    }
    
    render(<GameResults {...compactProps} />)
    
    expect(screen.getByText('MIXED RESULTS')).toBeInTheDocument()
    // In compact mode, insurance might not be displayed
    // This tests the component doesn't break with insurance in compact mode
  })

  test('handles edge case with undefined insurance result', () => {
    const propsWithUndefinedResult = {
      ...defaultProps,
      insuranceTaken: true,
      insuranceBet: 50,
      insuranceResult: undefined
    }
    
    render(<GameResults {...propsWithUndefinedResult} />)
    
    expect(screen.getByText('Insurance')).toBeInTheDocument()
    // Should handle undefined result gracefully without crashing
  })
})