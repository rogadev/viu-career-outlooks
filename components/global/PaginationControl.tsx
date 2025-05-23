'use client'

import { ReactElement } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

/**
 * Props interface for the PaginationControl component
 */
interface PaginationControlProps {
  /** The currently active page number (1-based) */
  currentPage: number
  /** Total number of pages available */
  totalPages: number
  /** Callback function called when user selects a different page */
  onPageChange: (page: number) => void
  /** Number of pages to show around the current page (default: 2) */
  siblingCount?: number
}

/**
 * A reusable pagination component that displays page navigation controls.
 *
 * Features:
 * - Shows first page, last page, and pages around the current page
 * - Displays ellipsis (...) when there are gaps in page numbers
 * - Includes previous/next navigation buttons
 * - Handles edge cases (first page, last page, few total pages)
 * - Fully accessible with proper ARIA attributes
 *
 * @param currentPage - The currently active page (1-based indexing)
 * @param totalPages - Total number of pages available
 * @param onPageChange - Function called when user navigates to a different page
 * @param siblingCount - Number of pages to show on each side of current page (default: 2)
 */
export function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 2,
}: PaginationControlProps): ReactElement {
  /**
   * Generates an array of page numbers and ellipsis indicators to display.
   *
   * Algorithm:
   * 1. Always include page 1 (if it exists)
   * 2. Include pages within siblingCount range of current page
   * 3. Always include the last page (if it exists and different from page 1)
   * 4. Add ellipsis indicators where there are gaps
   *
   * Examples:
   * - totalPages: 10, currentPage: 5, siblingCount: 2
   *   Result: [1, "...", 3, 4, 5, 6, 7, "...", 10]
   * - totalPages: 5, currentPage: 3, siblingCount: 2
   *   Result: [1, 2, 3, 4, 5] (no ellipsis needed)
   */
  const getPageNumbers = (): (number | string)[] => {
    // Handle edge cases where pagination isn't needed
    if (totalPages <= 1) return []

    // If we have few pages, show them all
    if (totalPages <= 2 * siblingCount + 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Calculate the range of pages to show around current page
    const leftSibling = Math.max(currentPage - siblingCount, 1)
    const rightSibling = Math.min(currentPage + siblingCount, totalPages)

    // Determine if we need ellipsis on the left or right
    const shouldShowLeftEllipsis = leftSibling > 2
    const shouldShowRightEllipsis = rightSibling < totalPages - 1

    const pages: (number | string)[] = []

    // Always include first page
    pages.push(1)

    // Add left ellipsis if there's a gap
    if (shouldShowLeftEllipsis) {
      pages.push('...')
    }

    // Add the range of pages around current page
    // Skip page 1 if it's already included
    for (let page = leftSibling; page <= rightSibling; page++) {
      if (page !== 1 && page !== totalPages) {
        pages.push(page)
      }
    }

    // Add right ellipsis if there's a gap
    if (shouldShowRightEllipsis) {
      pages.push('...')
    }

    // Always include last page (if it's different from first page)
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  // Generate the page numbers to display
  const pages = getPageNumbers()

  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) {
    return <div></div>
  }

  /**
   * Handle page navigation with bounds checking
   */
  const handlePageChange = (newPage: number): void => {
    // Ensure the new page is within valid bounds
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      onPageChange(newPage)
    }
  }

  /**
   * Handle click events for pagination links
   * Prevents default anchor behavior and calls page change handler
   */
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    page: number
  ): void => {
    e.preventDefault()
    handlePageChange(page)
  }

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous page button */}
        <PaginationItem>
          <PaginationPrevious
            href='#'
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(currentPage - 1)
            }}
            // Disable the button visually and functionally when on first page
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {/* Page number buttons and ellipsis */}
        {pages.map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {page === '...' ? (
              // Ellipsis indicator for gaps in page numbers
              <PaginationEllipsis />
            ) : (
              // Clickable page number
              <PaginationLink
                href='#'
                isActive={page === currentPage}
                onClick={(e) => handleLinkClick(e, page as number)}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next page button */}
        <PaginationItem>
          <PaginationNext
            href='#'
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(currentPage + 1)
            }}
            // Disable the button visually and functionally when on last page
            aria-disabled={currentPage >= totalPages}
            className={
              currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
