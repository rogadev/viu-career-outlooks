'use client'

import { Outlook } from '@prisma/client'
import { TableCell, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface OutlookItemProps {
  outlook: Omit<Outlook, 'trendsHash'> & {
    economicRegion: { economicRegionName: string }
    unitGroup: { occupation: string }
  }
  variant?: 'short' | 'long'
  hideColumns?: string[]
  disableClick?: boolean
}

export default function OutlookItem({
  outlook,
  variant = 'long',
  hideColumns = [],
  disableClick = false,
}: OutlookItemProps) {
  const router = useRouter()
  const isShort = variant === 'short'

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <TableRow
      className={cn(
        'group transition-colors',
        !disableClick &&
          'cursor-pointer hover:bg-muted/50 focus-within:bg-muted/50'
      )}
      onClick={
        !disableClick ? () => router.push(`/noc/${outlook.noc}`) : undefined
      }
    >
      {!hideColumns.includes('noc') && (
        <TableCell className='font-medium'>{outlook.noc}</TableCell>
      )}
      {!hideColumns.includes('title') && <TableCell>{outlook.title}</TableCell>}
      {!hideColumns.includes('economic region') && (
        <TableCell>{outlook.economicRegion.economicRegionName}</TableCell>
      )}
      {!hideColumns.includes('province') && (
        <TableCell>{outlook.province}</TableCell>
      )}
      {!hideColumns.includes('outlook') && (
        <TableCell className='capitalize'>{outlook.outlook}</TableCell>
      )}
      {!isShort && (
        <>
          {!hideColumns.includes('unit group') && (
            <TableCell>{outlook.unitGroup.occupation}</TableCell>
          )}
          {!hideColumns.includes('release date') && (
            <TableCell>{formatDate(outlook.releaseDate)}</TableCell>
          )}
          {!hideColumns.includes('language') && (
            <TableCell className='uppercase'>{outlook.lang}</TableCell>
          )}
          {!hideColumns.includes('region code') && (
            <TableCell>{outlook.economicRegionCode}</TableCell>
          )}
        </>
      )}
    </TableRow>
  )
}
