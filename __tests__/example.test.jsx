const { render, screen } = require('@testing-library/react')
const React = require('react')

describe('Basic test', () => {
  it('should pass a simple equality test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should render text correctly', () => {
    // A very simple render test
    render(
      React.createElement(
        'div',
        { 'data-testid': 'test-element' },
        'Hello, Jest!'
      )
    )
    const element = screen.getByTestId('test-element')
    expect(element).toBeInTheDocument()
    expect(element).toHaveTextContent('Hello, Jest!')
  })
})
