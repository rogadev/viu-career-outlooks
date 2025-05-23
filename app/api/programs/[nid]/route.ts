import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * API Route: GET /api/programs/[nid]
 * 
 * Fetches a single program by its NID (Numeric Identifier).
 * This endpoint retrieves comprehensive program details including
 * related program area information through Prisma's include feature.
 * 
 * @param request - The incoming HTTP request object (unused but required by Next.js API route signature)
 * @param context - Route context containing dynamic route parameters
 * @param context.params - Promise containing the dynamic route parameters
 * @param context.params.nid - The program's numeric identifier as a string (from URL)
 * 
 * @returns NextResponse with program data or appropriate error message
 * 
 * Response format:
 * - Success (200): { data: Program, metadata?: { ... } }
 * - Not Found (404): { error: string }
 * - Bad Request (400): { error: string, details?: string }
 * - Server Error (500): { error: string }
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ nid: string; }>; }
) {
  try {
    // Extract the NID from the dynamic route parameters
    // Note: In Next.js 15 with App Router, params is a Promise and must be awaited
    const { nid } = await context.params;

    // Validate that NID is a valid number
    // This prevents database errors and provides better user feedback
    const numericNid = parseInt(nid, 10);

    // Check if the parsed NID is a valid positive integer
    // parseInt returns NaN for invalid strings, and we want positive numbers only
    if (isNaN(numericNid) || numericNid <= 0) {
      return NextResponse.json(
        {
          error: 'Invalid program ID',
          details: 'Program ID must be a positive number'
        },
        { status: 400 }
      );
    }

    // Query the database for the program with the specified NID
    // Using Prisma's findUnique for efficient single-record retrieval
    // Include related programArea data to provide comprehensive program information
    const program = await prisma.program.findUnique({
      where: {
        nid: numericNid
      },
      include: {
        // Include related program area data
        // This provides additional context about the program's category/department
        programArea: true,
      },
    });

    // Handle case where no program exists with the given NID
    // This is a common scenario and should return a user-friendly 404 response
    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Return successful response with program data
    // Following the consistent API response format with data wrapper
    return NextResponse.json({ data: program });

  } catch (error: unknown) {
    // Log the full error for debugging purposes
    // In production, this helps with troubleshooting while keeping user-facing messages clean
    console.error('Error fetching program:', error);

    // Handle different types of errors that might occur

    // Check if it's a Prisma-specific error (database connection, constraint violations, etc.)
    if (error && typeof error === 'object' && 'code' in error) {
      // Prisma errors have a 'code' property that can help identify the specific issue
      console.error('Prisma error code:', (error as { code: string; }).code);

      // For database-specific errors, we might want different handling in the future
      // For now, treat them as general server errors but log the specifics
    }

    // Return a generic server error response
    // We don't expose internal error details to prevent security information leakage
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
