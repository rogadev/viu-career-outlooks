import { ReactNode, ReactElement } from 'react'

/**
 * Props interface for the SectionWrapper component
 *
 * @interface SectionWrapperProps
 * @property {string} title - The heading text displayed at the top of the section
 * @property {ReactNode} children - Any React components or JSX elements to be rendered in the content area
 */
interface SectionWrapperProps {
  title: string
  children: ReactNode
}

/**
 * SectionWrapper Component
 *
 * A reusable layout component that provides a consistent structure for content sections
 * throughout the application. Creates a full-height section with a title header and
 * a flexible content area below.
 *
 * Layout Strategy:
 * - Uses CSS Flexbox with column direction for vertical stacking
 * - Header (h2) takes only the space it needs
 * - Content area (div) expands to fill remaining vertical space using flex-1
 *
 * Use Cases:
 * - Home page sections (e.g., "Featured Programs", "Quick Stats")
 * - Dashboard sections
 * - Any content area that needs a title and flexible content space
 *
 * @param {SectionWrapperProps} props - Component props
 * @returns {ReactElement} A section element containing the title and children
 *
 * @example
 * ```tsx
 * <SectionWrapper title="Featured Programs">
 *   <ProgramList programs={programs} />
 * </SectionWrapper>
 * ```
 */
const SectionWrapper = ({
  title,
  children,
}: SectionWrapperProps): ReactElement => {
  return (
    <section className='w-full h-full flex flex-col'>
      {/* 
        Section title header
        - text-2xl: Large font size for visual hierarchy
        - font-semibold: Medium font weight for readability without being too bold
        - mb-4: Bottom margin for spacing between title and content
      */}
      <h2 className='text-2xl font-semibold mb-4'>{title}</h2>

      {/* 
        Content container
        - flex-1: Takes up all remaining vertical space in the flex container
        - This allows the content area to expand and fill the available height
        - Perfect for cards, lists, or any content that should fill the section
      */}
      <div className='flex-1'>{children}</div>
    </section>
  )
}

export default SectionWrapper
