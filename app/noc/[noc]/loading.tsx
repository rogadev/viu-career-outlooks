import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function Loading() {
  return (
    <main className='container mx-auto px-4 pt-6 sm:pt-10 space-y-6 sm:space-y-8'>
      {/* Sticky Header Section */}
      <header className='sticky top-0 sm:top-[10px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 py-3 sm:py-4 -mx-4 px-4'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0'>
          <div>
            <Skeleton className='h-9 w-[300px] sm:w-[400px]' />
            <Skeleton className='h-5 w-24 mt-1 sm:mt-2' />
          </div>
          <Button
            variant='outline'
            size='sm'
            asChild
            className='w-full sm:w-auto'
          >
            <Link href='/' className='flex items-center gap-2'>
              <ArrowLeft className='h-4 w-4' />
              Back
            </Link>
          </Button>
        </div>
      </header>

      {/* Skeleton sections */}
      <div className='grid gap-4 sm:gap-6'>
        {[1, 2, 3].map((section) => (
          <section key={section} className='space-y-3'>
            <Skeleton className='h-7 w-48' />
            <div className='space-y-2'>
              {[1, 2, 3, 4].map((item) => (
                <Skeleton key={item} className='h-5 w-full' />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
