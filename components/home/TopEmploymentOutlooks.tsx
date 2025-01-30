import SectionWrapper from './SectionWrapper'
import OutlookItems from '../global/OutlookItems'

type TopEmploymentOutlooksProps = {
  type: 'top' | 'bottom'
  erc: string
}

const TopEmploymentOutlooks = async ({
  type,
  erc,
}: TopEmploymentOutlooksProps) => {
  const title =
    type === 'top' ? 'Top Employment Outlooks' : 'Bottom Employment Outlooks'

  return (
    <SectionWrapper title={title}>
      <OutlookItems end={type} erc={erc} />
    </SectionWrapper>
  )
}

export default TopEmploymentOutlooks
