/**
 * Home Page Component
 *
 * This is the main landing page for the VIU Career Outlooks application.
 * It provides navigation to key features and displays employment outlook data
 * based on the user's selected economic region.
 *
 * Key Features:
 * - Browse VIU Credentials section
 * - Explore Career Paths section
 * - Employment Outlook with region-based filtering
 * - Responsive design that works on mobile and desktop
 */

import TopEmploymentOutlooks from '@/components/home/TopEmploymentOutlooks'
import RegionSelector from '@/components/global/RegionSelector'
import { cookies } from 'next/headers'
import { DEFAULT_ERC, ERC_COOKIE_NAME } from '@/lib/constants'
import { prisma } from '@/lib/db'
import Link from 'next/link'

// Reusable button styling to maintain consistency across the page
const BUTTON_CLASSES =
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'

/**
 * Home Page Server Component
 *
 * This is an async server component that:
 * 1. Retrieves the user's preferred economic region from cookies
 * 2. Fetches all available economic regions from the database
 * 3. Renders the home page with region-specific employment data
 *
 * @returns JSX.Element - The complete home page
 */
export default async function Home() {
  // === COOKIE HANDLING ===
  // Retrieve user's selected economic region from cookies
  // This allows the app to remember the user's region preference across sessions
  // If no region is set, we fall back to a default region (DEFAULT_ERC)
  const cookieStore = await cookies()
  const erc = cookieStore.get(ERC_COOKIE_NAME)?.value || DEFAULT_ERC

  // === DATABASE QUERY ===
  // Fetch all economic regions for the region selector dropdown
  // Sorted alphabetically to provide a consistent, user-friendly ordering
  const regions = await prisma.economicRegion.findMany({
    orderBy: {
      economicRegionName: 'asc',
    },
  })

  return (
    <div className='mt-6'>
      {/* === MAIN NAVIGATION SECTION === */}
      {/* 
        Two-column responsive grid layout:
        - Single column on mobile devices (default)
        - Two columns side-by-side on medium screens and up (md:grid-cols-2)
        - Gap between grid items for clean spacing
      */}
      <div className='grid gap-8 md:grid-cols-2 mb-12'>
        {/* CREDENTIALS BROWSING SECTION */}
        <section className='p-6 rounded-lg border'>
          <h2 className='text-2xl font-semibold mb-4 text-primary'>
            Browse VIU Credentials
          </h2>
          <p className='text-muted-foreground mb-4'>
            Explore our programs, courses, diplomas, and degrees.
          </p>
          {/* 
            Link to credentials page using Next.js Link component for client-side navigation
            Uses consistent button styling defined above
          */}
          <Link href='/credentials' className={BUTTON_CLASSES}>
            Browse Credentials
          </Link>
        </section>

        {/* CAREER EXPLORATION SECTION */}
        <section className='p-6 rounded-lg border'>
          <h2 className='text-2xl font-semibold mb-4 text-primary'>
            Explore Career Paths
          </h2>
          <p className='text-muted-foreground mb-4'>
            Find jobs related to VIU programs and their employment outlook.
          </p>
          {/* 
            Link to career paths page
            Same styling as credentials button for consistency
          */}
          <Link href='/career-paths' className={BUTTON_CLASSES}>
            Explore Careers
          </Link>
        </section>
      </div>

      {/* === EMPLOYMENT OUTLOOK SECTION === */}
      <section>
        <h2 className='text-2xl font-semibold mb-6 text-primary'>
          Employment Outlook
        </h2>

        {/* 
          REGION SELECTOR COMPONENT
          - Displays a dropdown for users to select their economic region
          - Updates the erc cookie when user changes region (client-side interaction)
          - Receives all regions from database and current selection as props
        */}
        <RegionSelector regions={regions} defaultErc={erc} />

        {/* 
          EMPLOYMENT OUTLOOK CARDS
          Two-column responsive layout similar to the navigation section above:
          - Single column on mobile for readability
          - Two columns on medium screens and larger
        */}
        <div className='grid gap-8 md:grid-cols-2'>
          {/* TOP OPPORTUNITIES CARD */}
          <div className='p-6 rounded-lg border flex flex-col overflow-x-auto'>
            <h3 className='text-xl font-semibold mb-4'>Top Opportunities</h3>
            {/* 
              Container with flex-1 and min-w-0 to:
              - Take remaining vertical space (flex-1)
              - Allow content to shrink below its minimum width (min-w-0)
              - Handle overflow with horizontal scroll on mobile (overflow-x-auto above)
            */}
            <div className='flex-1 min-w-0'>
              {/* 
                Component displays employment outlook data for jobs with good prospects
                - type='top' filters for best opportunities
                - erc prop provides the selected economic region for filtering
              */}
              <TopEmploymentOutlooks type='top' erc={erc} />
            </div>
          </div>

          {/* LIMITED OPPORTUNITIES CARD */}
          <div className='p-6 rounded-lg border flex flex-col overflow-x-auto'>
            <h3 className='text-xl font-semibold mb-4'>
              Limited Opportunities
            </h3>
            {/* Same container structure as Top Opportunities for consistency */}
            <div className='flex-1 min-w-0'>
              {/* 
                Component displays employment outlook data for jobs with poor prospects
                - type='bottom' filters for limited opportunities
                - erc prop provides the selected economic region for filtering
              */}
              <TopEmploymentOutlooks type='bottom' erc={erc} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
