import { ReactElement } from 'react'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import OutlookSection from '@/components/noc/OutlookSection'
import { OutlookWithRelations } from '@/types/outlook'

// NOC Page component props interface
interface NocPageProps {
  params: Promise<{ noc: string }>
}

// Constants
const PREFERRED_REGION_CODE = '5900' // British Columbia and Territories - prioritized in outlook display

/**
 * Fetches the unit group data for a specific NOC code
 * Unit groups contain occupation details and related sections (duties, requirements, etc.)
 */
async function getUnitGroupData(noc: string) {
  const unitGroup = await prisma.unitGroup.findFirst({
    where: { noc },
    include: {
      // Include all related sections (job duties, requirements, etc.)
      sections: true,
      // Include outlook data with economic region information
      outlook: {
        include: {
          economicRegion: true,
        },
      },
    },
  })

  if (!unitGroup) {
    return null
  }

  // Reverse sections order to display in preferred sequence
  // (typically to show most important information first)
  unitGroup.sections = unitGroup.sections.reverse()

  return unitGroup
}

/**
 * Fetches all employment outlook data for a specific NOC across different economic regions
 * This includes job market trends, employment prospects, and related program information
 */
async function getEmploymentOutlooks(noc: string) {
  const outlooks = await prisma.outlook.findMany({
    where: { noc },
    select: {
      // Basic outlook information
      id: true,
      noc: true,
      economicRegionCode: true,
      title: true,
      outlook: true, // Employment outlook rating (e.g., "Good", "Fair", "Limited")
      trends: true, // Market trends description
      releaseDate: true,
      province: true,
      lang: true,
      programNid: true, // Link to related educational programs
      // Related economic region name
      economicRegion: {
        select: {
          economicRegionName: true,
        },
      },
      // Related occupation title
      unitGroup: {
        select: {
          occupation: true,
        },
      },
    },
    // Sort by outlook rating (best first), then by region code
    orderBy: [{ outlook: 'desc' }, { economicRegionCode: 'asc' }],
  })

  return outlooks
}

/**
 * Reorders outlook data to prioritize a specific economic region
 * This ensures the most relevant regional data appears first in the list
 */
function prioritizeRegionalOutlook(
  outlooks: OutlookWithRelations[],
  preferredRegionCode: string
) {
  return [...outlooks].sort((a, b) => {
    // Move preferred region to the top
    if (a.economicRegionCode === preferredRegionCode) return -1
    if (b.economicRegionCode === preferredRegionCode) return 1
    return 0 // Maintain existing order for non-preferred regions
  })
}

/**
 * Fetches all economic regions for the outlook selector
 */
async function getEconomicRegions() {
  return await prisma.economicRegion.findMany({
    orderBy: {
      economicRegionName: 'asc',
    },
  })
}

/**
 * NOC (National Occupational Classification) Page Component
 *
 * Displays detailed information about a specific occupation including:
 * - Job duties and requirements
 * - Employment outlooks across different regions
 * - Related educational programs
 *
 * @param params - Route parameters containing the NOC code
 * @returns React component displaying NOC details
 */
export default async function NocPage({
  params,
}: NocPageProps): Promise<ReactElement> {
  // Extract NOC code from route parameters
  const { noc } = await params

  // Fetch all required data in parallel for better performance
  const [unitGroup, outlooks, regions] = await Promise.all([
    getUnitGroupData(noc),
    getEmploymentOutlooks(noc),
    getEconomicRegions(),
  ])

  // Return 404 if NOC code doesn't exist
  if (!unitGroup) {
    notFound()
  }

  // Prioritize preferred region in outlook display
  const prioritizedOutlooks = prioritizeRegionalOutlook(
    outlooks,
    PREFERRED_REGION_CODE
  )

  return (
    <main className='w-full'>
      {/* Sticky Header Section */}
      {/* 
        Remains visible while scrolling to provide context and easy navigation
        Uses backdrop blur for modern glass-morphism effect
      */}
      <div className='sticky top-0 sm:top-[10px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 py-3 sm:py-4 w-full'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0'>
            {/* Occupation Title and NOC Code */}
            <div className='overflow-hidden'>
              <h1 className='text-2xl sm:text-3xl font-bold tracking-tight break-words'>
                {unitGroup.occupation}
              </h1>
              <p className='text-muted-foreground mt-1 sm:mt-2'>NOC {noc}</p>
            </div>

            {/* Navigation Back Button */}
            <Button
              variant='outline'
              size='sm'
              asChild
              className='w-full sm:w-auto'
            >
              <Link href='/' className='flex items-center gap-2'>
                <ArrowLeft className='h-4 w-4' />
                Back
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className='container mx-auto px-4 pt-6 sm:pt-10'>
        <div className='max-w-full'>
          <div className='grid gap-4 sm:gap-6'>
            {/* Unit Group Details Sections */}
            {/* 
              Displays various aspects of the occupation such as:
              - Main duties and responsibilities
              - Employment requirements
              - Additional information
            */}
            {unitGroup.sections.map((section) => (
              <section key={section.id}>
                <h2 className='text-lg sm:text-xl font-semibold mb-2 sm:mb-3 break-words'>
                  {section.title}
                </h2>
                <ul className='list-disc pl-4 sm:pl-6 space-y-1.5 sm:space-y-2'>
                  {section.items.map((item, index) => (
                    <li
                      key={index}
                      className='text-muted-foreground text-sm sm:text-base break-words pr-4'
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {/* Employment Outlooks Section */}
            {/* 
              Interactive component that displays employment prospects 
              across different economic regions with filtering capabilities
            */}
            <OutlookSection
              outlooks={prioritizedOutlooks.map((outlook) => ({
                ...outlook,
                // Ensure programNid is properly typed (handle potential null values)
                programNid: outlook.programNid ?? null,
              }))}
              defaultErc={PREFERRED_REGION_CODE}
              regions={regions}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

/**
 * Generates dynamic metadata for SEO and browser tab display
 * Creates descriptive titles and descriptions based on the occupation data
 *
 * @param params - Route parameters containing the NOC code
 * @returns Metadata object for Next.js head management
 */
export async function generateMetadata({ params }: NocPageProps) {
  const { noc } = await params

  // Fetch minimal data needed for metadata generation
  const unitGroup = await prisma.unitGroup.findFirst({
    where: { noc },
    select: { occupation: true },
  })

  // Fallback metadata if NOC doesn't exist
  if (!unitGroup) {
    return {
      title: `NOC ${noc}`,
      description: `Information about NOC ${noc}`,
    }
  }

  // Generate descriptive metadata using occupation name
  return {
    title: `${unitGroup.occupation} (NOC ${noc})`,
    description: unitGroup.occupation,
  }
}
