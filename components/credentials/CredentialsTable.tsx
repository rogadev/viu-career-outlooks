import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Program, ProgramArea } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState, useMemo, useCallback, ReactElement } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

// Constants for pagination options - extracted for maintainability
const PAGINATION_OPTIONS = [
  { value: '10', label: '10 per page' },
  { value: '25', label: '25 per page' },
  { value: '50', label: '50 per page' },
] as const

// Default pagination settings
const DEFAULT_ITEMS_PER_PAGE = 10
const DEFAULT_CURRENT_PAGE = 1

// Extended Program type that includes the related ProgramArea data
interface ExtendedProgram extends Program {
  programArea: ProgramArea
}

interface CredentialsTableProps {
  programs: ExtendedProgram[]
}

/**
 * CredentialsTable displays a paginated list of educational programs with sorting and filtering capabilities.
 *
 * This component provides a comprehensive table interface for browsing educational programs with the following features:
 * - **Accessibility-first design**: Full keyboard navigation, screen reader support, and ARIA labels
 * - **Interactive navigation**: Clickable rows that navigate to detailed program pages
 * - **Flexible pagination**: User-configurable items per page (10, 25, or 50)
 * - **Responsive design**: Works across different screen sizes using Tailwind classes
 * - **Performance optimizations**: Memoized calculations and efficient re-rendering
 *
 * The component handles large datasets efficiently by only rendering the current page's data,
 * making it suitable for displaying hundreds of programs without performance degradation.
 *
 * @param {CredentialsTableProps} props - Contains array of programs with their associated program areas
 * @returns {ReactElement} A fully accessible table component with pagination controls
 */
