import { prisma } from '@/lib/db'
import { z } from 'zod'
import OutlookTable from './OutlookTable'

/**
 * Query parameter schema for the outlooks API
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

// Add type to match our select statement
type OutlookResult = {
  id: number
  noc: string
  economicRegionCode: string
  title: string
  outlook: string
  trends: string
  trendsHash: string
  releaseDate: Date
  province: string
  lang: string
  economicRegion: {
    economicRegionName: string
  }
  unitGroup: {
    occupation: string
  }
}

async function getOutlooks(query: z.infer<typeof querySchema>) {
  try {
    // Parse and validate query parameters with defaults
    const q = querySchema.safeParse({
      page: query.page || undefined,
      limit: query.limit || undefined,
      province: query.province || undefined,
      erc: query.erc || undefined,
      end: query.end || undefined,
    })

    // Handle validation errors
    if (!q.success) {
      throw new Error('Invalid input parameters')
    }

    const where = {
      ...(q.data.end === 'top' || q.data.end === 'bottom'
        ? {
            outlook: q.data.end === 'top' ? 'very good' : 'very limited',
          }
        : {}),
      ...(q.data.province ? { province: q.data.province } : {}),
      ...(q.data.erc ? { economicRegionCode: q.data.erc } : {}),
    }

    const skip = q.data.limit ? (q.data.page - 1) * q.data.limit : 0

    // Execute both queries
    const [outlooks, total] = await Promise.all([
      prisma.outlook.findMany({
        where,
        skip,
        ...(q.data.limit ? { take: q.data.limit } : {}),
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
      prisma.outlook.count({ where }),
    ])

    // Update the map function to use our type
    const outlooksWithProgramId = outlooks.map((outlook: OutlookResult) => ({
      ...outlook,
      programNid: null, // Add null programNid if not present
    }))

    return {
      data: outlooksWithProgramId,
      pagination: {
        page: q.data.page,
        limit: q.data.limit,
        total,
        pages: q.data.limit ? Math.ceil(total / q.data.limit) : 1,
      },
    }
  } catch (error) {
    console.error('Error in getOutlooks:', error)
    throw error
  }
}

type OutlookItemsProps = {
  page?: number
  limit?: number
  province?: string
  erc?: string
  end?: 'top' | 'bottom'
}

const OutlookItems = async ({
  page = 1,
  limit,
  province,
  erc = '5900',
  end,
}: OutlookItemsProps) => {
  try {
    const result = await getOutlooks({ page, limit, province, erc, end })
    return (
      <OutlookTable outlooks={result.data} variant='short' className='h-full' />
    )
  } catch (error) {
    console.error('Error in OutlookItems:', error)
    return <div>Error loading outlooks</div>
  }
}

export default OutlookItems
