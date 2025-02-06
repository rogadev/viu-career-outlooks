import { redirect } from 'next/navigation'
import { ReactElement } from 'react'

export default function ProgramsPage(): ReactElement {
  redirect('/credentials')
}
