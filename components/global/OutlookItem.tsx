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

/**
 * OutlookItem component displays a single outlook entry in a table row.
 * It allows for conditional rendering of columns based on the provided props.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.outlook - The outlook data to display.
 * @param {string} [props.variant='long'] - The display variant ('short' or 'long').
 * @param {string[]} [props.hideColumns=[]] - Array of column identifiers to hide.
 * @param {boolean} [props.disableClick=false] - If true, disables row click functionality.
 * @returns {ReactElement} The rendered OutlookItem component.
 */
export default function OutlookItem({
  outlook,
  variant = 'long',
  hideColumns = [],
  disableClick = false,
}: OutlookItemProps) {
  const router = useRouter()
  const isShort = variant === 'short'

  /**
   * Formats a date to a localized string in 'en-CA' format.
   *
   * @param {Date} date - The date to format.
   * @returns {string} The formatted date string.
   */
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
      {/* Conditionally render the NOC column if not hidden */}
      {!hideColumns.includes('noc') && (
        <TableCell className='font-medium hidden sm:table-cell'>
          {outlook.noc}
        </TableCell>
      )}
      {/* Render the title column */}
      {!hideColumns.includes('title') && <TableCell>{outlook.title}</TableCell>}
      {/* Conditionally render the economic region column if not hidden */}
      {!hideColumns.includes('economic region') && (
        <TableCell className='hidden sm:table-cell'>
          {outlook.economicRegion.economicRegionName}
        </TableCell>
      )}
      {/* Render the province column */}
      {!hideColumns.includes('province') && (
        <TableCell>{outlook.province}</TableCell>
      )}
      {/* Render the outlook status column */}
      {!hideColumns.includes('outlook') && (
        <TableCell className='capitalize'>{outlook.outlook}</TableCell>
      )}
      {/* Render additional columns for the 'long' variant */}
      {!isShort && (
        <>
          {/* Conditionally render the unit group column if not hidden */}
          {!hideColumns.includes('unit group') && (
            <TableCell>{outlook.unitGroup.occupation}</TableCell>
          )}
          {/* Conditionally render the release date column if not hidden */}
          {!hideColumns.includes('release date') && (
            <TableCell>{formatDate(outlook.releaseDate)}</TableCell>
          )}
          {/* Conditionally render the language column if not hidden */}
          {!hideColumns.includes('language') && (
            <TableCell className='uppercase'>{outlook.lang}</TableCell>
          )}
          {/* Conditionally render the economic region code column if not hidden */}
          {!hideColumns.includes('region code') && (
            <TableCell>{outlook.economicRegionCode}</TableCell>
          )}
        </>
      )}
    </TableRow>
  )
}
