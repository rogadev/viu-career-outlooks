import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  context: { params: Promise<{ noc: string; }>; }
) {
  const { noc } = await context.params;

  try {
    const unitGroup = await prisma.unitGroup.findUnique({
      where: { noc },
      include: {
        sections: true,
      },
    });

    if (!unitGroup) {
      return NextResponse.json({ error: 'NOC not found' }, { status: 404 });
    }

    const outlooks = await prisma.outlook.findMany({
      where: { noc },
      include: {
        economicRegion: true,
      },
    });

    return NextResponse.json({
      unitGroup,
      reorderedOutlooks: outlooks,
      regions: outlooks.map(o => o.economicRegion),
    });
  } catch (error: unknown) {
    console.error('Error fetching NOC details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
