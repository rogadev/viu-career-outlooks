import { ReactNode } from 'react'

interface SectionWrapperProps {
  title: string
  children: ReactNode
}

const SectionWrapper = ({ title, children }: SectionWrapperProps) => {
  return (
    <section className='w-full h-full flex flex-col'>
      <h2 className='text-2xl font-semibold mb-4'>{title}</h2>
      <div className='flex-1'>{children}</div>
    </section>
  )
}

export default SectionWrapper
