import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * API endpoint to fetch detailed information about a specific NOC (National Occupational Classification)
 * 
 * This endpoint retrieves:
 * - Unit group information with associated sections
 * - Career outlooks for the NOC across different economic regions
 * - Unique economic regions that have outlook data for this NOC
 * 
 * @param request - The incoming HTTP request (unused in this implementation)
 * @param context - Next.js context containing dynamic route parameters
 * @returns JSON response with unit group details, outlooks, and regions
 * 
 * @example
 * GET /api/noc/1234 -> Returns data for NOC code "1234"
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ noc: string; }>; }
) {
  // Extract the NOC code from the dynamic route parameter
  // Note: In Next.js 15, params is now a Promise that must be awaited
  const { noc } = await context.params;

  // Basic input validation - NOC codes should not be empty
  if (!noc || noc.trim() === '') {
    return NextResponse.json(
      {
        error: 'Invalid NOC code provided',
        details: 'NOC parameter cannot be empty'
      },
      { status: 400 }
    );
  }

  try {
    // Step 1: Fetch the unit group information for the given NOC
    // This includes basic NOC details and any associated sections
    const unitGroup = await prisma.unitGroup.findUnique({
      where: { noc },
      include: {
        sections: true, // Include related sections data
      },
    });

    // If no unit group exists for this NOC, return a 404 error
    if (!unitGroup) {
      return NextResponse.json(
        {
          error: 'NOC not found',
          details: `No unit group found for NOC code: ${noc}`
        },
        { status: 404 }
      );
    }

    // Step 2: Fetch all career outlook data for this NOC
    // This includes outlook information across all economic regions
    const careerOutlooks = await prisma.outlook.findMany({
      where: { noc },
      include: {
        economicRegion: true, // Include the full economic region data
      },
    });

    // Step 3: Extract unique economic regions from the outlook data
    // We use a Map to deduplicate regions by their ID, as multiple outlooks
    // might exist for the same region (e.g., different time periods)
    const uniqueRegionsMap = new Map();
    careerOutlooks.forEach(outlook => {
      if (outlook.economicRegion) {
        uniqueRegionsMap.set(
          outlook.economicRegion.id,
          outlook.economicRegion
        );
      }
    });

    // Convert the Map values back to an array of unique regions
    const uniqueRegions = Array.from(uniqueRegionsMap.values());

    // Return the comprehensive NOC data in a structured format
    return NextResponse.json({
      data: {
        unitGroup,
        outlooks: careerOutlooks, // Renamed from misleading "reorderedOutlooks"
        regions: uniqueRegions,   // Now contains only unique regions
      },
      metadata: {
        nocCode: noc,
        outlookCount: careerOutlooks.length,
        regionCount: uniqueRegions.length,
      }
    });

  } catch (error: unknown) {
    // Log the full error for debugging purposes (in development/server logs)
    console.error('Error fetching NOC details:', error);

    // Determine if this is a database connection error or other specific error
    let errorMessage = 'Internal server error';
    let errorDetails = 'An unexpected error occurred while fetching NOC data';

    // If it's a Prisma error, we might want to handle it differently
    if (error instanceof Error) {
      // In development, include more details; in production, keep generic
      if (process.env.NODE_ENV === 'development') {
        errorDetails = error.message;
      }
    }

    // Return a standardized error response
    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
        nocCode: noc // Include the NOC code for debugging context
      },
      { status: 500 }
    );
  }
}
