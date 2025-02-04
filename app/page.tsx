import TopEmploymentOutlooks from '@/components/home/TopEmploymentOutlooks'
import RegionSelector from '@/components/global/RegionSelector'
import { cookies } from 'next/headers'
import { DEFAULT_ERC, ERC_COOKIE_NAME } from '@/lib/constants'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function Home() {
  const cookieStore = await cookies()
  const erc = cookieStore.get(ERC_COOKIE_NAME)?.value || DEFAULT_ERC

  // Fetch regions at the page level
  const regions = await prisma.economicRegion.findMany({
    orderBy: {
      economicRegionName: 'asc',
    },
  })

  return (
    <>
      {/* Programs & Careers Grid */}
      <div className='grid gap-8 md:grid-cols-2 mb-12'>
        {/* Credentials Section */}
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

        {/* Career Paths Section */}
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

      {/* Employment Outlook Section */}
      <section>
        <h2 className='text-2xl font-semibold mb-6 text-primary'>
          Employment Outlook
        </h2>

        <RegionSelector regions={regions} defaultErc={erc} />

        <div className='grid gap-8 md:grid-cols-2'>
          {/* Top Opportunities */}
          <div className='p-6 rounded-lg border flex flex-col'>
            <h3 className='text-xl font-semibold mb-4'>Top Opportunities</h3>
            <div className='flex-1'>
              <TopEmploymentOutlooks type='top' erc={erc} />
            </div>
          </div>

          {/* Areas of Concern */}
          <div className='p-6 rounded-lg border flex flex-col'>
            <h3 className='text-xl font-semibold mb-4'>
              Limited Opportunities
            </h3>
            <div className='flex-1'>
              <TopEmploymentOutlooks type='bottom' erc={erc} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
