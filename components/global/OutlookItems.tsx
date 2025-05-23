import { prisma } from '@/lib/db'
import { z } from 'zod'
import OutlookTable from './OutlookTable'

/**
 * Query parameter schema for the outlooks API
 *
 * This schema validates and transforms incoming query parameters:
 * - page: Current page number (minimum 1, defaults to 1)
 * - limit: Number of items per page (optional, no pagination if not provided)
 * - province: 2-letter province code (e.g., 'BC', 'ON') - must be uppercase
 * - erc: 4-digit Economic Region Code for filtering by geographic area
 * - end: Filter for extreme outlook values ('top' = very good, 'bottom' = very limited)
 */
const querySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional(),
  province: z.string().length(2).toUpperCase().optional(),
  erc: z.string().length(4).optional(),
  end: z.enum(['top', 'bottom']).optional(),
})

/**
 * TODO: Cache Configuration
 * Employment outlook data is updated annually by the government
 * and occasionally through manual updates. Caching for 24 hours provides a good
 * balance between freshness and performance.
 */

/**
 * Type definition for outlook query results
 *
 * This matches the structure returned by our Prisma select statement,
 * including the nested relations for economicRegion and unitGroup.
 */
type OutlookResult = {
  id: number
  noc: string // National Occupational Classification code
  economicRegionCode: string
  title: string
  outlook: string // Employment outlook rating (e.g., 'very good', 'limited')
  trends: string // Detailed trend analysis text
  trendsHash: string // Hash for change detection
  releaseDate: Date
  province: string // 2-letter province code
  lang: string // Language code (EN/FR)
  economicRegion: {
    economicRegionName: string
  }
  unitGroup: {
    occupation: string // Occupation group name
  }
}

/**
 * Extended outlook type that includes programNid
 * This represents the final shape of data passed to the OutlookTable component
 */
type OutlookWithProgram = OutlookResult & {
  programNid: string | null
}

/**
 * Fetches employment outlook data from the database with filtering and pagination
 *
 * @param query - Query parameters for filtering and pagination
 * @returns Object containing the outlook data and pagination metadata
 */
async function getOutlooks(query: z.infer<typeof querySchema>) {
  try {
    // Parse and validate query parameters with defaults
    const validatedQuery = querySchema.safeParse({
      page: query.page || undefined,
      limit: query.limit || undefined,
      province: query.province || undefined,
      erc: query.erc || undefined,
      end: query.end || undefined,
    })

    // Handle validation errors early
    if (!validatedQuery.success) {
      throw new Error('Invalid input parameters')
    }

    const { page, limit, province, erc, end } = validatedQuery.data

    // Build the WHERE clause dynamically based on provided filters
    const whereClause = buildWhereClause({ province, erc, end })

    // Calculate pagination offset
    const skip = limit ? (page - 1) * limit : 0

    // Execute database queries in parallel for better performance
    // - First query: Get the actual outlook records with all related data
    // - Second query: Get total count for pagination metadata
    const [outlooks, total] = await Promise.all([
      prisma.outlook.findMany({
        where: whereClause,
        skip,
        ...(limit ? { take: limit } : {}), // Only apply limit if provided
        select: {
          id: true,
          noc: true,
          economicRegionCode: true,
          title: true,
          outlook: true,
          trends: true,
          trendsHash: true,
          releaseDate: true,
          province: true,
          lang: true,
          // Include related data through Prisma relations
          economicRegion: {
            select: {
              economicRegionName: true,
            },
          },
          unitGroup: {
            select: {
              occupation: true,
            },
          },
        },
      }),
      prisma.outlook.count({ where: whereClause }),
    ])

    // Transform the data to match the expected shape for the OutlookTable component
    // Note: programNid is set to null as this component doesn't handle program associations
    // This field may be populated by other components that link outlooks to educational programs
    const outlooksWithProgramId: OutlookWithProgram[] = outlooks.map(
      (outlook) => ({
        ...outlook,
        programNid: null,
      })
    )

    return {
      data: outlooksWithProgramId,
      pagination: {
        page,
        limit,
        total,
        pages: limit ? Math.ceil(total / limit) : 1,
      },
    }
  } catch (error) {
    console.error('Error in getOutlooks:', error)
    throw error
  }
}

/**
 * Builds the WHERE clause for the Prisma query based on provided filters
 *
 * @param filters - Object containing optional filter parameters
 * @returns Prisma where clause object
 */
function buildWhereClause({
  province,
  erc,
  end,
}: {
  province?: string
  erc?: string
  end?: 'top' | 'bottom'
}) {
  const where: Record<string, any> = {}

  // Filter by employment outlook extremes
  if (end === 'top') {
    where.outlook = 'very good'
  } else if (end === 'bottom') {
    where.outlook = 'very limited'
  }

  // Filter by province (2-letter code)
  if (province) {
    where.province = province
  }

  // Filter by Economic Region Code (4-digit identifier)
  if (erc) {
    where.economicRegionCode = erc
  }

  return where
}

/**
 * Props for the OutlookItems component
 */
type OutlookItemsProps = {
  page?: number // Current page number (defaults to 1)
  limit?: number // Items per page (optional - no pagination if not provided)
  province?: string // 2-letter province code filter
  erc?: string // 4-digit Economic Region Code filter (defaults to '5900' - Vancouver region)
  end?: 'top' | 'bottom' // Filter for extreme outlook values
}

/**
 * Server component that fetches and displays employment outlook data
 *
 * This component:
 * 1. Accepts filtering and pagination parameters as props
 * 2. Fetches outlook data from the database using getOutlooks
 * 3. Renders the data using the OutlookTable component
 * 4. Handles errors gracefully with a fallback UI
 *
 * Default behavior:
 * - Shows page 1 if no page specified
 * - Uses Vancouver region (ERC 5900) as default filter
 * - No pagination limit unless specified
 */
const OutlookItems = async ({
  page = 1,
  limit,
  province,
  erc = '5900', // Default to Vancouver Economic Region
  end,
}: OutlookItemsProps) => {
  try {
    // Fetch the outlook data with the provided parameters
    const result = await getOutlooks({ page, limit, province, erc, end })

    return (
      <OutlookTable outlooks={result.data} variant='short' className='h-full' />
    )
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error in OutlookItems:', error)

    // Return a user-friendly error message
    // TODO: Consider implementing a more sophisticated error UI component
    return <div>Error loading outlooks</div>
  }
}

export default OutlookItems
