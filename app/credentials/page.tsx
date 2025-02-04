import { Metadata } from 'next'
import { Suspense } from 'react'
import type { ReactElement } from 'react'
import Credentials from '@/components/credentials/Credentials'
import InstructionsDropdown from '@/components/InstructionsDropdown'

export const metadata: Metadata = {
  title: 'Explore VIU Credentials | Vancouver Island University',
  description:
    'Browse diplomas, degrees, certificates, and other credential options at Vancouver Island University. Discover career opportunities and employment outlooks.',
}

/**
 * CredentialsPage - Server Component
 * Displays a searchable list of VIU's academic credentials (programs, degrees, etc.)
 * with filtering capabilities and detailed information about career paths.
 */
export default async function CredentialsPage(): Promise<ReactElement> {
  // Static instruction text for the search interface
  const instructions =
    'Use the search box to filter programs. If no query is entered, all programs will be shown. You can select to display 25, 50, or 100 programs per page. Click on a program for details on career paths and job outlooks.' as const

  return (
    <div
      className='container mx-auto px-4 py-8'
      aria-label='Credentials exploration page'
    >
      {/* Page Header Section */}
      <header>
        <h1 className='text-3xl font-bold mb-4'>Explore Your Options</h1>
        <p>
          Browse diplomas, degrees, certificates, and other credential options
          at Vancouver Island University. Click on a program to discover career
          opportunities and view 3&ndash;year employment outlooks.
        </p>
      </header>

      {/* Main Content Section */}
      <main>
        <div className='pt-3 pb-4'>
          <InstructionsDropdown instructions={instructions} />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Credentials />
        </Suspense>
      </main>
    </div>
  )
}
