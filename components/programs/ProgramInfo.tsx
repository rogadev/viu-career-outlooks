import { ReactElement } from 'react'
import EmploymentOutlooks from './EmploymentOutlooks'
import type { Program, ProgramArea } from '@prisma/client'

/**
 * Props interface for the ProgramInfo component
 *
 * @interface ProgramInfoProps
 * @property {Program & { programArea: ProgramArea }} [program] - Optional program data with related area info
 *   - Uses Prisma's generated types for type safety
 *   - The intersection type (&) combines Program with its related ProgramArea
 *   - Optional (?) because the component can handle cases where program data isn't loaded yet
 */
interface ProgramInfoProps {
  program?: Program & {
    programArea: ProgramArea
  }
}

/**
 * ProgramInfo Component
 *
 * Displays detailed information about a specific academic program, including
 * the program title, ID, and employment outlook data. This is typically used
 * on program detail pages.
 *
 * Features:
 * - Handles loading states gracefully with early return
 * - Responsive container layout with consistent spacing
 * - Semantic HTML structure for accessibility
 * - Displays program metadata in a clear hierarchy
 *
 * @param {ProgramInfoProps} props - Component props
 * @returns {ReactElement | null} The rendered component or null if no program data
 */
export default function ProgramInfo({
  program,
}: ProgramInfoProps): ReactElement | null {
  // Early return pattern: If no program data is provided, render nothing
  // This prevents errors and handles loading/error states gracefully
  if (!program) return null

  // Extract repeated CSS classes to constants for maintainability
  // This makes it easier to update styling consistently across the component
  const containerClasses = 'container mx-auto'

  return (
    // Main semantic container for the program information section
    <section aria-labelledby='program-title'>
      {/* Header section containing the program's primary information */}
      <header className={`${containerClasses} py-8`}>
        {/* Primary heading: The program's display title */}
        <h1 id='program-title' className='text-3xl font-bold mb-2'>
          {program.title}
        </h1>

        {/* Secondary heading: The program's unique identifier */}
        {/* Note: Converting nid to string to ensure consistent display format */}
        <h2 className='text-xl font-bold mb-6'>
          Program ID: {program.nid.toString()}
        </h2>
      </header>

      {/* Content section containing additional program details */}
      <div className={containerClasses}>
        {/* 
          EmploymentOutlooks component displays career and employment data
          - Receives the full program object including related programArea data
          - Handles its own rendering logic and data display
        */}
        <EmploymentOutlooks program={program} />
      </div>
    </section>
  )
}
