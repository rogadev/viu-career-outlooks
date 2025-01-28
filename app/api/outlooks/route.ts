import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';

// Define query parameter schema with optional fields
const querySchema = z.object({
  id: z.string().uuid().optional(),
  noc: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(10),
  fields: z.string().optional()
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters with defaults
    const query = querySchema.parse({
      id: searchParams.get('id') || undefined,
      noc: searchParams.get('noc') || undefined,
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
      fields: searchParams.get('fields') || undefined
    });

    // If ID is provided, return single outlook
    if (query.id) {
      const outlook = await prisma.outlook.findUnique({
        where: { id: query.id }
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
    const where = query.noc ? { noc: query.noc } : {};

    // Calculate pagination
    const skip = (query.page - 1) * query.limit;

    // Get paginated results
    const outlooks = await prisma.outlook.findMany({
      where,
      skip,
      take: query.limit,
      orderBy: { createdAt: 'desc' }
    });

    // Get total count for pagination
    const total = await prisma.outlook.count({ where });

    return NextResponse.json({
      data: outlooks,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit)
      }
    });

  } catch (error) {
    console.error('Error fetching outlooks:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
