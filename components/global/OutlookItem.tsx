'use client'

import { Outlook } from '@prisma/client'
import { TableCell, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ReactElement } from 'react'

/**
 * Extended Outlook type that includes related data from database joins.
 * This type represents the data structure returned when fetching outlook data
 * with its related economicRegion and unitGroup information.
 */
interface OutlookItemProps {
  /**
   * Outlook data with related entities included via Prisma joins.
   * Excludes 'trendsHash' field for security/performance reasons.
   */
  outlook: Omit<Outlook, 'trendsHash'> & {
    economicRegion: { economicRegionName: string }
    unitGroup: { occupation: string }
  }
  /**
   * Display variant that controls which columns are shown:
   * - 'short': Shows only essential columns (NOC, title, region, province, outlook)
   * - 'long': Shows all available columns including unit group, dates, language, etc.
   */
  variant?: 'short' | 'long'
  /**
   * Array of column identifiers to hide from display.
   * Useful for customizing the table based on context or screen size.
   * Valid values: 'noc', 'title', 'economic region', 'province', 'outlook',
   * 'unit group', 'release date', 'language', 'region code'
   */
  hideColumns?: string[]
  /**
   * When true, disables the click-to-navigate functionality.
   * Useful when the component is used in non-interactive contexts.
   */
  disableClick?: boolean
}

/**
 * Column identifiers used throughout the component.
 * Centralizing these constants prevents typos and makes maintenance easier.
 */
const COLUMN_IDS = {
  NOC: 'noc',
  TITLE: 'title',
  ECONOMIC_REGION: 'economic region',
  PROVINCE: 'province',
  OUTLOOK: 'outlook',
  UNIT_GROUP: 'unit group',
  RELEASE_DATE: 'release date',
  LANGUAGE: 'language',
  REGION_CODE: 'region code',
} as const

/**
 * OutlookItem component displays a single outlook entry in a table row.
 *
 * This component is designed to be flexible and reusable across different
 * contexts where outlook data needs to be displayed. It supports:
 * - Conditional column visibility based on variant and hideColumns props
 * - Click-to-navigate functionality to detailed view pages
 * - Responsive design with some columns hidden on smaller screens
 * - Proper accessibility through semantic HTML and keyboard navigation
 *
 * @param {OutlookItemProps} props - The component props
 * @returns {ReactElement} The rendered table row containing outlook data
 */
export default function OutlookItem({
  outlook,
  variant = 'long',
  hideColumns = [],
  disableClick = false,
}: OutlookItemProps): ReactElement {
  const router = useRouter()

  // Determine if we should show the short variant (fewer columns)
  const isShortVariant = variant === 'short'

  /**
   * Helper function to determine if a column should be displayed.
   * A column is shown if:
   * 1. It's not in the hideColumns array
   * 2. For long-variant-only columns, the variant must be 'long'
   *
   * @param {string} columnId - The identifier for the column to check
   * @param {boolean} isLongVariantOnly - Whether this column only appears in long variant
   * @returns {boolean} True if the column should be displayed
   */
  const shouldShowColumn = (
    columnId: string,
    isLongVariantOnly = false
  ): boolean => {
    const isHidden = hideColumns.includes(columnId)
    const isVariantAllowed = !isLongVariantOnly || !isShortVariant
    return !isHidden && isVariantAllowed
  }

  /**
   * Formats a date to a human-readable string using Canadian locale.
   *
   * Uses 'en-CA' locale to ensure consistent date formatting across the application.
   * The format will be: "Month Day, Year" (e.g., "January 15, 2024")
   *
   * @param {Date} date - The date object to format
   * @returns {string} The formatted date string in Canadian English format
   */
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  /**
   * Handles row click navigation to the detailed outlook page.
   * Only triggers if disableClick is false.
   *
   * @param {React.MouseEvent} event - The click event (currently unused but available for future enhancements)
   */
  const handleRowClick = () => {
    if (!disableClick) {
      // Navigate to the detailed view using the NOC (National Occupational Classification) code
      router.push(`/noc/${outlook.noc}`)
    }
  }

  return (
    <TableRow
      className={cn(
        // Base styles for all rows
        'group transition-colors',
        // Interactive styles only when clicking is enabled
        !disableClick && [
          'cursor-pointer', // Show pointer cursor to indicate clickability
          'hover:bg-muted/50', // Subtle background change on hover
          'focus-within:bg-muted/50', // Accessible focus styling for keyboard navigation
        ]
      )}
      onClick={handleRowClick}
      // Accessibility: Make the row focusable and provide keyboard navigation
      tabIndex={disableClick ? undefined : 0}
      onKeyDown={(e) => {
        // Allow Enter and Space keys to trigger navigation (standard accessibility pattern)
        if (!disableClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleRowClick()
        }
      }}
    >
      {/* NOC (National Occupational Classification) Code Column */}
      {shouldShowColumn(COLUMN_IDS.NOC) && (
        <TableCell className='font-medium hidden sm:table-cell'>
          {outlook.noc}
        </TableCell>
      )}

      {/* Job Title Column - Always visible unless explicitly hidden */}
      {shouldShowColumn(COLUMN_IDS.TITLE) && (
        <TableCell className='font-medium'>{outlook.title}</TableCell>
      )}

      {/* Economic Region Name Column - Hidden on mobile for space */}
      {shouldShowColumn(COLUMN_IDS.ECONOMIC_REGION) && (
        <TableCell className='hidden sm:table-cell'>
          {outlook.economicRegion.economicRegionName}
        </TableCell>
      )}

      {/* Province/Territory Column */}
      {shouldShowColumn(COLUMN_IDS.PROVINCE) && (
        <TableCell>{outlook.province}</TableCell>
      )}

      {/* Employment Outlook Status Column */}
      {shouldShowColumn(COLUMN_IDS.OUTLOOK) && (
        <TableCell className='capitalize'>{outlook.outlook}</TableCell>
      )}

      {/* Long Variant Only Columns - These provide additional detail */}
      {/* Unit Group (Broader occupational category) */}
      {shouldShowColumn(COLUMN_IDS.UNIT_GROUP, true) && (
        <TableCell>{outlook.unitGroup.occupation}</TableCell>
      )}

      {/* Data Release Date */}
      {shouldShowColumn(COLUMN_IDS.RELEASE_DATE, true) && (
        <TableCell>{formatDate(outlook.releaseDate)}</TableCell>
      )}

      {/* Language Code (EN/FR) */}
      {shouldShowColumn(COLUMN_IDS.LANGUAGE, true) && (
        <TableCell className='uppercase font-mono text-sm'>
          {outlook.lang}
        </TableCell>
      )}

      {/* Economic Region Code (for reference/debugging) */}
      {shouldShowColumn(COLUMN_IDS.REGION_CODE, true) && (
        <TableCell className='font-mono text-sm'>
          {outlook.economicRegionCode}
        </TableCell>
      )}
    </TableRow>
  )
}
