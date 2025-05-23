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

// Constants for better maintainability
const DEFAULT_ITEMS_PER_PAGE = 10
const RESPONSIVE_HIDDEN_COLUMNS = {
  NOC: 'hidden sm:table-cell',
  'Economic Region': 'hidden sm:table-cell',
} as const

interface OutlookTableProps {
  /** Array of outlook data to display in the table */
  outlooks: OutlookWithRelations[]
  /** Display variant - 'short' shows fewer columns, 'long' shows all columns */
  variant?: 'short' | 'long'
  /** Additional CSS classes to apply to the table container */
  className?: string
  /** Array of column names to hide (case-insensitive matching) */
  hideColumns?: string[]
  /** When true, disables click events on table rows for non-interactive display */
  disableClick?: boolean
  /** Number of items to display per page for pagination */
  itemsPerPage?: number
}

/**
 * Calculates pagination details for the given data set
 * @param totalItems - Total number of items to paginate
 * @param currentPage - Current active page (1-based)
 * @param itemsPerPage - Number of items per page
 * @returns Object containing pagination calculations
 */
const calculatePagination = (
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  return {
    totalPages,
    startIndex,
    endIndex,
  }
}

/**
 * Generates the table headers based on variant and hidden columns
 * @param variant - Display variant ('short' or 'long')
 * @param hideColumns - Array of column names to hide
 * @returns Array of visible header names
 */
const generateTableHeaders = (
  variant: 'short' | 'long',
  hideColumns: string[]
): string[] => {
  // Base headers that are always available
  const baseHeaders = ['NOC', 'Title', 'Economic Region', 'Province', 'Outlook']

  // Additional headers shown only in 'long' variant
  const extendedHeaders = [
    'Unit Group',
    'Release Date',
    'Language',
    'Region Code',
  ]

  // Combine headers based on variant
  const allHeaders =
    variant === 'short' ? baseHeaders : [...baseHeaders, ...extendedHeaders]

  // Filter out headers that should be hidden (case-insensitive comparison)
  return allHeaders.filter(
    (header) =>
      !hideColumns.some(
        (hiddenCol) => hiddenCol.toLowerCase() === header.toLowerCase()
      )
  )
}

/**
 * OutlookTable component displays a paginated table of career outlooks.
 *
 * Features:
 * - Responsive design with mobile-optimized column visibility
 * - Pagination for large datasets
 * - Customizable column visibility
 * - Loading states with skeleton components
 * - Two display variants (short/long) for different use cases
 *
 * @param props - Component properties
 * @returns Rendered table component with pagination controls
 */
const OutlookTable = ({
  outlooks,
  variant = 'long',
  className,
  hideColumns = [],
  disableClick = false,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
}: OutlookTableProps) => {
  // Track current page for pagination (1-based indexing)
  const [currentPage, setCurrentPage] = useState(1)

  // Early return for empty data - provides clear user feedback
  if (!outlooks?.length) {
    return (
      <div className='flex items-center justify-center p-8 text-muted-foreground'>
        No outlooks available
      </div>
    )
  }

  // Calculate pagination values using extracted utility function
  const { totalPages, startIndex, endIndex } = calculatePagination(
    outlooks.length,
    currentPage,
    itemsPerPage
  )

  // Get the subset of outlooks for the current page
  const paginatedOutlooks = outlooks.slice(startIndex, endIndex)

  // Generate visible headers based on variant and hidden columns
  const visibleHeaders = generateTableHeaders(variant, hideColumns)

  // Determine if pagination controls should be shown
  const shouldShowPagination = totalPages > 1

  return (
    <div className='flex flex-col h-full justify-between'>
      {/* Main table container with responsive overflow handling */}
      <div className={cn('w-full overflow-auto', className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {visibleHeaders.map((header) => (
                <TableHead
                  key={header}
                  className={cn(
                    // Apply responsive hiding for specific columns on mobile
                    RESPONSIVE_HIDDEN_COLUMNS[
                      header as keyof typeof RESPONSIVE_HIDDEN_COLUMNS
                    ]
                  )}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* 
              Suspense wrapper provides loading states for async operations
              This is particularly useful when OutlookItem components might
              have their own async data fetching
            */}
            <Suspense
              fallback={
                <>
                  {/* 
                    Render skeleton placeholders while content is loading
                    Number of skeletons matches the items per page for consistent UI
                  */}
                  {Array.from({ length: itemsPerPage }, (_, index) => (
                    <OutlookItemSkeleton
                      key={`skeleton-${index}`}
                      hideColumns={hideColumns}
                    />
                  ))}
                </>
              }
            >
              {/* Render actual data rows for current page */}
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

      {/* 
        Conditional pagination controls - only shown when there are multiple pages
        Positioned at bottom with consistent spacing
      */}
      {shouldShowPagination && (
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
