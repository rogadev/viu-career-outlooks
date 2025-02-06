'use client'
import { ReactElement, useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import type { Program } from '@prisma/client'
import Link from 'next/link'
import LoadingOutlooks from './LoadingOutlooks'

interface EmploymentOutlooksProps {
  program: Program
}

interface NocResult {
  noc: string
  title: string
  outlook: string
  items: string[]
}

export default function EmploymentOutlooks({
  program,
}: EmploymentOutlooksProps): ReactElement {
  const [nocData, setNocData] = useState<NocResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // This component will handle the background processing of employment outlooks
  useEffect(() => {
    const processOutlooks = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          `/api/programs/${program.nid}/process-outlooks`,
          {
            method: 'POST',
          }
        )
        const { results } = await response.json()

        // Sort the results by outlook priority
        const sortedResults = [...(results || [])].sort((a, b) => {
          const outlookPriority: { [key: string]: number } = {
            'very good': 5,
            good: 4,
            moderate: 3,
            limited: 2,
            'very limited': 1,
            undetermined: 0,
          }

          return (
            (outlookPriority[b.outlook.toLowerCase()] || 0) -
            (outlookPriority[a.outlook.toLowerCase()] || 0)
          )
        })

        setNocData(sortedResults)
      } catch (error) {
        console.error('Error fetching outlooks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    processOutlooks()
  }, [program.nid])

  if (isLoading) {
    return <LoadingOutlooks />
  }

  return (
    <Card>
      <CardHeader>
        <h2 className='text-2xl font-semibold'>Employment Outlooks</h2>
      </CardHeader>
      <CardContent>
        {nocData.length > 0 ? (
          <div className='space-y-6'>
            {nocData.map((noc, index) => (
              <Link
                href={`/noc/${noc.noc}`}
                key={noc.noc}
                className='block hover:bg-muted transition-colors'
              >
                <div id={`noc-${index}`} className='border rounded-lg p-4'>
                  <h3 className='text-lg font-semibold mb-2'>
                    {noc.title}{' '}
                    <span className='text-sm text-muted-foreground'>
                      (NOC: {noc.noc})
                    </span>
                  </h3>

                  <p className='mb-2'>
                    <span className='font-medium'>Outlook:</span> {noc.outlook}
                  </p>
                  {noc.items.length > 0 && (
                    <div>
                      <h4 className='font-medium mb-1'>
                        Additional Information:
                      </h4>
                      <ul className='list-disc list-inside'>
                        {noc.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>No employment outlook data available for this program.</p>
        )}
      </CardContent>
    </Card>
  )
}
