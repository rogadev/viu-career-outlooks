import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const regions = await prisma.economicRegion.findMany({
      orderBy: {
        economicRegionName: 'asc',
      },
    });

    return NextResponse.json(regions);
  } catch (error) {
    console.error('Failed to fetch economic regions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch economic regions' },
      { status: 500 }
    );
  }
} 
