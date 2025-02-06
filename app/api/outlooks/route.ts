import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

/**
 * Query parameter schema for the outlooks API
 */
const querySchema = z.object({
  id: z.coerce.number().optional(),
  noc: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(100),
  fields: z.string().optional(),
  province: z.string().length(2).toUpperCase().optional(),
  erc: z.string().length(4).optional(),
  end: z.enum(['top', 'bottom']).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const query = querySchema.safeParse({
      id: searchParams.get('id') || undefined,
      noc: searchParams.get('noc') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      fields: searchParams.get('fields') || undefined,
      province: searchParams.get('province') || undefined,
      erc: searchParams.get('erc') || undefined,
      end: searchParams.get('end') || undefined,
    });

    if (!query.success) {
      return NextResponse.json(
        { error: 'Invalid input parameters' },
        { status: 400 }
      );
    }

    // Handle single outlook fetch
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
          economicRegion: {
            select: {
              economicRegionName: true,
            },
          },
          unitGroup: true,
        },
      });

      if (!outlook) {
        return NextResponse.json(
          { error: 'Outlook not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ data: outlook });
    }

    // Build the where clause for filtering
    const where = {
      ...(query.data.noc ? { noc: query.data.noc } : {}),
      ...(query.data.province ? { province: query.data.province } : {}),
      ...(query.data.erc ? { economicRegionCode: query.data.erc } : {}),
      ...(query.data.end === 'top' || query.data.end === 'bottom'
        ? {
          outlook: query.data.end === 'top' ? 'very good' : 'very limited',
        }
        : {}),
    };

    // Calculate pagination with guaranteed limit value
    const limit = query.data.limit; // limit is now guaranteed to be defined
    const skip = (query.data.page - 1) * limit;

    // Get paginated results
    const outlooks = await prisma.outlook.findMany({
      where,
      skip,
      take: limit,
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
        economicRegion: {
          select: {
            economicRegionName: true,
          },
        },
        unitGroup: true,
      },
    });

    // Get total count for pagination
    const total = await prisma.outlook.count({ where });

    return NextResponse.json({
      data: outlooks,
      pagination: {
        page: query.data.page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error in outlooks API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
