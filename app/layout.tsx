import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

// These font configurations create CSS variables that can be used throughout the app
// Access them in your CSS using var(--font-geist-sans) and var(--font-geist-mono)
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// Define metadata for SEO and browser tab information
export const metadata: Metadata = {
  title: 'VIU Career Outlooks',
  description:
    'Explore potential job titles and 3-year outlooks for VIU degrees based on Government of Canada employment outlook data',
}

// Root layout component that wraps all pages in the application
// This component provides the basic HTML structure and shared UI elements
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        // Apply font variables and basic styling to the entire app
        // - antialiased: Smooths font edges for better readability
        // - min-h-screen: Ensures minimum height fills the viewport
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {/* This structure ensures the footer stays at the bottom even with minimal content */}
        <div className='flex flex-col min-h-screen w-full'>
          <Navigation />
          {/* Main content area that grows to fill available space */}
          <div className='flex-grow w-full'>
            {/* Container with responsive padding and max width */}
            {/* px-4: padding on small screens */}
            {/* sm:px-6: slightly larger padding on medium screens */}
            {/* lg:px-8: largest padding on large screens */}
            {/* max-w-7xl: prevents content from becoming too wide */}
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl'>
              {children}
            </div>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
