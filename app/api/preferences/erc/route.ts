import { setPreferredErc } from '@/lib/cookies';
import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Economic Region Code (ERC) Preference API
 * 
 * This endpoint handles setting the user's preferred Economic Region Code (ERC) 
 * which is used throughout the application to filter employment outlook data.
 * 
 * ERC codes are 4-character strings that represent specific economic regions
 * across Canada. Examples include:
 * - "5900" for Nanaimo region (default)
 * - "5910" for Victoria region
 * - "5920" for Vancouver region
 * 
 * The preference is stored as an HTTP-only cookie for security and persistence
 * across user sessions.
 */

/**
 * Request body validation schema for ERC preference updates
 * 
 * Validates that the incoming ERC is:
 * - A string type (not number or other types)
 * - Exactly 4 characters long (standard ERC format)
 * - Contains only alphanumeric characters (additional safety check)
 */
const ercPreferenceSchema = z.object({
  erc: z
    .string()
    .length(4, 'ERC must be exactly 4 characters')
    .regex(/^[A-Za-z0-9]+$/, 'ERC must contain only alphanumeric characters')
    .transform((val) => val.toUpperCase()) // Normalize to uppercase for consistency
});

/**
 * POST /api/preferences/erc
 * 
 * Updates the user's preferred Economic Region Code (ERC) by storing it in a secure cookie.
 * This preference is used to filter employment outlook data throughout the application.
 * 
 * @param request - The incoming HTTP request containing the ERC preference
 * @returns Promise<NextResponse> - JSON response indicating success or failure
 * 
 * @example
 * ```typescript
 * // Request body
 * {
 *   "erc": "5900"
 * }
 * 
 * // Success response (200)
 * {
 *   "data": {
 *     "erc": "5900",
 *     "message": "ERC preference updated successfully"
 *   }
 * }
 * 
 * // Error response (400)
 * {
 *   "error": "Invalid ERC format",
 *   "details": [...] // Zod validation errors
 * }
 * ```
 */
export async function POST(request: Request) {
  try {
    // Parse the request body
    // Note: We handle JSON parsing errors separately for better error messages
    let requestBody: unknown;

    try {
      requestBody = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: 'Invalid JSON format in request body',
          details: 'Request body must be valid JSON'
        },
        { status: 400 }
      );
    }

    // Validate the request body against our schema
    const validationResult = ercPreferenceSchema.safeParse(requestBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid ERC format',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    // Extract the validated and normalized ERC
    const { erc } = validationResult.data;

    // Store the ERC preference in a secure cookie
    // This function handles cookie configuration (httpOnly, secure, etc.)
    await setPreferredErc(erc);

    // Return success response following the standard format
    return NextResponse.json(
      {
        data: {
          erc: erc,
          message: 'ERC preference updated successfully'
        }
      },
      { status: 200 }
    );

  } catch (error) {
    // Handle any unexpected server errors
    console.error('Error updating ERC preference:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: 'Failed to update ERC preference. Please try again.'
      },
      { status: 500 }
    );
  }
} 
