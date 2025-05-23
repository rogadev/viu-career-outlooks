import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Interface representing a section from the database with employment requirements
 * and related unit group information
 */
interface Section {
  unitGroup: {
    noc: string;
    occupation: string;
  };
  requirements: string[]; // All employment requirements for this occupation
  items: string[];        // Filtered requirements that match our search criteria
}

/**
 * Interface for the processed result returned to the client
 */
interface ProcessedResult {
  noc: string;
  title: string;
  outlook: string;
  items: string[];
}

/**
 * Credential types that can be expanded into related search terms
 */
type CredentialType = 'degree' | 'diploma' | 'certificate' | 'trades';

/**
 * Expands a single credential type into multiple related search terms to improve matching accuracy.
 * This helps capture different ways the same credential might be referenced in job requirements.
 * 
 * @param credential - The base credential type to expand
 * @returns Array of related credential terms for broader matching
 * 
 * @example
 * expandCredentials('degree') 
 * // Returns: ['degree', 'diploma', 'university program', 'university or college']
 */
function expandCredentials(credential: string): string[] {
  const normalizedCredential = credential.toLowerCase().trim() as CredentialType;

  // Define credential mappings for more maintainable expansion logic
  const credentialMappings: Record<CredentialType, string[]> = {
    degree: [
      'degree',
      'diploma',
      'university program',
      'university or college'
    ],
    diploma: [
      'diploma',
      'college program',
      'college or other program'
    ],
    certificate: [
      'certificate',
      'school programs',
      'school program',
      'apprenticeship',
      'red seal',
      'trades program',
      'trades school'
    ],
    trades: [
      'trades school',
      'trades program',
      'trades certificate',
      'trades diploma',
      'trades degree',
      'trades university',
      'trades college',
      'trade school',
      'trade program',
      'trade certificate',
      'trade diploma',
      'trade degree',
      'red seal'
    ]
  };

  return credentialMappings[normalizedCredential] || [];
}

/**
 * Searches the database for employment requirement sections that match the provided
 * credential and search term combinations.
 * 
 * This function looks for sections titled "Employment requirements" and filters their
 * items to find matches that contain both a credential type and a search term.
 * Items requiring years of experience are excluded to focus on educational requirements.
 * 
 * @param searchPairs - Array of [credential, searchTerm] tuples to search for
 * @returns Array of sections with matching employment requirements
 */
async function findRelatedSections(
  searchPairs: [string, string][]
): Promise<Section[]> {
  // Fetch all sections with employment requirements from the database
  const employmentRequirementEntities = await prisma.sectionsEntity.findMany({
    where: {
      title: 'Employment requirements',
    },
    include: {
      unitGroup: true, // Include related unit group data (NOC code and occupation)
    },
  });

  const relatedSections: Section[] = [];

  // Process each employment requirements section
  employmentRequirementEntities.forEach((entity) => {
    // Filter requirement items to find those matching our search criteria
    const matchingItems = entity.items.filter((item: string) => {
      const itemLower = item.toLowerCase();

      // Skip items that require years of experience as we're focusing on educational requirements
      const hasExperienceRequirement = itemLower.includes('years of experience');
      if (hasExperienceRequirement) {
        return false;
      }

      // Check if ANY credential-searchTerm pair has both elements present in this item
      // This ensures we find requirements that mention both the credential type AND
      // something related to the program (title keywords or NOC search terms)
      const hasMatchingPair = searchPairs.some(([credential, searchTerm]) =>
        itemLower.includes(credential.toLowerCase()) &&
        itemLower.includes(searchTerm.toLowerCase())
      );

      return hasMatchingPair;
    });

    // If we found matching items, add this section to our results
    if (matchingItems.length > 0) {
      relatedSections.push({
        unitGroup: {
          noc: entity.unitGroup.noc,
          occupation: entity.unitGroup.occupation,
        },
        requirements: entity.items, // All requirements for reference
        items: matchingItems,      // Only the matching requirements
      });
    }
  });

  return relatedSections;
}

