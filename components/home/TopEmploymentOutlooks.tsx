type TopEmploymentOutlooksProps = {
  type: 'top' | 'bottom'
}

const TopEmploymentOutlooks = ({ type }: TopEmploymentOutlooksProps) => {
  return <div>TopEmploymentOutlooks - {type}</div>
}

export default TopEmploymentOutlooks
