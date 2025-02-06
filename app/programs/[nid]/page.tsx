import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import ProgramData from '@/components/programs/ProgramData'
import ProgramInfo from '@/components/programs/ProgramInfo'

interface ProgramPageProps {
  params: Promise<{ nid: string }>
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { nid } = await params
  const nidNumber = parseInt(nid)

  const program = await prisma.program.findUnique({
    where: {
      nid: nidNumber,
    },
  })

  if (!program) {
    notFound()
  }

  return (
    <ProgramData program={program}>
      <ProgramInfo />
    </ProgramData>
  )
}
