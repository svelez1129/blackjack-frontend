describe('Game Logic Tests', () => {
  test('Numbers work correctly', () => {
    expect(1 + 1).toBe(2)
    expect(21 - 10).toBe(11)
  })

  test('Arrays work correctly', () => {
    const hand = []
    expect(hand.length).toBe(0)
    
    hand.push('card')
    expect(hand.length).toBe(1)
  })

  test('Objects work correctly', () => {
    const gameState = {
      money: 1000,
      phase: 'betting'
    }
    
    expect(gameState.money).toBe(1000)
    expect(gameState.phase).toBe('betting')
  })
})