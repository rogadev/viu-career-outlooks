'use client'
import { ReactElement, useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import type { Program } from '@prisma/client'
import Link from 'next/link'
import LoadingOutlooks from './LoadingOutlooks'

/**
 * Props interface for the EmploymentOutlooks component
 */
interface EmploymentOutlooksProps {
  program: Program // The program object containing details like nid (node ID)
}

/**
 * Structure of employment outlook data returned from the API
 * Each NOC (National Occupational Classification) result contains:
 * - noc: The NOC code identifier
 * - title: The job/occupation title
 * - outlook: Employment outlook rating (e.g., "very good", "good", etc.)
 * - items: Additional information about the occupation
 */
interface NocResult {
  noc: string
  title: string
  outlook: string
  items: string[]
}

/**
 * Priority mapping for employment outlook ratings
 * Higher numbers indicate better employment prospects
 * Used to sort results with best outlooks appearing first
 */
const OUTLOOK_PRIORITY_MAP: { [key: string]: number } = {
  'very good': 5,
  good: 4,
  moderate: 3,
  limited: 2,
  'very limited': 1,
  undetermined: 0,
} as const

/**
 * Sorts NOC results by employment outlook priority
 * Results with better outlooks (higher priority) appear first
 *
 * @param results - Array of NOC results to sort
 * @returns Sorted array with best outlooks first
 */
const sortResultsByOutlookPriority = (results: NocResult[]): NocResult[] => {
  return [...results].sort((a, b) => {
    const priorityA = OUTLOOK_PRIORITY_MAP[a.outlook.toLowerCase()] || 0
    const priorityB = OUTLOOK_PRIORITY_MAP[b.outlook.toLowerCase()] || 0

    // Sort in descending order (highest priority first)
    return priorityB - priorityA
  })
}

/**
 * Fetches and processes employment outlook data for a specific program
 * Makes an API call to process the program's NOC codes and returns outlook information
 *
 * @param programNid - The node ID of the program
 * @returns Promise resolving to processed NOC results
 */
const fetchEmploymentOutlooks = async (
  programNid: string
): Promise<NocResult[]> => {
  const response = await fetch(`/api/programs/${programNid}/process-outlooks`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch outlooks: ${response.statusText}`)
  }

  const { results } = await response.json()
  return results || []
}

/**
 * EmploymentOutlooks Component
 *
 * Displays employment outlook information for careers related to a specific program.
 * The component:
 * 1. Fetches employment outlook data from the API
 * 2. Sorts results by outlook quality (best outlooks first)
 * 3. Renders each outlook as a clickable card linking to detailed NOC information
 *
 * The data processing happens in the background and shows a loading state
 * while the API processes the program's NOC codes.
 */
export default function EmploymentOutlooks({
  program,
}: EmploymentOutlooksProps): ReactElement {
  // State to store the processed NOC employment outlook data
  const [nocData, setNocData] = useState<NocResult[]>([])

  // Loading state to show spinner while API processes the outlook data
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Effect hook to fetch and process employment outlook data when component mounts
   * or when the program changes. This triggers the background processing of
   * employment outlooks for the current program.
   */
  useEffect(() => {
    const processOutlooks = async (): Promise<void> => {
      try {
        setIsLoading(true)

        // Fetch employment outlook data from our API
        // Note: program.nid is a number from the database, but the API expects a string for the URL path
        const results = await fetchEmploymentOutlooks(String(program.nid))

        // Sort results to show best employment outlooks first
        // This helps users quickly identify the most promising career paths
        const sortedResults = sortResultsByOutlookPriority(results)

        setNocData(sortedResults)
      } catch (error) {
        // Log errors for debugging but don't crash the component
        // In a production app, you might want to show an error state to users
        console.error('Error fetching employment outlooks:', error)

        // Reset to empty array on error so component still renders
        setNocData([])
      } finally {
        // Always stop loading, whether successful or not
        setIsLoading(false)
      }
    }

    processOutlooks()
  }, [program.nid]) // Re-run when program changes

  // Show loading state while API processes the employment outlook data
  if (isLoading) {
    return <LoadingOutlooks />
  }

  return (
    <Card>
      <CardHeader>
        <h2 className='text-2xl font-semibold'>Employment Outlooks</h2>
      </CardHeader>
      <CardContent>
        {nocData.length > 0 ? (
          <div className='space-y-6'>
            {/* Render each NOC result as a clickable card */}
            {nocData.map((noc, index) => (
              <Link
                href={`/noc/${noc.noc}`}
                key={noc.noc}
                className='block hover:bg-muted transition-colors'
              >
                <div id={`noc-${index}`} className='border rounded-lg p-4'>
                  {/* NOC title and code */}
                  <h3 className='text-lg font-semibold mb-2'>
                    {noc.title}{' '}
                    <span className='text-sm text-muted-foreground'>
                      (NOC: {noc.noc})
                    </span>
                  </h3>

                  {/* Employment outlook rating */}
                  <p className='mb-2'>
                    <span className='font-medium'>Outlook:</span> {noc.outlook}
                  </p>

                  {/* Additional information about the occupation (if available) */}
                  {noc.items.length > 0 && (
                    <div>
                      <h4 className='font-medium mb-1'>
                        Additional Information:
                      </h4>
                      <ul className='list-disc list-inside'>
                        {noc.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // Fallback message when no employment outlook data is available
          <p>No employment outlook data available for this program.</p>
        )}
      </CardContent>
    </Card>
  )
}
