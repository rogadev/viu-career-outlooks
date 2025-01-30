import EconomicRegionSelect from './EconomicRegionSelect'
import { EconomicRegion } from '@prisma/client'

interface RegionSelectorProps {
  regions: EconomicRegion[]
  defaultErc?: string
  value?: string
  onValueChange?: (value: string | null) => void
  className?: string
}

export default function RegionSelector({
  regions,
  defaultErc = '5900',
  value,
  onValueChange,
  className,
}: RegionSelectorProps) {
  return (
    <div className='mb-6'>
      <EconomicRegionSelect
        regions={regions}
        defaultErc={defaultErc}
        value={value}
        onValueChange={onValueChange}
        className={className}
      />
    </div>
  )
}
