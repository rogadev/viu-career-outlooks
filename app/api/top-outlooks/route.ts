import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

/**
 * Query parameter schema for the outlooks API
 */
const querySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(10),
  province: z.string().length(2).toUpperCase().optional(),
  erc: z.string().length(4).optional()
});

/**
 * Cache Configuration
 * Employment outlook data is updated annually by the government
 * and occasionally through manual updates. Caching for 24 hours provides a good
 * balance between freshness and performance.
 */
export const runtime = 'nodejs';
export const revalidate = 86400; // 24 hours
export const dynamic = 'force-dynamic'; // Needed to ensure searchParams are respected with caching

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters with defaults
    const query = querySchema.safeParse({
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
      province: searchParams.get('province') || undefined,
      erc: searchParams.get('erc') || undefined
    });

    // Handle validation errors
    if (!query.success) {
      return NextResponse.json(
        {
          message: 'Invalid input parameters',
          details: query.error.errors
        },
        { status: 400 }
      );
    }

    const response = await prisma.$transaction(async (tx) => {
      const where = {
        outlook: 'very good',
        ...(query.data.province ? { province: query.data.province } : {}),
        ...(query.data.erc ? { economicRegionCode: query.data.erc } : {})
      };

      const skip = (query.data.page - 1) * query.data.limit;

      // Execute both queries in a transaction for consistency
      const [outlooks, total] = await Promise.all([
        tx.outlook.findMany({
          where,
          skip,
          take: query.data.limit,
          select: {
            id: true,
            noc: true,
            economicRegionCode: true,
            title: true,
            outlook: true,
            trends: true,
            releaseDate: true,
            province: true,
            lang: true,
            economicRegion: true,
            unitGroup: true
          }
        }),
        tx.outlook.count({ where })
      ]);

      return {
        data: outlooks,
        pagination: {
          page: query.data.page,
          limit: query.data.limit,
          total,
          pages: Math.ceil(total / query.data.limit)
        }
      };
    });

    // Return response with cache headers
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });

  } catch (error) {
    // Use a different logging approach
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    process.stderr.write(`Outlook API Error: ${errorMessage}\n`);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Invalid input parameters',
          details: error.errors
        },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: 'Database error',
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
