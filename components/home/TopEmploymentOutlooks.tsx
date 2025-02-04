import SectionWrapper from './SectionWrapper'
import OutlookItems from '../global/OutlookItems'

type TopEmploymentOutlooksProps = {
  type: 'top' | 'bottom'
  erc: string
}

/**
 * TopEmploymentOutlooks displays a section showing either the top or bottom employment outlooks
 * based on the provided type parameter. The component wraps the outlook data in a section
 * with a scrollable container for better mobile responsiveness.
 *
 * @param {Object} props - Component props
 * @param {'top' | 'bottom'} props.type - Determines whether to show top or bottom employment outlooks
 * @param {string} props.erc - Economic Region Code to filter the outlooks
 * @returns {ReactElement} A section containing employment outlook data
 */
const TopEmploymentOutlooks = async ({
  type,
  erc,
}: TopEmploymentOutlooksProps) => {
  const title =
    type === 'top' ? 'Top Employment Outlooks' : 'Bottom Employment Outlooks'

  return (
    <div className='w-full overflow-x-auto'>
      <SectionWrapper title={title}>
        <OutlookItems end={type} erc={erc} />
      </SectionWrapper>
    </div>
  )
}

export default TopEmploymentOutlooks
