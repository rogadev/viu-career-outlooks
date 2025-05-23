import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { ReactElement } from 'react'
import ProgramData from '@/components/programs/ProgramData'
import ProgramInfo from '@/components/programs/ProgramInfo'

/**
 * Props interface for the ProgramPage component
 * In Next.js App Router, dynamic route parameters are passed as a Promise
 * that must be awaited before accessing the parameter values
 */
interface ProgramPageProps {
  params: Promise<{ nid: string }>
}

/**
 * Dynamic page component that displays detailed information for a specific program
 *
 * This page is rendered at the route /programs/[nid] where [nid] is the program's
 * numeric identifier. It fetches the program data from the database and renders
 * it using the ProgramData and ProgramInfo components.
 *
 * @param params - Contains the dynamic route parameter 'nid' (program ID)
 * @returns JSX element containing the program details or triggers notFound()
 */
export default async function ProgramPage({
  params,
}: ProgramPageProps): Promise<ReactElement> {
  // Extract and await the nid parameter from the dynamic route
  // In Next.js 15, params must be awaited before accessing properties
  const { nid } = await params

  // Convert the string nid to a number for database lookup
  // parseInt() converts string to integer, but we need to validate it's a valid number
  const nidNumber = parseInt(nid, 10) // Using base 10 explicitly for clarity

  // Validate that the nid parameter is a valid positive integer
  // This prevents database errors and provides better user experience
  if (isNaN(nidNumber) || nidNumber <= 0) {
    // If nid is not a valid positive number, show 404 page
    notFound()
  }

  // Fetch the program from the database using Prisma ORM
  // findUnique() returns the program if found, or null if not found
  try {
    const program = await prisma.program.findUnique({
      where: {
        nid: nidNumber,
      },
    })

    // If no program is found with the given nid, show the 404 page
    // notFound() is a Next.js function that renders the not-found.tsx page
    if (!program) {
      notFound()
    }

    // Render the program details using the composition pattern
    // ProgramData provides the program context to its children
    // ProgramInfo consumes this context to display program information
    return (
      <ProgramData program={program}>
        <ProgramInfo />
      </ProgramData>
    )
  } catch (error) {
    // If there's a database error or any other unexpected error,
    // log it and show 404 page (could be enhanced to show a specific error page)
    console.error('Error fetching program:', error)
    notFound()
  }
}
