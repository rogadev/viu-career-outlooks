'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

// Define the props interface for the ErrorBoundary component
interface Props {
  children: ReactNode // The child components that will be wrapped and protected
  fallback?: ReactNode // Optional custom fallback UI to show when an error occurs
}

// Define the internal state interface for the ErrorBoundary component
interface State {
  hasError: boolean // Flag to track whether an error has occurred
  error?: Error // Store the actual error object for debugging (optional)
}

/**
 * ErrorBoundary is a React component that catches JavaScript errors anywhere in its
 * child component tree and displays a fallback UI instead of crashing the entire app.
 *
 * IMPORTANT: Error Boundaries MUST be class components because React hooks cannot
 * catch errors that occur during rendering. Only class components can implement
 * the required lifecycle methods (getDerivedStateFromError and componentDidCatch).
 *
 * Error Boundaries catch errors in:
 * - Rendering
 * - Lifecycle methods
 * - Constructors of the whole tree below them
 *
 * Error Boundaries DO NOT catch errors in:
 * - Event handlers (use try-catch instead)
 * - Asynchronous code (setTimeout, promises, etc.)
 * - Server-side rendering
 * - Errors thrown in the error boundary itself
 *
 * @example
 * ```tsx
 * // Basic usage with default fallback UI
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // Usage with custom fallback UI
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    // Initialize state with no error
    this.state = {
      hasError: false,
      error: undefined,
    }
  }

  /**
   * Static lifecycle method that React calls when an error is thrown during rendering.
   * This method is called during the "render" phase, so side effects are not permitted.
   *
   * @param error - The error that was thrown
   * @returns New state object to trigger a re-render with error UI
   */
  public static getDerivedStateFromError(error: Error): State {
    // Log the error for debugging purposes
    // Note: This runs during render phase, so keep logging minimal
    console.error(
      'ErrorBoundary: Error caught during rendering:',
      error.message
    )

    // Return new state that will trigger the error UI to display
    return {
      hasError: true,
      error: error,
    }
  }

  /**
   * Lifecycle method called after an error has been thrown and caught.
   * This method is called during the "commit" phase, so side effects are allowed.
   * Use this for error reporting services, logging, etc.
   *
   * @param error - The error that was thrown
   * @param errorInfo - Object containing information about which component threw the error
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Enhanced error logging with more context for debugging
    console.group('🚨 ErrorBoundary: Detailed Error Report')
    console.error('Error:', error)
    console.error('Error Info:', errorInfo)
    console.error('Component Stack:', errorInfo.componentStack)
    console.error('Error Stack:', error.stack)
    console.groupEnd()

    // In a real application, you would typically send this error to a monitoring service
    // Examples: Sentry, LogRocket, Bugsnag, etc.
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
  }

  /**
   * Method to reset the error state and try rendering the children again.
   * This allows users to recover from errors without refreshing the page.
   */
  private handleReset = (): void => {
    console.log('ErrorBoundary: Resetting error state')
    this.setState({
      hasError: false,
      error: undefined,
    })
  }

  /**
   * Render method that displays either the children or the error fallback UI
   */
  public render(): ReactNode {
    // If an error has occurred, render the fallback UI
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use our default error UI
      return (
        this.props.fallback || (
          <div className='flex flex-col items-center justify-center min-h-[200px] p-8 text-center bg-red-50 border border-red-200 rounded-lg'>
            <div className='mb-4'>
              {/* Error icon for visual feedback */}
              <div className='w-16 h-16 mx-auto mb-4 text-red-500'>
                <svg
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  className='w-full h-full'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.764 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                  />
                </svg>
              </div>

              {/* Error message */}
              <h2 className='text-xl font-semibold text-red-800 mb-2'>
                Oops! Something went wrong
              </h2>

              <p className='text-red-600 mb-6 max-w-md'>
                We encountered an unexpected error. This has been logged and our
                team will look into it.
              </p>
            </div>

            {/* Reset button with better styling and accessibility */}
            <button
              type='button'
              onClick={this.handleReset}
              className='px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200'
              aria-label='Try to reload the component'
            >
              Try Again
            </button>

            {/* Development-only error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='mt-6 text-left'>
                <summary className='cursor-pointer text-sm text-red-700 hover:text-red-800'>
                  View Error Details (Development Only)
                </summary>
                <pre className='mt-2 p-4 bg-red-100 border border-red-300 rounded text-xs text-red-800 overflow-auto max-w-full'>
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        )
      )
    }

    // If no error has occurred, render the children normally
    return this.props.children
  }
}
