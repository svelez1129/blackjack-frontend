import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Basic Component Tests', () => {
  test('Button renders and is clickable', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Test Button</Button>)
    
    const button = screen.getByRole('button', { name: 'Test Button' })
    expect(button).toBeInTheDocument()
    
    button.click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('Button can be disabled', () => {
    render(<Button disabled>Disabled Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})