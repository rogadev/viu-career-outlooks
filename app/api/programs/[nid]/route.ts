import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET handler for fetching a single program by NID
 * @param request - The incoming request
 * @param context - Route parameters containing the NID
 * @returns Program data or error response
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ nid: string; }>; }
) {
  const { nid } = await context.params;

  try {
    const program = await prisma.program.findUnique({
      where: { nid: parseInt(nid) },
      include: {
        programArea: true,
      },
    });

    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    return NextResponse.json(program);
  } catch (error: unknown) {
    console.error('Error fetching program:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
