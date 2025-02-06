'use client'

import type { EconomicRegion } from '@prisma/client'
import { Button } from '@/components/ui/button'
import OutlookTable from '@/components/global/OutlookTable'
import RegionSelector from '@/components/global/RegionSelector'
import { useState } from 'react'
import type { OutlookWithRelations } from '@/types/outlook'

interface OutlookSectionProps {
  outlooks: OutlookWithRelations[]
  defaultErc: string
  regions: EconomicRegion[]
}

export default function OutlookSection({
  outlooks = [],
  defaultErc,
  regions = [],
}: OutlookSectionProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    defaultErc ?? null
  )

  const filteredOutlooks = outlooks.filter((outlook) => {
    if (!selectedRegion) return true
    return outlook.economicRegionCode === selectedRegion
  })

  return (
    <section className='space-y-4 overflow-x-scroll md:overflow-x-auto'>
      <h2 className='text-xl font-semibold break-words'>Employment Outlooks</h2>
      <p className='text-muted-foreground break-words'>
        Current employment outlooks across different regions
      </p>

      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 max-w-full'>
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

      <div className='max-w-full overflow-x-auto'>
        <OutlookTable outlooks={filteredOutlooks} variant='long' />
      </div>
    </section>
  )
}
