import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Section {
  unitGroup: {
    noc: string;
    occupation: string;
  };
  requirements: string[];
  items: string[];
}

function expandCredentials(credential: string): string[] {
  const credentials: string[] = [];

  switch (credential.toLowerCase().trim()) {
    case 'degree':
      credentials.push('degree', 'diploma', 'university program', 'university or college');
      break;
    case 'diploma':
      credentials.push('diploma', 'college program', 'college or other program');
      break;
    case 'certificate':
      credentials.push(
        'certificate',
        'school programs',
        'school program',
        'apprenticeship',
        'red seal',
        'trades program',
        'trades school'
      );
      break;
    case 'trades':
      credentials.push(
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
      );
      break;
  }

  return credentials;
}

async function findRelatedSections(
  searchPairs: [string, string][]
): Promise<Section[]> {
  const employmentRequirementEntities = await prisma.sectionsEntity.findMany({
    where: {
      title: 'Employment requirements',
    },
    include: {
      unitGroup: true,
    },
  });

  const relatedSections: Section[] = [];

  employmentRequirementEntities.forEach((entity) => {
    const matchingItems = entity.items.filter((item: string) => {
      // Skip if experience is required
      const hasExperienceRequirement = item.toLowerCase().includes('years of experience');
      if (hasExperienceRequirement) return false;

      const itemLower = item.toLowerCase();

      // Check if ANY pair of [credential, searchTerm] matches completely
      const hasMatchingPair = searchPairs.some(([credential, searchTerm]) =>
        itemLower.includes(credential.toLowerCase()) &&
        itemLower.includes(searchTerm.toLowerCase())
      );

      return hasMatchingPair;
    });

    if (matchingItems.length > 0) {
      relatedSections.push({
        unitGroup: {
          noc: entity.unitGroup.noc,
          occupation: entity.unitGroup.occupation,
        },
        requirements: entity.items,
        items: matchingItems,
      });
    }
  });

  return relatedSections;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ nid: string; }>; }
) {
  const { nid } = await context.params;

  try {
    const program = await prisma.program.findUnique({
      where: { nid: parseInt(nid) },
    });

    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    // Generate search terms from program title and credential
    const searchTerms = [
      program.title.toLowerCase(),
      ...program.nocSearchKeywords,
    ];

    // Get expanded credentials for broader matching
    const expandedCredentials = expandCredentials(program.credential);

    const fullListOfSearches = expandedCredentials.flatMap(credential =>
      searchTerms.map(term => [credential, term] as [string, string])
    );
    console.log(fullListOfSearches);

    // Find related sections using both search terms and credentials
    const relatedSections = await findRelatedSections(
      fullListOfSearches
    );

    // Process the results
    const processedResults = relatedSections.map(async (section) => {
      try {
        const unitGroup = await prisma.unitGroup.findFirst({
          where: {
            noc: section.unitGroup.noc,
          },
        });

        if (!unitGroup) {
          return null;
        }

        const outlook = await prisma.outlook.findFirst({
          where: {
            noc: unitGroup.noc,
          },
        });

        if (!outlook) {
          return null;
        }

        return {
          noc: unitGroup.noc,
          title: unitGroup.occupation,
          outlook: outlook.outlook,
          items: section.items,
        };
      } catch (error: unknown) {
        console.error('Error processing section:', { cause: error });
        return null;
      }
    });

    // Filter out any null results from errors
    const results = (await Promise.all(processedResults)).filter(result => result !== null);

    // don't forget known noc groups
    const knownNocGroups = await prisma.unitGroup.findMany({
      where: {
        noc: {
          in: program.nocSearchKeywords,
        },
      },
    });
    console.log(knownNocGroups.length);

    return NextResponse.json({
      success: true,
      count: results.length,
      results: results,
    });
  } catch (error: unknown) {
    console.error('Error processing outlooks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
