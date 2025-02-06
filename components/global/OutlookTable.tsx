'use client'

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Suspense, useState } from 'react'
import OutlookItem from './OutlookItem'
import OutlookItemSkeleton from './OutlookItemSkeleton'
import { PaginationControl } from './PaginationControl'
import type { OutlookWithRelations } from '@/types/outlook'

interface OutlookTableProps {
  outlooks: OutlookWithRelations[]
  variant?: 'short' | 'long'
  className?: string
  hideColumns?: string[] // Array of column names to hide
  disableClick?: boolean // Add new prop
  itemsPerPage?: number
}

/**
 * OutlookTable component displays a paginated table of outlooks.
 * It allows for customization of the displayed columns and handles pagination.
 *
 * @param {OutlookTableProps} props - The properties for the OutlookTable component.
 * @returns {ReactElement} The rendered OutlookTable component.
 */
const OutlookTable = ({
  outlooks,
  variant = 'long',
  className,
  hideColumns = [], // Default to showing all columns
  disableClick = false, // Default to false, allows disabling click events on items
  itemsPerPage = 10,
}: OutlookTableProps) => {
  const [currentPage, setCurrentPage] = useState(1)

  // If there are no outlooks, display a message
  if (!outlooks?.length) {
    return <div>No outlooks available</div>
  }

  // Calculate pagination details
  const totalPages = Math.ceil(outlooks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOutlooks = outlooks.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const isShort = variant === 'short'

  // Define all possible headers for the table
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

  // Filter out headers that should be hidden based on props
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
                <TableHead
                  key={header}
                  className={cn(
                    header === 'NOC' && 'hidden sm:table-cell',
                    header === 'Economic Region' && 'hidden sm:table-cell'
                  )}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <Suspense
              fallback={
                <>
                  {/* Render skeletons while data is loading */}
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
