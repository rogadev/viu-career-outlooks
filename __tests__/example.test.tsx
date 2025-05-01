import { render, screen } from '@testing-library/react'

describe('Basic test', () => {
  it('should pass a simple equality test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should render text correctly', () => {
    // A very simple render test
    render(<div data-testid='test-element'>Hello, Jest!</div>)
    const element = screen.getByTestId('test-element')
    expect(element).toBeInTheDocument()
    expect(element).toHaveTextContent('Hello, Jest!')
  })
})
