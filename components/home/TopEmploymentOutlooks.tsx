import { ReactElement } from 'react'
import SectionWrapper from './SectionWrapper'
import OutlookItems from '../global/OutlookItems'

/**
 * Props for the TopEmploymentOutlooks component
 */
type TopEmploymentOutlooksProps = {
  /** Determines whether to display top-performing or bottom-performing employment outlooks */
  type: 'top' | 'bottom'
  /** Economic Region Code used to filter employment outlook data to a specific geographic region */
  erc: string
}

/**
 * Generates the appropriate section title based on the outlook type
 *
 * This helper function centralizes the title generation logic, making it easier to
 * maintain consistent labeling and modify titles in the future if needed.
 *
 * @param type - The type of outlook data to display
 * @returns A human-readable title for the section
 */
const generateSectionTitle = (type: 'top' | 'bottom'): string => {
  return type === 'top'
    ? 'Top Employment Outlooks'
    : 'Bottom Employment Outlooks'
}

/**
 * TopEmploymentOutlooks displays a section containing either the highest or lowest
 * performing employment outlooks for a specific economic region.
 *
 * This component serves as a presentation wrapper that:
 * - Determines the appropriate section title based on the outlook type
 * - Provides horizontal scrolling for responsive design on mobile devices
 * - Delegates the actual data fetching and rendering to child components
 *
 * The component is async because it contains child components (OutlookItems) that
 * perform server-side data fetching operations. This allows for efficient server-side
 * rendering of the employment outlook data.
 *
 * @param props - Component configuration
 * @param props.type - Whether to show 'top' or 'bottom' performing employment outlooks
 * @param props.erc - Economic Region Code to filter results to a specific geographic area
 * @returns A responsive section displaying employment outlook data
 */
const TopEmploymentOutlooks = async ({
  type,
  erc,
}: TopEmploymentOutlooksProps): Promise<ReactElement> => {
  // Generate the section title based on whether we're showing top or bottom outlooks
  const sectionTitle = generateSectionTitle(type)

  return (
    // Outer container with horizontal scroll capability for mobile responsiveness
    // The 'w-full' ensures the container takes full width of its parent
    // 'overflow-x-auto' adds horizontal scrolling when content exceeds container width
    // This prevents layout breaking on smaller screens if outlook items are wide
    <div className='w-full overflow-x-auto'>
      {/* 
        SectionWrapper provides consistent styling, layout, and structure for all sections
        It handles the section title display and applies standard spacing/formatting
      */}
      <SectionWrapper title={sectionTitle}>
        {/* 
          OutlookItems handles the actual data fetching and rendering of employment outlook data
          
          Props explanation:
          - end: This prop name refers to which "end" of the data spectrum to show
                 (top = highest performing, bottom = lowest performing outlooks)
                 We pass our 'type' prop here as it contains the same values
          - erc: Economic Region Code that filters results to a specific geographic area
                 This ensures users only see data relevant to their selected region
        */}
        <OutlookItems end={type} erc={erc} />
      </SectionWrapper>
    </div>
  )
}

export default TopEmploymentOutlooks
