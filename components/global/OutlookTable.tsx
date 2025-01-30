'use client'

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Outlook } from '@prisma/client'
import { Suspense, useState } from 'react'
import OutlookItem from './OutlookItem'
import OutlookItemSkeleton from './OutlookItemSkeleton'
import { PaginationControl } from './PaginationControl'

interface OutlookTableProps {
  outlooks: (Omit<Outlook, 'trendsHash'> & {
    economicRegion: { economicRegionName: string }
    unitGroup: { occupation: string }
  })[]
  variant?: 'short' | 'long'
  className?: string
  hideColumns?: string[] // Array of column names to hide
  disableClick?: boolean // Add new prop
  itemsPerPage?: number
}

const OutlookTable = ({
  outlooks,
  variant = 'long',
  className,
  hideColumns = [], // Default to showing all columns
  disableClick = false, // Default to false
  itemsPerPage = 10,
}: OutlookTableProps) => {
  const [currentPage, setCurrentPage] = useState(1)

  if (!outlooks?.length) {
    return <div>No outlooks available</div>
  }

  const totalPages = Math.ceil(outlooks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOutlooks = outlooks.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const isShort = variant === 'short'

  // Define all possible headers
  const allHeaders = [
    'NOC',
    'Title',
    'Economic Region',
    'Province',
    'Outlook',
    ...(!isShort
      ? ['Unit Group', 'Release Date', 'Language', 'Region Code']
      : []),
  ]

  // Filter out hidden headers
  const headers = allHeaders.filter(
    (header) => !hideColumns.includes(header.toLowerCase())
  )

  return (
    <div className='flex flex-col h-full justify-between'>
      <div className={cn('w-full overflow-auto', className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <Suspense
              fallback={
                <>
                  {Array(itemsPerPage)
                    .fill(null)
                    .map((_, index) => (
                      <OutlookItemSkeleton
                        key={index}
                        hideColumns={hideColumns}
                      />
                    ))}
                </>
              }
            >
              {paginatedOutlooks.map((outlook) => (
                <OutlookItem
                  key={outlook.id}
                  outlook={outlook}
                  variant={variant}
                  hideColumns={hideColumns}
                  disableClick={disableClick}
                />
              ))}
            </Suspense>
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className='pt-4 pb-1'>
          <PaginationControl
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}

export default OutlookTable
