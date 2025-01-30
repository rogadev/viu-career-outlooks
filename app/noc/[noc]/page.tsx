import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import OutlookSection from '@/components/noc/OutlookSection'

interface NocPageProps {
  params: Promise<{ noc: string }>
}

export default async function NocPage({ params }: NocPageProps) {
  const { noc } = await params
  const PREFERRED_REGION = '5900'

  // Get the unit group for this NOC
  const unitGroup = await prisma.unitGroup.findFirst({
    where: { noc },
    include: {
      sections: true,
      outlook: {
        include: {
          economicRegion: true,
        },
      },
    },
  })

  if (!unitGroup) {
    notFound()
  }

  // Get all outlooks for this NOC across regions
  const outlooks = await prisma.outlook.findMany({
    where: { noc },
    select: {
      id: true,
      noc: true,
      economicRegionCode: true,
      title: true,
      outlook: true,
      trends: true,
      releaseDate: true,
      province: true,
      lang: true,
      economicRegion: {
        select: {
          economicRegionName: true,
        },
      },
      unitGroup: {
        select: {
          occupation: true,
        },
      },
    },
    orderBy: [{ outlook: 'desc' }, { economicRegionCode: 'asc' }],
  })

  // Reorder to put preferred region first
  const reorderedOutlooks = [...outlooks].sort((a, b) => {
    if (a.economicRegionCode === PREFERRED_REGION) return -1
    if (b.economicRegionCode === PREFERRED_REGION) return 1
    return 0
  })

  const regions = await prisma.economicRegion.findMany({
    orderBy: {
      economicRegionName: 'asc',
    },
  })

  return (
    <main className='container mx-auto px-4 pt-6 sm:pt-10 space-y-6 sm:space-y-8'>
      {/* Sticky Header Section */}
      <header className='sticky top-0 sm:top-[10px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 py-3 sm:py-4 -mx-4 px-4'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>
              {unitGroup.occupation}
            </h1>
            <p className='text-muted-foreground mt-1 sm:mt-2'>NOC {noc}</p>
          </div>
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
      </header>

      {/* Unit Group Details */}
      <div className='grid gap-4 sm:gap-6'>
        {unitGroup.sections.map((section) => (
          <section key={section.id}>
            <h2 className='text-lg sm:text-xl font-semibold mb-2 sm:mb-3'>
              {section.title}
            </h2>
            <ul className='list-disc pl-4 sm:pl-6 space-y-1.5 sm:space-y-2'>
              {section.items.map((item, index) => (
                <li
                  key={index}
                  className='text-muted-foreground text-sm sm:text-base'
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* Employment Outlooks */}
        <OutlookSection
          outlooks={reorderedOutlooks}
          defaultErc={PREFERRED_REGION}
          regions={regions}
        />
      </div>
    </main>
  )
}

// Generate metadata for the page
export async function generateMetadata({ params }: NocPageProps) {
  const { noc } = await params

  const unitGroup = await prisma.unitGroup.findFirst({
    where: { noc },
    select: { occupation: true },
  })

  if (!unitGroup) {
    return {
      title: `NOC ${noc}`,
      description: `Information about NOC ${noc}`,
    }
  }

  return {
    title: `${unitGroup.occupation} (NOC ${noc})`,
    description: unitGroup.occupation,
  }
}
