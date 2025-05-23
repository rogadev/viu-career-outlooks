import { ReactElement } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

// Constants for skeleton dimensions - makes it easier to maintain and understand
// the visual hierarchy being mimicked
const SKELETON_DIMENSIONS = {
  // Header title skeleton - wider to represent a program title
  HEADER_HEIGHT: 'h-8',
  HEADER_WIDTH: 'w-64',

  // Content line skeletons - varying widths to simulate natural text flow
  LINE_HEIGHT: 'h-4',
  FULL_LINE_WIDTH: 'w-full',
  MEDIUM_LINE_WIDTH: 'w-3/4',
  SHORT_LINE_WIDTH: 'w-1/2',
} as const

/**
 * LoadingOutlooks Component
 *
 * A loading skeleton component that displays placeholder content while career outlook
 * data is being fetched. This provides visual feedback to users and prevents layout
 * shifts when the actual content loads.
 *
 * The skeleton mimics the structure of a typical career outlook card:
 * - Header: Program/career title (larger, prominent)
 * - Content: Multiple lines of description text (varying widths for natural appearance)
 *
 * @returns {ReactElement} A card containing skeleton placeholders
 *
 * @example
 * // Used while loading career outlook data
 * {isLoading ? <LoadingOutlooks /> : <CareerOutlookCard data={outlookData} />}
 */
export default function LoadingOutlooks(): ReactElement {
  return (
    <Card
      role='status'
      aria-label='Loading career outlook information'
      className='animate-pulse'
    >
      {/* Header section - represents the career/program title */}
      <CardHeader>
        <Skeleton
          className={`${SKELETON_DIMENSIONS.HEADER_HEIGHT} ${SKELETON_DIMENSIONS.HEADER_WIDTH}`}
          aria-hidden='true'
        />
      </CardHeader>

      {/* Content section - represents description/details text */}
      <CardContent className='space-y-4'>
        {/* First line - full width to simulate a complete sentence */}
        <Skeleton
          className={`${SKELETON_DIMENSIONS.LINE_HEIGHT} ${SKELETON_DIMENSIONS.FULL_LINE_WIDTH}`}
          aria-hidden='true'
        />

        {/* Second line - 3/4 width to simulate a shorter sentence */}
        <Skeleton
          className={`${SKELETON_DIMENSIONS.LINE_HEIGHT} ${SKELETON_DIMENSIONS.MEDIUM_LINE_WIDTH}`}
          aria-hidden='true'
        />

        {/* Third line - 1/2 width to simulate the end of a paragraph */}
        <Skeleton
          className={`${SKELETON_DIMENSIONS.LINE_HEIGHT} ${SKELETON_DIMENSIONS.SHORT_LINE_WIDTH}`}
          aria-hidden='true'
        />
      </CardContent>
    </Card>
  )
}
