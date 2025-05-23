import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

/**
 * Type Definitions
 * These interfaces define the shape of our data for better type safety
 * They match the actual data structure returned by Prisma queries
 */
interface OutlookData {
  id: number;                   // Primary key from database (auto-increment integer)
  noc: string;                  // National Occupational Classification code
  economicRegionCode: string;   // Code identifying the economic region
  title: string;                // Job title/occupation name
  outlook: string;              // Employment outlook rating (e.g., "very good")
  trends: string | null;        // Employment trend information (nullable)
  releaseDate: Date;            // When this outlook data was published
  province: string;             // Province abbreviation (e.g., "BC", "ON")
  lang: string;                 // Language code (EN/FR)
  // Related data from joined tables
  economicRegion: {             // Economic region details (from relation)
    economicRegionCode: string;
    economicRegionName: string;
  };
  unitGroup: {                  // Unit group classification (from relation)
    noc: string;                // NOC code (same as above, but from relation)
    occupation: string;         // Occupation title from NOC classification
  };
}

interface ApiResponse {
  data: OutlookData[];
  metadata: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface ApiError {
  error: string;
  details?: string | Record<string, unknown>;
  code?: string;
}

/**
 * Query Parameter Validation Schema
 * 
 * This schema validates and transforms query parameters:
 * - page: Page number for pagination (min 1, defaults to 1)
 * - limit: Number of items per page (min 1, defaults to 10)  
 * - province: 2-letter province code (e.g., "BC", "ON") - optional filter
 * - erc: 4-character Economic Region Code - optional filter for sub-provincial regions
 */
const querySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(10),
  province: z.string().length(2).toUpperCase().optional(),
  erc: z.string().length(4).optional()
});

type QueryParams = z.infer<typeof querySchema>;

/**
 * Cache Configuration
 * 
 * Employment outlook data is sourced from government statistics and updated annually,
 * with occasional manual updates throughout the year. The caching strategy balances
 * data freshness with performance:
 * 
 * - runtime: 'nodejs' - Uses Node.js runtime for database access
 * - revalidate: 86400 - Revalidates cache every 24 hours
 * - dynamic: 'force-dynamic' - Ensures search parameters are respected even with caching
 */
export const runtime = 'nodejs';
export const revalidate = 86400; // 24 hours in seconds
export const dynamic = 'force-dynamic';

/**
 * GET /api/top-outlooks
 * 
 * Retrieves employment outlooks filtered to show only "very good" outlook ratings.
 * This endpoint is typically used to highlight the most promising career opportunities.
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 * - province: 2-letter province code (optional)
 * - erc: Economic Region Code (optional)
 * 
 * Response: Paginated list of outlook data with metadata
 */
export async function GET(request: Request): Promise<NextResponse<ApiResponse | ApiError>> {
  try {
    // Extract and parse URL search parameters
    const { searchParams } = new URL(request.url);

    // Validate query parameters using Zod schema
    // This ensures type safety and provides meaningful error messages
    const queryValidation = querySchema.safeParse({
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
      province: searchParams.get('province') || undefined,
      erc: searchParams.get('erc') || undefined
    });

    // Handle validation errors early to provide clear feedback
    if (!queryValidation.success) {
      return NextResponse.json(
        {
          error: 'Invalid input parameters',
          // Convert ZodIssue[] to Record<string, unknown> format for compatibility with ApiError
          // This provides structured error information for debugging and client-side handling
          details: {
            validationErrors: queryValidation.error.errors,
            invalidFields: queryValidation.error.errors.map(err => err.path.join('.'))
          },
          code: 'VALIDATION_ERROR'
        } as ApiError,
        { status: 400 }
      );
    }

    const validatedQuery: QueryParams = queryValidation.data;

    // Execute database operations within a transaction
    // This ensures data consistency between the count and data queries
    const response = await prisma.$transaction(async (transaction) => {

      // Build the WHERE clause for filtering
      // Start with the base filter (only "very good" outlooks)
      const whereClause = {
        outlook: 'very good' as const,
        // Conditionally add province filter if provided
        ...(validatedQuery.province && { province: validatedQuery.province }),
        // Conditionally add economic region filter if provided  
        ...(validatedQuery.erc && { economicRegionCode: validatedQuery.erc })
      };

      // Calculate pagination offset
      // Example: page 3 with limit 10 = skip first 20 records
      const skipRecords = (validatedQuery.page - 1) * validatedQuery.limit;

      // Execute both queries concurrently for better performance
      // Using Promise.all ensures both complete before proceeding
      const [outlookData, totalCount] = await Promise.all([
        // Fetch paginated outlook data with selected fields
        transaction.outlook.findMany({
          where: whereClause,
          skip: skipRecords,
          take: validatedQuery.limit,
          select: {
            // Select only the fields needed for the response
            // This reduces data transfer and improves performance
            id: true,
            noc: true,                    // National Occupational Classification code
            economicRegionCode: true,     // Sub-provincial region identifier
            title: true,                  // Job title/occupation name
            outlook: true,                // Employment outlook rating
            trends: true,                 // Employment trend information
            releaseDate: true,            // When this data was published
            province: true,               // Province code
            lang: true,                   // Language (EN/FR)
            economicRegion: true,         // Human-readable region name
            unitGroup: true               // NOC unit group classification
          }
        }),

        // Get total count for pagination metadata
        transaction.outlook.count({ where: whereClause })
      ]);

      // Calculate total pages for pagination
      const totalPages = Math.ceil(totalCount / validatedQuery.limit);

      // Return structured response following project API standards
      return {
        data: outlookData,
        metadata: {
          page: validatedQuery.page,
          limit: validatedQuery.limit,
          total: totalCount,
          pages: totalPages
        }
      } as ApiResponse;
    });

    // Return successful response with appropriate cache headers
    // Cache headers optimize performance while ensuring data freshness
    return NextResponse.json(response, {
      headers: {
        // Cache publicly for 24 hours, allow stale content for 12 hours while revalidating
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });

  } catch (error) {
    // Comprehensive error handling with appropriate logging
    // Using stderr for error logging to avoid cluttering stdout
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    process.stderr.write(`Top Outlooks API Error: ${errorMessage}\n`);

    // Handle specific error types with appropriate responses

    // Zod validation errors (shouldn't reach here due to early validation, but included for completeness)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid input parameters',
          // Convert ZodIssue[] to Record<string, unknown> format for compatibility with ApiError
          // This provides structured error information for debugging and client-side handling
          details: {
            validationErrors: error.errors,
            invalidFields: error.errors.map(err => err.path.join('.'))
          },
          code: 'VALIDATION_ERROR'
        } as ApiError,
        { status: 400 }
      );
    }

    // Database or other known errors
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Database operation failed',
          details: error.message,
          code: 'DATABASE_ERROR'
        } as ApiError,
        { status: 500 }
      );
    }

    // Fallback for unknown error types
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      } as ApiError,
      { status: 500 }
    );
  }
} 
