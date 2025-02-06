import { ReactElement } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

export default function LoadingOutlooks(): ReactElement {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-8 w-64' />
      </CardHeader>
      <CardContent className='space-y-4'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
      </CardContent>
    </Card>
  )
}
