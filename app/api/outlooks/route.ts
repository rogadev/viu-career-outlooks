import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

/**
 * Default pagination values
 */
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 100;
const MIN_PAGE = 1;
const MIN_LIMIT = 1;

/**
 * Database select object for outlook queries
 * Defines which fields to include in the response to avoid fetching unnecessary data
 */
const OUTLOOK_SELECT = {
  id: true,
  noc: true,
  economicRegionCode: true,
  title: true,
  outlook: true,
  trends: true,
  releaseDate: true,
  province: true,
  lang: true,
  economicRegion: {
    select: {
      economicRegionName: true,
    },
  },
  unitGroup: true,
} as const;

/**
 * Query parameter schema for the outlooks API
 * Validates and coerces incoming query parameters to ensure data integrity
 */
const querySchema = z.object({
  // Single outlook identifier
  id: z.coerce.number().optional(),

  // National Occupational Classification code for filtering
  noc: z.string().optional(),

  // Pagination parameters with sensible defaults
  page: z.coerce.number().min(MIN_PAGE).optional().default(DEFAULT_PAGE),
  limit: z.coerce.number().min(MIN_LIMIT).optional().default(DEFAULT_LIMIT),

  // Field selection (currently not implemented but defined for future use)
  fields: z.string().optional(),

  // Geographic filters
  province: z.string().length(2).toUpperCase().optional(), // 2-letter province code (e.g., "BC", "ON")
  erc: z.string().length(4).optional(), // 4-character Economic Region Code

  // Outlook quality filter - 'top' for best outlooks, 'bottom' for worst
  end: z.enum(['top', 'bottom']).optional(),
});

/**
 * Type definition for validated query parameters
 */
type ValidatedQuery = z.infer<typeof querySchema>;

/**
 * Builds the database where clause based on query parameters
 * @param query - Validated query parameters
 * @returns Prisma where clause object
 */
function buildWhereClause(query: ValidatedQuery) {
  const where: Record<string, any> = {};

  // Filter by National Occupational Classification code
  if (query.noc) {
    where.noc = query.noc;
  }

  // Filter by province (2-letter code like "BC", "ON")
  if (query.province) {
    where.province = query.province;
  }

  // Filter by Economic Region Code (4-character code)
  if (query.erc) {
    where.economicRegionCode = query.erc;
  }

  // Filter by outlook quality extremes
  if (query.end) {
    // 'top' returns outlooks with 'very good' prospects
    // 'bottom' returns outlooks with 'very limited' prospects
    where.outlook = query.end === 'top' ? 'very good' : 'very limited';
  }

  return where;
}

/**
 * Fetches a single outlook by ID
 * @param id - The unique identifier of the outlook
 * @returns Promise resolving to the outlook data or null if not found
 */
async function fetchSingleOutlook(id: number) {
  return await prisma.outlook.findUnique({
    where: { id },
    select: OUTLOOK_SELECT,
  });
}

/**
 * Fetches multiple outlooks with filtering and pagination
 * @param where - Prisma where clause for filtering
 * @param page - Page number (1-indexed)
 * @param limit - Number of items per page
 * @returns Promise resolving to paginated outlook data and metadata
 */
async function fetchPaginatedOutlooks(
  where: Record<string, any>,
  page: number,
  limit: number
) {
  // Calculate how many records to skip for pagination
  const skip = (page - 1) * limit;

  // Execute both queries in parallel for better performance
  const [outlooks, total] = await Promise.all([
    // Fetch the requested page of data
    prisma.outlook.findMany({
      where,
      skip,
      take: limit,
      select: OUTLOOK_SELECT,
    }),
    // Get total count for pagination metadata
    prisma.outlook.count({ where }),
  ]);

  return {
    outlooks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Validates and parses query parameters from the request URL
 * @param searchParams - URLSearchParams object from the request
 * @returns Validation result with parsed data or error details
 */
function validateQueryParams(searchParams: URLSearchParams) {
  return querySchema.safeParse({
    id: searchParams.get('id') || undefined,
    noc: searchParams.get('noc') || undefined,
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    fields: searchParams.get('fields') || undefined,
    province: searchParams.get('province') || undefined,
    erc: searchParams.get('erc') || undefined,
    end: searchParams.get('end') || undefined,
  });
}

/**
 * GET /api/outlooks
 * 
 * Retrieves career outlook data with support for:
 * - Single outlook fetch by ID
 * - Multiple outlooks with filtering by NOC, province, economic region
 * - Pagination support
 * - Outlook quality filtering (top/bottom performers)
 * 
 * Query Parameters:
 * @param id - Specific outlook ID to fetch
 * @param noc - National Occupational Classification code filter
 * @param province - 2-letter province code filter (e.g., "BC", "ON")
 * @param erc - 4-character Economic Region Code filter
 * @param end - Filter for outlook quality ("top" for very good, "bottom" for very limited)
 * @param page - Page number for pagination (default: 1)
 * @param limit - Items per page (default: 100)
 * @param fields - Field selection (reserved for future use)
 * 
 * @returns JSON response with outlook data and pagination metadata
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate and parse query parameters using Zod schema
    const queryValidation = validateQueryParams(searchParams);

    if (!queryValidation.success) {
      return NextResponse.json(
        {
          error: 'Invalid input parameters',
          details: queryValidation.error.errors
        },
        { status: 400 }
      );
    }

    const query = queryValidation.data;

    // Handle single outlook fetch when ID is provided
    if (query.id) {
      const outlook = await fetchSingleOutlook(query.id);

      if (!outlook) {
        return NextResponse.json(
          { error: 'Outlook not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ data: outlook });
    }

    // Handle multiple outlooks with filtering and pagination
    const whereClause = buildWhereClause(query);

    const result = await fetchPaginatedOutlooks(
      whereClause,
      query.page,
      query.limit
    );

    return NextResponse.json({
      data: result.outlooks,
      pagination: result.pagination,
    });

  } catch (error) {
    // Log the full error for debugging purposes
    console.error('Error in outlooks API:', error);

    // Return generic error message to avoid exposing sensitive information
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
