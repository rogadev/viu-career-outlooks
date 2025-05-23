import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

/**
 * OutlookTableSkeleton Component
 *
 * Displays a loading skeleton for the career outlook data table.
 * This component mimics the structure of the actual OutlookTable
 * to provide a smooth loading experience while data is being fetched.
 *
 * The skeleton includes:
 * - Table headers with skeleton placeholders
 * - 5 rows of skeleton data (matching the typical pagination limit)
 * - Column widths that approximate the actual content widths
 *
 * @returns {ReactElement} A table skeleton with loading animations
 */

// Configuration constants for better maintainability
const SKELETON_ROWS_COUNT = 5 // Number of skeleton rows to display (matches typical data limit)

// Column configuration with header names and skeleton widths
// These widths are tailored to approximate the actual content in each column
const TABLE_COLUMNS = [
  { header: 'NOC', skeletonWidth: 'w-16' }, // NOC codes are typically 4-5 characters
  { header: 'Title', skeletonWidth: 'w-40' }, // Job titles can be quite long
  { header: 'Economic Region', skeletonWidth: 'w-32' }, // Region names are medium length
  { header: 'Province', skeletonWidth: 'w-8' }, // Province abbreviations are short (2-3 chars)
  { header: 'Outlook', skeletonWidth: 'w-24' }, // Outlook values like "Fair", "Good", "Limited"
] as const

export default function OutlookTableSkeleton() {
  // Generate an array of empty items to map over for creating skeleton rows
  // Using Array.from for better readability than Array(n).fill(null)
  const skeletonRows = Array.from(
    { length: SKELETON_ROWS_COUNT },
    (_, index) => index
  )

  return (
    <div className='w-full overflow-auto'>
      <Table>
        {/* Table Header */}
        <TableHeader>
          <TableRow>
            {TABLE_COLUMNS.map(({ header }) => (
              <TableHead key={header}>
                {/* 
                  Header skeleton placeholders
                  Using consistent h-4 height and w-20 width for all headers
                  to create uniform loading appearance
                */}
                <Skeleton className='h-4 w-20' />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Table Body with Skeleton Rows */}
        <TableBody>
          {skeletonRows.map((rowIndex) => (
            <TableRow key={rowIndex}>
              {TABLE_COLUMNS.map(({ header, skeletonWidth }) => (
                <TableCell key={`${rowIndex}-${header}`}>
                  {/* 
                    Individual cell skeletons with varying widths
                    Widths are chosen to approximate the actual content size:
                    - NOC: Short codes (w-16)
                    - Title: Longer job titles (w-40) 
                    - Economic Region: Medium length names (w-32)
                    - Province: Short abbreviations (w-8)
                    - Outlook: Medium length status (w-24)
                  */}
                  <Skeleton className={`h-4 ${skeletonWidth}`} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
