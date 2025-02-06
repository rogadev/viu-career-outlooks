import { ReactElement } from 'react'
import { type Program } from '@prisma/client'
import { notFound } from 'next/navigation'
import React from 'react'

interface ProgramDataProps {
  program: Program
  children: ReactElement
}

export default async function ProgramData({
  program,
  children,
}: ProgramDataProps): Promise<ReactElement> {
  if (!program) {
    notFound()
  }

  return React.cloneElement(children, { program } as { program: Program })
}
