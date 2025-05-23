import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import type { EconomicRegion } from '@prisma/client';

/**
 * API Route: GET /api/economic-regions
 * 
 * Retrieves a list of all economic regions from the database, sorted alphabetically
 * by region name. This endpoint is typically used to populate dropdown menus
 * or filter options in the frontend application.
 * 
 * @returns {Promise<NextResponse>} JSON response containing:
 *   - Success: { data: EconomicRegion[], metadata: { count: number } }
 *   - Error: { error: string, details?: any }
 * 
 * @example
 * // Successful response:
 * {
 *   "data": [
 *     { "id": 1, "economicRegionName": "Calgary", ... },
 *     { "id": 2, "economicRegionName": "Edmonton", ... }
 *   ],
 *   "metadata": { "count": 2 }
 * }
 * 
 * @example
 * // Error response:
 * {
 *   "error": "Failed to fetch economic regions",
 *   "details": "Database connection error"
 * }
 */
export async function GET(): Promise<NextResponse> {
  try {
    // Query the database for all economic regions
    // Using findMany() to retrieve all records, with orderBy for consistent sorting
    const regions: EconomicRegion[] = await prisma.economicRegion.findMany({
      orderBy: {
        // Sort alphabetically by region name (A-Z) for consistent ordering
        // This ensures the frontend always receives data in a predictable order
        economicRegionName: 'asc',
      },
    });

    // Return successful response following the project's standard API response format
    // Include metadata with count for potential pagination or UI display purposes
    return NextResponse.json({
      data: regions,
      metadata: {
        count: regions.length,
      },
    });
  } catch (error) {
    // Log the full error details to the server console for debugging
    // This helps developers identify issues without exposing sensitive details to clients
    console.error('Database query failed in GET /api/economic-regions:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // Return a user-friendly error response that doesn't expose internal system details
    // Follow the project's standard error response format
    return NextResponse.json(
      {
        error: 'Failed to fetch economic regions',
        // In development, we might want to include more details
        details: process.env.NODE_ENV === 'development'
          ? error instanceof Error ? error.message : 'Unknown error'
          : undefined,
      },
      { status: 500 }
    );
  }
} 
