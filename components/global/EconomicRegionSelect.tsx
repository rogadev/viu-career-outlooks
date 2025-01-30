'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { EconomicRegion } from '@prisma/client'
import { setPreferredErc } from '@/lib/cookies'

interface EconomicRegionSelectProps {
  regions: EconomicRegion[]
  defaultErc: string
  value?: string
  onValueChange?: (value: string | null) => void
  className?: string
}

export default function EconomicRegionSelect({
  regions,
  defaultErc,
  value,
  onValueChange,
  className,
}: EconomicRegionSelectProps) {
  const router = useRouter()

  const handleRegionChange = async (value: string) => {
    await setPreferredErc(value)
    router.refresh()
  }

  if (!regions?.length) {
    return null // or return a loading state
  }

  return (
    <Select
      value={value}
      onValueChange={async (val) => {
        await handleRegionChange(val)
        onValueChange?.(val)
      }}
      defaultValue={defaultErc}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder='Select a region' />
      </SelectTrigger>
      <SelectContent>
        {regions.map((region) => (
          <SelectItem
            key={region.economicRegionCode}
            value={region.economicRegionCode}
          >
            {region.economicRegionName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
