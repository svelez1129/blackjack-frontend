import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { InsuranceModal } from '../InsuranceModal'

describe('InsuranceModal', () => {
  const defaultProps = {
    maxBet: 50,
    playerMoney: 1000,
    onTakeInsurance: jest.fn(),
    onDeclineInsurance: jest.fn(),
    disabled: false
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders insurance modal with correct content', () => {
    render(<InsuranceModal {...defaultProps} />)
    
    expect(screen.getByText('🛡️ Insurance')).toBeInTheDocument()
    expect(screen.getByText('Dealer shows an Ace. Protect against dealer blackjack?')).toBeInTheDocument()
    expect(screen.getByText('$50')).toBeInTheDocument() // Insurance cost
    expect(screen.getByText('$100')).toBeInTheDocument() // Potential payout
    expect(screen.getByText('Pays 2:1 if dealer has blackjack')).toBeInTheDocument()
  })

  test('displays correct insurance cost and payout', () => {
    const customProps = { ...defaultProps, maxBet: 25 }
    render(<InsuranceModal {...customProps} />)
    
    expect(screen.getByText('$25')).toBeInTheDocument() // Insurance cost
    expect(screen.getByText('$50')).toBeInTheDocument() // Potential payout (2:1)
  })

  test('calls onTakeInsurance when Take Insurance button is clicked', () => {
    render(<InsuranceModal {...defaultProps} />)
    
    const takeInsuranceButton = screen.getByRole('button', { name: /take insurance/i })
    fireEvent.click(takeInsuranceButton)
    
    expect(defaultProps.onTakeInsurance).toHaveBeenCalledTimes(1)
  })

  test('calls onDeclineInsurance when No Insurance button is clicked', () => {
    render(<InsuranceModal {...defaultProps} />)
    
    const declineInsuranceButton = screen.getByRole('button', { name: /no insurance/i })
    fireEvent.click(declineInsuranceButton)
    
    expect(defaultProps.onDeclineInsurance).toHaveBeenCalledTimes(1)
  })

  test('disables buttons when disabled prop is true', () => {
    const disabledProps = { ...defaultProps, disabled: true }
    render(<InsuranceModal {...disabledProps} />)
    
    const takeInsuranceButton = screen.getByRole('button', { name: /take insurance/i })
    const declineInsuranceButton = screen.getByRole('button', { name: /no insurance/i })
    
    expect(takeInsuranceButton).toBeDisabled()
    expect(declineInsuranceButton).toBeDisabled()
  })

  test('disables Take Insurance button when player has insufficient funds', () => {
    const insufficientFundsProps = { ...defaultProps, playerMoney: 30, maxBet: 50 }
    render(<InsuranceModal {...insufficientFundsProps} />)
    
    const takeInsuranceButton = screen.getByRole('button', { name: /take insurance/i })
    const declineInsuranceButton = screen.getByRole('button', { name: /no insurance/i })
    
    expect(takeInsuranceButton).toBeDisabled()
    expect(declineInsuranceButton).toBeEnabled()
    expect(screen.getByText('Insufficient funds for insurance')).toBeInTheDocument()
  })

  test('enables Take Insurance button when player has sufficient funds', () => {
    const sufficientFundsProps = { ...defaultProps, playerMoney: 100, maxBet: 50 }
    render(<InsuranceModal {...sufficientFundsProps} />)
    
    const takeInsuranceButton = screen.getByRole('button', { name: /take insurance/i })
    expect(takeInsuranceButton).toBeEnabled()
    expect(screen.queryByText('Insufficient funds for insurance')).not.toBeInTheDocument()
  })

  test('prevents callback execution when buttons are disabled', () => {
    const disabledProps = { ...defaultProps, disabled: true }
    render(<InsuranceModal {...disabledProps} />)
    
    const takeInsuranceButton = screen.getByRole('button', { name: /take insurance/i })
    const declineInsuranceButton = screen.getByRole('button', { name: /no insurance/i })
    
    fireEvent.click(takeInsuranceButton)
    fireEvent.click(declineInsuranceButton)
    
    expect(defaultProps.onTakeInsurance).not.toHaveBeenCalled()
    expect(defaultProps.onDeclineInsurance).not.toHaveBeenCalled()
  })

  test('has proper modal overlay styling', () => {
    const { container } = render(<InsuranceModal {...defaultProps} />)
    
    const overlay = container.firstChild
    expect(overlay).toHaveClass('fixed', 'inset-0', 'bg-black/60', 'backdrop-blur-sm')
  })

  test('handles edge case with zero bet', () => {
    const zeroBetProps = { ...defaultProps, maxBet: 0 }
    render(<InsuranceModal {...zeroBetProps} />)
    
    // Find the insurance cost specifically (first $0)
    const insuranceCostElement = screen.getByText('Insurance Cost:').nextElementSibling
    expect(insuranceCostElement).toHaveTextContent('$0')
    
    const takeInsuranceButton = screen.getByRole('button', { name: /take insurance/i })
    expect(takeInsuranceButton).toBeEnabled() // Should still be enabled even with $0 cost
  })

  test('handles large bet amounts correctly', () => {
    const largeBetProps = { ...defaultProps, maxBet: 500, playerMoney: 1000 }
    render(<InsuranceModal {...largeBetProps} />)
    
    expect(screen.getByText('$500')).toBeInTheDocument() // Insurance cost
    expect(screen.getByText('$1000')).toBeInTheDocument() // Potential payout (no comma in component)
  })

  test('maintains accessibility standards', () => {
    render(<InsuranceModal {...defaultProps} />)
    
    const takeInsuranceButton = screen.getByRole('button', { name: /take insurance/i })
    const declineInsuranceButton = screen.getByRole('button', { name: /no insurance/i })
    
    // Buttons should be properly identified as buttons
    expect(takeInsuranceButton.tagName).toBe('BUTTON')
    expect(declineInsuranceButton.tagName).toBe('BUTTON')
    
    // Both buttons should be focusable (default for button elements)
    expect(takeInsuranceButton.tabIndex).not.toBe(-1)
    expect(declineInsuranceButton.tabIndex).not.toBe(-1)
    
    // Buttons should have accessible text content
    expect(takeInsuranceButton).toHaveTextContent('Take Insurance')
    expect(declineInsuranceButton).toHaveTextContent('No Insurance')
  })
})