import { ReactElement } from 'react'
import EmploymentOutlooks from './EmploymentOutlooks'
import type { Program, ProgramArea } from '@prisma/client'

interface ProgramInfoProps {
  program?: Program & {
    programArea: ProgramArea
  }
}

export default function ProgramInfo({
  program,
}: ProgramInfoProps): ReactElement | null {
  if (!program) return null

  return (
    <section>
      <header className='container mx-auto py-8'>
        <h1 className='text-3xl font-bold mb-2'>{program.title}</h1>
        <h2 className='text-xl font-bold mb-6'>
          Program ID: {program.nid.toString()}
        </h2>
      </header>
      <div className='container mx-auto'>
        <EmploymentOutlooks program={program} />
      </div>
    </section>
  )
}