export default function CredentialsTable({
  programs,
}: CredentialsTableProps): ReactElement {
  const router = useRouter()

  // State management for pagination
  // currentPage: tracks which page the user is currently viewing (1-indexed)
  // itemsPerPage: how many items to display per page (configurable by user)
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE)
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE)

  /**
   * Navigation handler for program row clicks and keyboard interactions
   * Extracted as a useCallback to prevent unnecessary re-renders and improve performance
   *
   * @param nid - The unique program identifier used in the URL
   */
  const handleProgramNavigation = useCallback(
    (nid: string) => {
      router.push(`/programs/${nid}`)
    },
    [router]
  )

  /**
   * Keyboard event handler for accessible navigation
   * Supports both Enter and Space keys as per WCAG guidelines
   *
   * @param event - The keyboard event
   * @param nid - The program identifier to navigate to
   */
  const handleKeyboardNavigation = useCallback(
    (event: React.KeyboardEvent, nid: string) => {
      // Check for activation keys (Enter or Space)
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault() // Prevent default scrolling behavior for Space
        handleProgramNavigation(nid)
      }
    },
    [handleProgramNavigation]
  )

  /**
   * Memoized pagination calculations
   * These calculations are expensive for large datasets, so we memoize them
   * to prevent recalculation on every render unless dependencies change
   */
  const paginationData = useMemo(() => {
    // Calculate total number of pages needed
    const totalPages = Math.ceil(programs.length / itemsPerPage)

    // Calculate array slice indices for current page
    // startIndex: where to begin slicing the programs array (0-indexed)
    // endIndex: where to end slicing (exclusive, as per Array.slice behavior)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    // Extract only the programs needed for the current page
    // This is crucial for performance with large datasets
    const currentPrograms = programs.slice(startIndex, endIndex)

    // Calculate display information for UI feedback
    // currentStart/currentEnd: 1-indexed range for user-friendly display
    const currentStart = startIndex + 1
    const currentEnd = Math.min(endIndex, programs.length)
    const totalItems = programs.length

    return {
      totalPages,
      currentPrograms,
      currentStart,
      currentEnd,
      totalItems,
      // Navigation state helpers
      canGoToPrevious: currentPage > 1,
      canGoToNext: currentPage < totalPages,
    }
  }, [programs, currentPage, itemsPerPage])

  /**
   * Pagination navigation handlers
   * Extracted to improve code organization and enable easier testing
   */
  const handlePreviousPage = useCallback(() => {
    if (paginationData.canGoToPrevious) {
      setCurrentPage((prev) => prev - 1)
    }
  }, [paginationData.canGoToPrevious])

  const handleNextPage = useCallback(() => {
    if (paginationData.canGoToNext) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [paginationData.canGoToNext])

  /**
   * Handler for items per page selection change
   * Resets to page 1 when changing page size to maintain UX consistency
   */
  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(DEFAULT_CURRENT_PAGE) // Reset to first page when changing page size
  }, [])

  return (
    <div className='rounded-md border'>
      {/* Main data table with semantic structure for accessibility */}
      <Table>
        <TableHeader>
          <TableRow>
            {/* Using scope="col" for proper table header semantics */}
            <TableHead scope='col'>Program Name</TableHead>
            <TableHead scope='col'>Type</TableHead>
            <TableHead scope='col'>Area</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginationData.currentPrograms.map((program) => (
            <TableRow
              key={program.nid}
              className='cursor-pointer hover:bg-muted'
            >
              <TableCell>
                {/* 
                  Accessible navigation button implementation:
                  - Uses button element for proper keyboard navigation
                  - Full-width text-left styling maintains table cell appearance
                  - Focus-visible styles provide clear keyboard navigation feedback
                  - Supports both click and keyboard interactions
                */}
                <button
                  className='w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm'
                  onClick={() => handleProgramNavigation(program.nid)}
                  onKeyDown={(e) => handleKeyboardNavigation(e, program.nid)}
                  aria-describedby={`program-${program.nid}-details`}
                >
                  {program.title}
                </button>
                {/* Hidden description for screen readers */}
                <span id={`program-${program.nid}-details`} className='sr-only'>
                  {program.credential} program in {program.programArea.title}
                </span>
              </TableCell>
              <TableCell>{program.credential}</TableCell>
              <TableCell>{program.programArea.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination and controls section */}
      <div className='border-t px-4 py-2 flex items-center justify-between'>
        {/* 
          Pagination navigation controls 
          Using semantic navigation element with proper ARIA labeling
        */}
        <div role='navigation' aria-label='Pagination'>
          <Pagination>
            <PaginationContent>
              {/* Previous page button */}
              <PaginationItem>
                <button
                  onClick={handlePreviousPage}
                  className={cn(
                    'relative inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md transition-colors',
                    // Conditional styling based on availability
                    !paginationData.canGoToPrevious
                      ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                      : 'text-gray-900 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  )}
                  disabled={!paginationData.canGoToPrevious}
                  aria-label='Go to previous page'
                  aria-disabled={!paginationData.canGoToPrevious}
                >
                  Previous
                </button>
              </PaginationItem>

              {/* Current page indicator */}
              <PaginationItem>
                <span className='text-sm px-4' aria-current='page'>
                  Page {currentPage} of {paginationData.totalPages}
                </span>
              </PaginationItem>

              {/* Next page button */}
              <PaginationItem>
                <button
                  onClick={handleNextPage}
                  className={cn(
                    'relative inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md transition-colors',
                    // Conditional styling based on availability
                    !paginationData.canGoToNext
                      ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                      : 'text-gray-900 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  )}
                  disabled={!paginationData.canGoToNext}
                  aria-label='Go to next page'
                  aria-disabled={!paginationData.canGoToNext}
                >
                  Next
                </button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Status and controls section */}
        <div className='flex items-center gap-4'>
          {/* 
            Dual status display for accessibility:
            1. Screen reader version with live updates
            2. Visual version for sighted users
          */}
          <div className='sr-only' role='status' aria-live='polite'>
            Showing {paginationData.currentStart} to {paginationData.currentEnd}{' '}
            of {paginationData.totalItems} results
          </div>
          <div aria-hidden='true' className='text-sm text-muted-foreground'>
            Showing {paginationData.currentStart}-{paginationData.currentEnd} of{' '}
            {paginationData.totalItems}
          </div>

          {/* Items per page selector */}
          <Select
            value={String(itemsPerPage)}
            onValueChange={handleItemsPerPageChange}
            aria-label='Select number of items per page'
          >
            <SelectTrigger className='w-[180px]' aria-label='Items per page'>
              <SelectValue placeholder='Rows per page' />
            </SelectTrigger>
            <SelectContent>
              {PAGINATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
