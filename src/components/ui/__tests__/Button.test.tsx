import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button onClick={() => {}}>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  test('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('applies primary variant styles', () => {
    render(<Button onClick={() => {}} variant="primary">Primary</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gradient-to-r')
    expect(button).toHaveClass('from-green-600')
    expect(button).toHaveClass('text-white')
  })

  test('applies secondary variant styles', () => {
    render(<Button onClick={() => {}} variant="secondary">Secondary</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('from-yellow-600')
    expect(button).toHaveClass('text-black')
  })

  test('applies danger variant styles', () => {
    render(<Button onClick={() => {}} variant="danger">Danger</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('from-red-600')
    expect(button).toHaveClass('text-white')
  })

  test('is disabled when disabled prop is true', () => {
    render(<Button onClick={() => {}} disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-40')
    expect(button).toHaveClass('cursor-not-allowed')
  })

  test('does not trigger click when disabled', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick} disabled>Disabled</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  test('applies custom className', () => {
    render(<Button onClick={() => {}} className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  test('applies base styles to all buttons', () => {
    render(<Button onClick={() => {}}>Test</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('relative')
    expect(button).toHaveClass('px-8')
    expect(button).toHaveClass('py-4')
    expect(button).toHaveClass('rounded-xl')
    expect(button).toHaveClass('font-bold')
  })

  test('defaults to primary variant when no variant specified', () => {
    render(<Button onClick={() => {}}>Default</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('from-green-600')
  })

  test('has hover effects when not disabled', () => {
    render(<Button onClick={() => {}}>Hover Test</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('hover:transform')
    expect(button).toHaveClass('hover:scale-110')
  })

  test('does not have hover effects when disabled', () => {
    render(<Button onClick={() => {}} disabled>Disabled Hover</Button>)
    const button = screen.getByRole('button')
    expect(button).not.toHaveClass('hover:transform')
    expect(button).toHaveClass('grayscale')
  })
})