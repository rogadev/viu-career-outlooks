import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

interface OutlookItemSkeletonProps {
  hideColumns?: string[]
}

export default function OutlookItemSkeleton({
  hideColumns = [],
}: OutlookItemSkeletonProps) {
  return (
    <TableRow>
      {!hideColumns.includes('noc') && (
        <TableCell>
          <Skeleton className='h-4 w-16' /> {/* NOC */}
        </TableCell>
      )}
      {!hideColumns.includes('title') && (
        <TableCell>
          <Skeleton className='h-4 w-40' /> {/* Title */}
        </TableCell>
      )}
      {!hideColumns.includes('economic region') && (
        <TableCell>
          <Skeleton className='h-4 w-32' /> {/* Economic Region */}
        </TableCell>
      )}
      {!hideColumns.includes('province') && (
        <TableCell>
          <Skeleton className='h-4 w-8' /> {/* Province */}
        </TableCell>
      )}
      {!hideColumns.includes('outlook') && (
        <TableCell>
          <Skeleton className='h-4 w-24' /> {/* Outlook */}
        </TableCell>
      )}
      {!hideColumns.includes('unit group') && (
        <TableCell>
          <Skeleton className='h-4 w-48' />
        </TableCell>
      )}
      {!hideColumns.includes('release date') && (
        <TableCell>
          <Skeleton className='h-4 w-24' />
        </TableCell>
      )}
      {!hideColumns.includes('language') && (
        <TableCell>
          <Skeleton className='h-4 w-8' />
        </TableCell>
      )}
      {!hideColumns.includes('region code') && (
        <TableCell>
          <Skeleton className='h-4 w-16' />
        </TableCell>
      )}
    </TableRow>
  )
}
