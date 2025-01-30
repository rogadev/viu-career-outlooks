'use client'

import { Outlook, EconomicRegion } from '@prisma/client'
import { Button } from '@/components/ui/button'
import OutlookTable from '@/components/global/OutlookTable'
import RegionSelector from '@/components/global/RegionSelector'
import { useState } from 'react'

interface OutlookSectionProps {
  outlooks: Array<
    Omit<Outlook, 'trendsHash'> & {
      economicRegion: {
        economicRegionName: string
      }
      unitGroup: {
        occupation: string
      }
    }
  >
  defaultErc?: string
  regions: EconomicRegion[]
}

export default function OutlookSection({
  outlooks,
  defaultErc,
  regions,
}: OutlookSectionProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    defaultErc ?? null
  )

  const filteredOutlooks = selectedRegion
    ? outlooks.filter((o) => o.economicRegionCode === selectedRegion)
    : outlooks

  return (
    <section className='space-y-4'>
      <h2 className='text-xl font-semibold'>Employment Outlooks</h2>
      <p className='text-muted-foreground'>
        Current employment outlooks across different regions
      </p>

      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4'>
        <RegionSelector
          regions={regions}
          defaultErc={defaultErc ?? '5900'}
          value={selectedRegion ?? ''}
          onValueChange={setSelectedRegion}
          className='w-full sm:w-[300px]'
        />
        {selectedRegion && (
          <Button
            variant='outline'
            onClick={() => setSelectedRegion(null)}
            className='w-full sm:w-auto'
          >
            Show All Regions
          </Button>
        )}
      </div>

      <OutlookTable outlooks={filteredOutlooks} variant='long' />
    </section>
  )
}
