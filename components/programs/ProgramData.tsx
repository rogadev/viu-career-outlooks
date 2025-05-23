import { ReactElement } from 'react'
import { type Program } from '@prisma/client'
import { notFound } from 'next/navigation'
import React from 'react'

/**
 * Props for the ProgramData component
 */
interface ProgramDataProps {
  /**
   * The program data to validate and inject into child components.
   * Can be null/undefined when fetched from API calls that don't find a match.
   */
  program: Program | null | undefined
  /**
   * A single React element that will receive the program data as a prop.
   * This follows the "children as function" pattern for data injection.
   */
  children: ReactElement
}

/**
 * Type definition for the props that will be injected into child components
 */
interface InjectedProgramProps {
  program: Program
}

/**
 * A data validation and injection component for program data.
 *
 * This component implements a common Next.js pattern for handling data that might
 * not exist (like when fetching from an API with an invalid ID). It serves two purposes:
 *
 * 1. **Data Validation**: Checks if program data exists, triggers 404 if not
 * 2. **Prop Injection**: Passes validated program data to child components automatically
 *
 * **Why this pattern is useful:**
 * - Centralizes null/undefined checking logic
 * - Prevents child components from having to handle missing data
 * - Provides consistent 404 behavior across the application
 * - Eliminates prop drilling for program data
 *
 * **Usage Example:**
 * ```tsx
 * // In a page component:
 * const program = await fetchProgramById(id) // Might return null
 *
 * return (
 *   <ProgramData program={program}>
 *     <ProgramDetails /> // Will receive 'program' prop automatically
 *   </ProgramData>
 * )
 * ```
 *
 * **Note on naming:** Despite the name "ProgramData", this is actually a wrapper/provider
 * component that validates and injects data rather than displaying it.
 *
 * @param program - Program data to validate (null/undefined will trigger 404)
 * @param children - Single React element that will receive the validated program data
 * @returns The child element with program data injected as a prop
 * @throws Triggers Next.js 404 page via notFound() if program is falsy
 */
export default function ProgramData({
  program,
  children,
}: ProgramDataProps): ReactElement {
  // Guard clause: validate that program data exists
  // This handles cases where:
  // - API returns null for non-existent program IDs
  // - Database queries return undefined
  // - Any other falsy values that indicate missing data
  if (!program) {
    // notFound() is a Next.js App Router function that:
    // 1. Immediately stops component execution
    // 2. Triggers the nearest not-found.tsx page
    // 3. Returns a 404 HTTP status code
    notFound()
  }

  // At this point, TypeScript knows 'program' is defined (non-null/undefined)
  // due to the guard clause above

  // Use React.cloneElement to inject the validated program data into the child
  // This pattern allows us to:
  // - Add props to an existing React element
  // - Maintain the child's original props and behavior
  // - Pass data without requiring the parent to know child component structure
  const enhancedChild = React.cloneElement(children, {
    program,
  } as InjectedProgramProps)

  return enhancedChild
}
