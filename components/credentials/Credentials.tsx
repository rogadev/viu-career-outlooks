import { ReactElement } from 'react'
import { prisma } from '@/lib/db'
import type { Program, ProgramArea } from '@prisma/client'
import SearchBar from './SearchBar'

/**
 * Type definition for Program with included ProgramArea relation
 * This extends the base Program type to include the programArea relationship
 * for better type safety and IntelliSense support
 */
type ProgramWithArea = Program & {
  programArea: ProgramArea
}

/**
 * Credentials Component
 *
 * This server component serves as the main entry point for the credentials/programs search feature.
 * It handles data fetching from the database and passes the results to the SearchBar component
 * for client-side search functionality.
 *
 * Architecture Overview:
 * 1. Server Component (this) - Fetches data from database using Prisma
 * 2. SearchBar (client) - Handles user interactions and search logic
 * 3. CredentialsTable (client) - Displays the filtered results
 *
 * Data Flow:
 * Database → Credentials (fetch) → SearchBar (search/filter) → CredentialsTable (display)
 *
 * Why this separation?
 * - Server components can directly access the database (better performance, security)
 * - Client components handle interactivity (search, filtering, state management)
 * - This hybrid approach optimizes both initial load and user experience
 *
 * @returns SearchBar component with program credentials data
 * @throws Will render error boundary if database query fails
 */
const Credentials = async (): Promise<ReactElement> => {
  try {
    /**
     * Fetch all programs with their associated program areas
     *
     * Why we include programArea:
     * - The SearchBar component needs program area information for filtering/display
     * - Including it here prevents N+1 query problems (one query vs many)
     * - Prisma's include creates a JOIN under the hood for optimal performance
     *
     * Alternative approaches considered:
     * - Separate API endpoint: Would require client-side data fetching (slower initial load)
     * - Manual JOIN: Prisma's include is more maintainable and type-safe
     * - Lazy loading: Would create loading states and complexity
     */
    const programCredentials: ProgramWithArea[] = await prisma.program.findMany(
      {
        include: {
          programArea: true, // Include the related ProgramArea data
        },
        /**
         * Optional: Add ordering for consistent results
         * Consider adding this if you want predictable ordering:
         * orderBy: {
         *   title: 'asc'
         * }
         */
      }
    )

    /**
     * Pass the fetched data to SearchBar component
     *
     * The SearchBar is a client component that will handle:
     * - User input for searching
     * - Fuzzy search logic using Fuse.js
     * - Real-time filtering of results
     * - Display of filtered results via CredentialsTable
     */
    return <SearchBar programs={programCredentials} />
  } catch (error) {
    /**
     * Error handling for database operations
     *
     * In a production environment, you might want to:
     * 1. Log the error to a monitoring service (Sentry, DataDog, etc.)
     * 2. Return a user-friendly error component
     * 3. Implement retry logic for transient failures
     *
     * For now, we re-throw to trigger Next.js error boundaries
     */
    console.error('Failed to fetch program credentials:', error)

    // Re-throw to trigger error boundary - Next.js will show error.tsx
    throw new Error(
      'Unable to load program credentials. Please try again later.'
    )
  }
}

export default Credentials