/**
 * Processes a single section to fetch related unit group and outlook data.
 * Returns null if any required data is missing.
 * 
 * @param section - The section to process
 * @returns Processed result with outlook data or null if data is incomplete
 */
async function processSectionToResult(section: Section): Promise<ProcessedResult | null> {
  try {
    // Find the unit group by NOC code
    const unitGroup = await prisma.unitGroup.findFirst({
      where: {
        noc: section.unitGroup.noc,
      },
    });

    if (!unitGroup) {
      console.warn(`Unit group not found for NOC: ${section.unitGroup.noc}`);
      return null;
    }

    // Find the outlook for this NOC code
    const outlook = await prisma.outlook.findFirst({
      where: {
        noc: unitGroup.noc,
      },
    });

    if (!outlook) {
      console.warn(`Outlook not found for NOC: ${unitGroup.noc}`);
      return null;
    }

    return {
      noc: unitGroup.noc,
      title: unitGroup.occupation,
      outlook: outlook.outlook,
      items: section.items,
    };
  } catch (error: unknown) {
    console.error('Error processing section:', {
      noc: section.unitGroup.noc,
      error
    });
    return null;
  }
}

/**
 * API Route: POST /api/programs/[nid]/process-outlooks
 * 
 * Processes career outlooks for a given program by:
 * 1. Finding the program by its numeric ID
 * 2. Generating search terms from program title and NOC keywords
 * 3. Expanding credential types into related terms
 * 4. Searching for matching employment requirements
 * 5. Fetching outlook data for matching occupations
 * 
 * @param request - The HTTP request object
 * @param context - Route context containing the program NID parameter
 * @returns JSON response with career outlook results
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ nid: string; }>; }
) {
  // Extract the dynamic route parameter BEFORE the try block
  // This ensures 'nid' is available in both try and catch blocks for logging
  // In Next.js 15, route parameters must be awaited before use
  let nid: string;

  try {
    const params = await context.params;
    nid = params.nid;
  } catch (paramError: unknown) {
    // Handle case where route parameters can't be extracted
    console.error('Failed to extract route parameters:', paramError);
    return NextResponse.json(
      { error: 'Invalid route parameters' },
      { status: 400 }
    );
  }

  try {
    // Find the program by its numeric ID
    const program = await prisma.program.findUnique({
      where: { nid: parseInt(nid) },
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Generate comprehensive search terms from multiple sources
    const searchTerms = [
      program.title.toLowerCase(),      // Program title for broader matching
      ...program.nocSearchKeywords,     // Specific NOC-related keywords
    ];

    // Expand the program's credential type into related terms for better matching
    const expandedCredentials = expandCredentials(program.credential);

    // Create all possible combinations of credentials and search terms
    // This creates a cartesian product to ensure comprehensive matching
    const searchPairs = expandedCredentials.flatMap(credential =>
      searchTerms.map(term => [credential, term] as [string, string])
    );

    console.log(`Generated ${searchPairs.length} search combinations for program ${nid}`);

    // Find employment requirement sections that match our search criteria
    const relatedSections = await findRelatedSections(searchPairs);

    // Process each section to get complete outlook data
    const processedResultPromises = relatedSections.map(processSectionToResult);
    const processedResults = await Promise.all(processedResultPromises);

    // Filter out any null results from processing errors or missing data
    const validResults = processedResults.filter(
      (result): result is ProcessedResult => result !== null
    );

    // TODO: Implement handling for known NOC groups
    // This appears to be for directly matching NOC codes from program.nocSearchKeywords
    const knownNocGroups = await prisma.unitGroup.findMany({
      where: {
        noc: {
          in: program.nocSearchKeywords,
        },
      },
    });
    console.log(`Found ${knownNocGroups.length} known NOC groups`);

    // Return successful response with results
    return NextResponse.json({
      success: true,
      count: validResults.length,
      results: validResults,
    });

  } catch (error: unknown) {
    // Now 'nid' is accessible here since it was declared outside the try block
    // This helps with debugging by including the program ID in error logs
    console.error('Error processing outlooks for program:', { nid, error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
