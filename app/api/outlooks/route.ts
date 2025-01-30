import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

/**
 * Query parameter schema for the outlooks API
 */
const querySchema = z.object({
  id: z.string().uuid().optional(),
  noc: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(10),
  fields: z.string().optional(),
  province: z.string().length(2).toUpperCase().optional(),
  erc: z.string().length(4).optional()
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters with defaults
    const query = querySchema.safeParse({
      id: searchParams.get('id') || undefined,
      noc: searchParams.get('noc') || undefined,
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
      fields: searchParams.get('fields') || undefined,
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

    // If ID is provided, return single outlook
    if (query.data.id) {
      const outlook = await prisma.outlook.findUnique({
        where: { id: query.data.id },
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
          // trendsHash is excluded
        }
      });

      if (!outlook) {
        return NextResponse.json(
          { message: 'Outlook not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(outlook);
    }

    // Build the where clause for filtering
    const where = {
      ...(query.data.noc ? { noc: query.data.noc } : {}),
      ...(query.data.province ? { province: query.data.province } : {}),
      ...(query.data.erc ? { economicRegionCode: query.data.erc } : {})
    };

    // Calculate pagination
    const skip = (query.data.page - 1) * query.data.limit;

    // Get paginated results
    const outlooks = await prisma.outlook.findMany({
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
        // trendsHash is excluded
      }
    });

    // Get total count for pagination
    const total = await prisma.outlook.count({ where });

    return NextResponse.json({
      data: outlooks,
      pagination: {
        page: query.data.page,
        limit: query.data.limit,
        total,
        pages: Math.ceil(total / query.data.limit)
      }
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
