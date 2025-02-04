import TopEmploymentOutlooks from '@/components/home/TopEmploymentOutlooks'
import RegionSelector from '@/components/global/RegionSelector'
import { cookies } from 'next/headers'
import { DEFAULT_ERC, ERC_COOKIE_NAME } from '@/lib/constants'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function Home() {
  // Retrieve user's selected economic region from cookies, falling back to default if not set
  const cookieStore = await cookies()
  const erc = cookieStore.get(ERC_COOKIE_NAME)?.value || DEFAULT_ERC

  // Fetch all economic regions for the selector, sorted alphabetically
  const regions = await prisma.economicRegion.findMany({
    orderBy: {
      economicRegionName: 'asc',
    },
  })

  return (
    <div className='mt-6'>
      {/* Main content is organized in a responsive grid layout */}
      <div className='grid gap-8 md:grid-cols-2 mb-12'>
        <section className='p-6 rounded-lg border'>
          <h2 className='text-2xl font-semibold mb-4 text-primary'>
            Browse VIU Credentials
          </h2>
          <p className='text-muted-foreground mb-4'>
            Explore our programs, courses, diplomas, and degrees.
          </p>
          <Link
            href='/credentials'
            className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
          >
            Browse Credentials
          </Link>
        </section>

        <section className='p-6 rounded-lg border'>
          <h2 className='text-2xl font-semibold mb-4 text-primary'>
            Explore Career Paths
          </h2>
          <p className='text-muted-foreground mb-4'>
            Find jobs related to VIU programs and their employment outlook.
          </p>
          <Link
            href='/career-paths'
            className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
          >
            Explore Careers
          </Link>
        </section>
      </div>

      <section>
        <h2 className='text-2xl font-semibold mb-6 text-primary'>
          Employment Outlook
        </h2>

        {/* RegionSelector updates the erc cookie when user changes region */}
        <RegionSelector regions={regions} defaultErc={erc} />

        {/* Employment outlook cards use overflow-x-auto to handle long content on mobile */}
        <div className='grid gap-8 md:grid-cols-2'>
          <div className='p-6 rounded-lg border flex flex-col overflow-x-auto'>
            <h3 className='text-xl font-semibold mb-4'>Top Opportunities</h3>
            <div className='flex-1 min-w-0'>
              <TopEmploymentOutlooks type='top' erc={erc} />
            </div>
          </div>

          <div className='p-6 rounded-lg border flex flex-col overflow-x-auto'>
            <h3 className='text-xl font-semibold mb-4'>
              Limited Opportunities
            </h3>
            <div className='flex-1 min-w-0'>
              <TopEmploymentOutlooks type='bottom' erc={erc} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
