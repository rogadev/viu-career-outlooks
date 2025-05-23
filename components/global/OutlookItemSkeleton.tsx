import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'
import { ReactElement } from 'react'

/**
 * Configuration for each table column that can be rendered as a skeleton
 * Each entry defines the column identifier, display width, and description
 *
 * The widths are carefully chosen to approximate typical content sizes:
 * - NOC codes: w-16 (64px) - typically 4-5 digit codes
 * - Titles: w-40 (160px) - job titles vary but this covers most
 * - Economic regions: w-32 (128px) - region names of moderate length
 * - Provinces: w-8 (32px) - 2-letter abbreviations (BC, ON, etc.)
 * - Outlook: w-24 (96px) - short status text (Good, Fair, Limited)
 * - Unit groups: w-48 (192px) - longer descriptive text
 * - Release dates: w-24 (96px) - formatted date strings
 * - Language: w-8 (32px) - 2-letter codes (EN, FR)
 * - Region codes: w-16 (64px) - numeric identifiers
 */
const COLUMN_DEFINITIONS = [
  {
    key: 'noc',
    width: 'w-16',
    description: 'National Occupational Classification code',
  },
  {
    key: 'title',
    width: 'w-40',
    description: 'Job title or occupation name',
  },
  {
    key: 'economic region',
    width: 'w-32',
    description: 'Economic region identifier',
  },
  {
    key: 'province',
    width: 'w-8',
    description: 'Province abbreviation',
  },
  {
    key: 'outlook',
    width: 'w-24',
    description: 'Employment outlook rating',
  },
  {
    key: 'unit group',
    width: 'w-48',
    description: 'Occupational unit group classification',
  },
  {
    key: 'release date',
    width: 'w-24',
    description: 'Data release date',
  },
  {
    key: 'language',
    width: 'w-8',
    description: 'Language code (EN/FR)',
  },
  {
    key: 'region code',
    width: 'w-16',
    description: 'Numeric region identifier',
  },
] as const

/**
 * Type-safe column keys derived from the column definitions
 * This ensures that only valid column keys can be used in hideColumns
 */
type ColumnKey = (typeof COLUMN_DEFINITIONS)[number]['key']

interface OutlookItemSkeletonProps {
  /**
   * Array of column keys to hide from the skeleton row
   *
   * This is useful for:
   * - Responsive design (hide columns on mobile)
   * - Different table configurations
   * - Matching the actual data table's visible columns
   *
   * @example ['province', 'language'] // Hide province and language columns
   * @default [] // Show all columns by default
   */
  hideColumns?: ColumnKey[]
}

/**
 * OutlookItemSkeleton - Loading skeleton component for career outlook table rows
 *
 * This component renders a skeleton placeholder row that matches the structure
 * of actual data rows in the career outlooks table. It provides visual feedback
 * during data loading and maintains layout stability to prevent content shifts.
 *
 * Key features:
 * - Matches the column structure of the real data table
 * - Configurable column visibility via hideColumns prop
 * - Optimized widths that approximate actual content dimensions
 * - Accessible with proper ARIA labels
 * - Type-safe column key validation
 *
 * Usage:
 * ```tsx
 * // Show all columns
 * <OutlookItemSkeleton />
 *
 * // Hide specific columns for mobile view
 * <OutlookItemSkeleton hideColumns={['economic region', 'unit group']} />
 * ```
 *
 * @param hideColumns - Optional array of column keys to exclude from rendering
 * @returns A table row with skeleton placeholders for visible columns
 */
export default function OutlookItemSkeleton({
  hideColumns = [],
}: OutlookItemSkeletonProps): ReactElement {
  // Convert hideColumns array to Set for O(1) lookup performance
  // This optimization is especially beneficial when rendering many skeleton rows
  // as it avoids O(n) array.includes() calls for each column check
  const hiddenColumnsSet = new Set(hideColumns)

  return (
    <TableRow>
      {COLUMN_DEFINITIONS.map(({ key, width, description }) => {
        // Skip rendering this column if it's marked as hidden
        // Using Set.has() provides O(1) lookup vs O(n) for array.includes()
        if (hiddenColumnsSet.has(key)) {
          return null
        }

        return (
          <TableCell key={key}>
            {/* 
              Skeleton placeholder with consistent height and column-specific width
              - h-4 (16px): Matches typical text line height in the table
              - Width varies by column to approximate real content dimensions
              - aria-label: Provides screen reader context during loading
            */}
            <Skeleton
              className={`h-4 ${width}`}
              aria-label={`Loading ${description}`}
            />
          </TableCell>
        )
      })}
    </TableRow>
  )
}
