import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ReactElement } from 'react'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

/**
 * Font Configuration Section
 *
 * Next.js automatically optimizes Google Fonts by:
 * 1. Downloading font files at build time (not runtime)
 * 2. Self-hosting them for better performance and privacy
 * 3. Creating CSS variables for easy access throughout the app
 *
 * The 'variable' property creates custom CSS properties that can be used in:
 * - Tailwind config (for font families)
 * - Regular CSS using var(--font-geist-sans)
 * - Any component that needs these specific fonts
 */
const geistSans = Geist({
  variable: '--font-geist-sans', // Creates CSS custom property: --font-geist-sans
  subsets: ['latin'], // Only load Latin characters to reduce bundle size
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono', // Creates CSS custom property: --font-geist-mono
  subsets: ['latin'], // Only load Latin characters for better performance
})

/**
 * Application Metadata Configuration
 *
 * This metadata object provides essential information for:
 * - Search Engine Optimization (SEO)
 * - Social media sharing (Open Graph)
 * - Browser tab titles and descriptions
 * - Accessibility tools and screen readers
 *
 * Next.js automatically injects this into the <head> of every page
 * unless overridden by page-specific metadata
 */
export const metadata: Metadata = {
  title: 'VIU Career Outlooks',
  description:
    'Explore potential job titles and 3-year outlooks for VIU degrees based on Government of Canada employment outlook data',
}

/**
 * Root Layout Component
 *
 * This is the top-level layout component in Next.js App Router that:
 * 1. Wraps ALL pages in the application (acts as the shell)
 * 2. Provides the basic HTML document structure
 * 3. Includes shared UI elements like navigation and footer
 * 4. Sets up global styling and font configurations
 *
 * Key architectural decisions:
 * - Uses a flex column layout for sticky footer behavior
 * - Implements responsive container with max-width constraints
 * - Applies font variables to the entire application
 * - Ensures accessibility with semantic HTML and proper language attribute
 *
 * @param children - The page content that will be rendered inside this layout
 * @returns The complete HTML document structure with shared UI elements
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): ReactElement {
  return (
    <html lang='en'>
      {' '}
      {/* Sets document language for accessibility and SEO */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        /**
         * Body class breakdown:
         * - geistSans.variable: Applies --font-geist-sans CSS custom property
         * - geistMono.variable: Applies --font-geist-mono CSS custom property
         * - antialiased: Tailwind class for smoother font rendering
         * - min-h-screen: Ensures body takes at least full viewport height
         */
      >
        {/* 
          Main Application Shell with Sticky Footer Layout
          
          This flex column layout ensures:
          1. Navigation stays at the top
          2. Main content expands to fill available space
          3. Footer sticks to the bottom, even with minimal content
          
          The w-full class ensures full width utilization
        */}
        <div className='flex flex-col min-h-screen w-full'>
          {/* Global Navigation Component */}
          <Navigation />

          {/* 
            Main Content Area
            
            The flex-grow class makes this section expand to fill all
            available vertical space between navigation and footer.
            This creates the "sticky footer" effect.
          */}
          <div className='flex-grow w-full'>
            {/* 
              Responsive Content Container
              
              This container implements a common responsive design pattern:
              
              - container: Centers content and applies max-width breakpoints
              - mx-auto: Centers the container horizontally
              - px-4: Base padding of 1rem on mobile devices
              - sm:px-6: Increases to 1.5rem padding on small screens (640px+)
              - lg:px-8: Increases to 2rem padding on large screens (1024px+)
              - w-full: Ensures container takes full available width
              - max-w-7xl: Prevents content from becoming too wide on very large screens
              
              This creates a comfortable reading experience across all device sizes
              while maintaining proper content hierarchy and spacing.
            */}
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl'>
              {/* 
                Page Content Injection Point
                
                This is where Next.js injects the content of individual pages.
                Each page component will be rendered here while maintaining
                the shared layout structure above and below.
              */}
              {children}
            </div>
          </div>

          {/* Global Footer Component */}
          <Footer />
        </div>
      </body>
    </html>
  )
}
