// External library imports - Next.js and React core functionality
import { Metadata } from 'next'
import { Suspense } from 'react'
import type { ReactElement } from 'react'

// Internal component imports - organized alphabetically for maintainability
import Credentials from '@/components/credentials/Credentials'
import InstructionsDropdown from '@/components/InstructionsDropdown'

/**
 * Page-level metadata for SEO and social sharing
 * This metadata is automatically injected into the document head by Next.js App Router
 * Important for search engine optimization and when users share links to this page
 */
export const metadata: Metadata = {
  title: 'Explore VIU Credentials | Vancouver Island University',
  description:
    'Browse diplomas, degrees, certificates, and other credential options at Vancouver Island University. Discover career opportunities and employment outlooks.',
}

/**
 * Static instruction text for the search interface
 * Using 'as const' assertion to ensure TypeScript treats this as a literal type
 * rather than a generic string, which provides better type safety and prevents
 * accidental mutations since instructions should remain constant
 */
const SEARCH_INSTRUCTIONS =
  'Use the search box to filter programs. If no query is entered, all programs will be shown. You can select to display 25, 50, or 100 programs per page. Click on a program for details on career paths and job outlooks.' as const

/**
 * CredentialsPage - Server Component
 *
 * This is a Next.js 15 App Router page component that runs on the server by default.
 * Server components provide several benefits:
 * - Faster initial page load (HTML is pre-rendered on server)
 * - Better SEO (search engines can crawl the full content)
 * - Reduced client-side JavaScript bundle size
 * - Direct access to backend resources (databases, APIs) without additional network calls
 *
 * The page displays a searchable list of VIU's academic credentials with:
 * - Filtering capabilities through the search interface
 * - Pagination options (25, 50, or 100 items per page)
 * - Detailed information about career paths and employment outlooks
 * - Responsive design using TailwindCSS utilities
 * - Progressive loading with React Suspense
 */
export default async function CredentialsPage(): Promise<ReactElement> {
  return (
    <div
      className='container mx-auto px-4 py-8'
      aria-label='Credentials exploration page'
    >
      {/* 
        Semantic HTML: Using <header> for page title and description
        This improves accessibility for screen readers and SEO
        The header provides context for the entire page content
      */}
      <header className='mb-6'>
        <h1 className='text-3xl font-bold mb-4'>Explore Your Options</h1>
        <p className='text-lg text-gray-700 leading-relaxed'>
          Browse diplomas, degrees, certificates, and other credential options
          at Vancouver Island University. Click on a program to discover career
          opportunities and view 3&ndash;year employment outlooks.
        </p>
      </header>

      {/* 
        Semantic HTML: Using <main> for the primary page content
        This helps assistive technologies identify the main content area
        and improves the overall document structure for accessibility
      */}
      <main>
        {/* 
          Instructions section with collapsible dropdown
          Separated into its own section for better content organization
          The spacing classes (pt-3 pb-4) provide visual separation
        */}
        <section className='pt-3 pb-4' aria-label='Search instructions'>
          <InstructionsDropdown instructions={SEARCH_INSTRUCTIONS} />
        </section>

        {/* 
          Credentials listing section with Suspense boundary
          
          Suspense is a React 18+ feature that allows components to "suspend" rendering
          while waiting for asynchronous operations (like data fetching) to complete.
          
          Benefits of using Suspense here:
          1. Provides a loading state while the Credentials component fetches data
          2. Prevents the entire page from blocking while waiting for data
          3. Allows for progressive enhancement - header and instructions show immediately
          4. Improves perceived performance and user experience
          
          The fallback prop defines what to show during the loading state
          In a production app, this could be a more sophisticated loading component
        */}
        <section aria-label='Available credentials'>
          <Suspense
            fallback={
              <div
                className='flex items-center justify-center py-12'
                role='status'
                aria-live='polite'
                aria-label='Loading credentials'
              >
                <div className='text-gray-600'>Loading credentials...</div>
              </div>
            }
          >
            {/* 
              Main credentials component that handles:
              - Data fetching from the API
              - Search and filtering functionality  
              - Pagination controls
              - Individual credential display
              
              This component is likely a client component since it needs
              interactive functionality for search and filtering
            */}
            <Credentials />
          </Suspense>
        </section>
      </main>
    </div>
  )
}
