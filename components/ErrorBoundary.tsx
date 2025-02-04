'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * ErrorBoundary catches JavaScript errors anywhere in its child component tree
 * and displays a fallback UI instead of the component tree that crashed.
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  /**
   * Static method called when an error is thrown in a child component.
   * Updates the state to trigger the fallback UI.
   */
  public static getDerivedStateFromError(e: Error): State {
    console.error('ErrorBoundary caught an error:', { cause: e })
    return { hasError: true }
  }

  /**
   * Lifecycle method called after an error has been thrown in a child component.
   * Logs detailed error information for debugging purposes.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // Return custom fallback if provided, otherwise use default
      return (
        this.props.fallback || (
          <div className='p-4 text-center'>
            <h2 className='text-xl font-semibold mb-4'>
              Oops, there is an error!
            </h2>
            <button
              type='button'
              onClick={() => this.setState({ hasError: false })}
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
            >
              Try again?
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
