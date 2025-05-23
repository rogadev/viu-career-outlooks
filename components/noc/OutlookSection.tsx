'use client'

import type { EconomicRegion } from '@prisma/client'
import { Button } from '@/components/ui/button'
import OutlookTable from '@/components/global/OutlookTable'
import RegionSelector from '@/components/global/RegionSelector'
import { useState, useMemo } from 'react'
import type { OutlookWithRelations } from '@/types/outlook'

/**
 * Props for the OutlookSection component
 */
interface OutlookSectionProps {
  /** Array of employment outlook data with related information */
  outlooks: OutlookWithRelations[]
  /** Default economic region code to pre-select. Can be undefined if no default is desired. */
  defaultErc?: string
  /** Array of available economic regions for the selector dropdown */
  regions: EconomicRegion[]
}

/**
 * Displays employment outlooks with regional filtering capabilities.
 *
 * This component provides:
 * - A dropdown to filter outlooks by economic region
 * - A button to clear the filter and show all regions
 * - A responsive table displaying the filtered outlook data
 *
 * The component uses client-side state to manage the selected region filter
 * and dynamically filters the outlook data based on the user's selection.
 */
export default function OutlookSection({
  outlooks = [],
  defaultErc,
  regions = [],
}: OutlookSectionProps) {
  // Track the currently selected economic region for filtering
  // null means "show all regions", string value means "filter by this region"
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    defaultErc ?? null
  )

  // Memoized filtering to avoid recalculating on every render
  // Only recalculates when outlooks or selectedRegion changes
  const filteredOutlooks = useMemo(() => {
    // If no region is selected, show all outlooks
    if (!selectedRegion) {
      return outlooks
    }

    // Filter to only show outlooks matching the selected economic region code
    return outlooks.filter(
      (outlook) => outlook.economicRegionCode === selectedRegion
    )
  }, [outlooks, selectedRegion])

  // Default region code fallback - represents a common/default economic region
  const DEFAULT_REGION_CODE = '5900'

  return (
    <section className='space-y-4 overflow-x-scroll md:overflow-x-auto'>
      {/* Section header with descriptive title and subtitle */}
      <div className='space-y-2'>
        <h2 className='text-xl font-semibold break-words'>
          Employment Outlooks
        </h2>
        <p className='text-muted-foreground break-words'>
          Current employment outlooks across different regions
        </p>
      </div>

      {/* Filter controls: region selector and clear filter button */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 max-w-full'>
        {/* Region dropdown selector with responsive width */}
        <RegionSelector
          regions={regions}
          defaultErc={defaultErc ?? DEFAULT_REGION_CODE}
          value={selectedRegion ?? ''}
          onValueChange={setSelectedRegion}
          className='w-full sm:w-[300px]'
        />

        {/* Clear filter button - only shown when a region is selected */}
        {selectedRegion && (
          <Button
            variant='outline'
            onClick={() => setSelectedRegion(null)}
            className='w-full sm:w-auto'
            aria-label='Clear region filter to show all regions'
          >
            Show All Regions
          </Button>
        )}
      </div>

      {/* Results table with horizontal scroll on smaller screens */}
      <div className='max-w-full overflow-x-auto'>
        <OutlookTable
          outlooks={filteredOutlooks}
          variant='long'
          aria-label={
            selectedRegion
              ? `Employment outlooks for selected region`
              : 'Employment outlooks for all regions'
          }
        />
      </div>
    </section>
  )
}
