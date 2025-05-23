import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Constants for skeleton layout - makes it easy to adjust the loading structure
const SKELETON_SECTIONS_COUNT = 3
const SKELETON_ITEMS_PER_SECTION = 4

/**
 * Loading Component for NOC (National Occupational Classification) Pages
 *
 * This component is automatically rendered by Next.js App Router when navigating
 * to /noc/[noc] routes while the actual page content is being fetched.
 *
 * Features:
 * - Sticky header with navigation that mimics the actual page layout
 * - Responsive design that adapts to mobile and desktop viewports
 * - Skeleton placeholders that approximate the real content structure
 * - Backdrop blur effect for visual polish during loading states
 */
export default function Loading() {
  return (
    <main className='container mx-auto px-4 pt-6 sm:pt-10 space-y-6 sm:space-y-8'>
      {/* 
        Sticky Header Section
        
        This header stays visible while scrolling and matches the layout of the actual page.
        The backdrop blur creates a polished glass effect when content scrolls behind it.
        
        Key responsive behaviors:
        - Mobile: Stacked layout with full-width back button
        - Desktop: Side-by-side layout with auto-width back button
      */}
      <header className='sticky top-0 sm:top-[10px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 py-3 sm:py-4 -mx-4 px-4'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0'>
          {/* Title and code placeholder section */}
          <div>
            {/* Main title skeleton - wider on desktop for longer NOC titles */}
            <Skeleton className='h-9 w-[300px] sm:w-[400px]' />
            {/* NOC code skeleton - consistent small width across devices */}
            <Skeleton className='h-5 w-24 mt-1 sm:mt-2' />
          </div>

          {/* 
            Navigation back button
            
            Using asChild pattern with Link for proper Next.js routing
            while maintaining Button component styling and accessibility
          */}
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

      {/* 
        Main Content Skeleton Structure
        
        Creates multiple sections with varying content to simulate the actual
        NOC page structure (job description, requirements, salary info, etc.)
      */}
      <div className='grid gap-4 sm:gap-6'>
        {Array.from({ length: SKELETON_SECTIONS_COUNT }, (_, sectionIndex) => (
          <section key={sectionIndex} className='space-y-3'>
            {/* Section heading skeleton */}
            <Skeleton className='h-7 w-48' />

            {/* Section content - multiple lines of text */}
            <div className='space-y-2'>
              {Array.from(
                { length: SKELETON_ITEMS_PER_SECTION },
                (_, itemIndex) => (
                  <Skeleton key={itemIndex} className='h-5 w-full' />
                )
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
