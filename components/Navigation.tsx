// components/Navigation.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import Logo from './Logo'
import { Button } from './ui/button'

/**
 * Navigation items configuration array.
 * Each item requires a name for display and href for routing.
 * External links (like VIU) use complete URLs, internal links use relative paths.
 */
const navigationItems = [
  { name: 'Credentials', href: '/credentials' },
  { name: 'Career Paths', href: '/career-paths' },
  { name: 'Employment Outlook', href: '/employment-outlook' },
  { name: 'VIU', href: 'https://www.viu.ca/' },
]

/**
 * Navigation component that provides both desktop and mobile-responsive navigation.
 * Features a hamburger menu for mobile views and horizontal links for desktop.
 * Includes VIU logo and branding.
 * @returns {ReactElement} A responsive navigation bar component
 */
export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className='bg-primary border-b border-primary-light'>
      <div className='container mx-auto px-4 py-3'>
        {/* Main navigation bar with logo and menu button */}
        <div className='flex items-center justify-between'>
          <Link
            href='/'
            aria-label='VIU Home'
            className='flex items-center gap-3'
          >
            <Logo width={40} height={40} className='w-8 h-8 sm:w-10 sm:h-10' />
            <span className='text-white text-base sm:text-xl font-semibold'>
              VIU Career Outlooks
            </span>
          </Link>
          {/* Mobile menu button - only visible on lg breakpoint and below */}
          <Button
            className='bg-cta hover:bg-cta-light p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cta-light lg:hidden'
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls='mobile-menu'
          >
            <Menu className='text-white h-5 w-5 sm:h-6 sm:w-6' />
          </Button>
          {/* Desktop navigation - hidden on mobile, visible on lg screens */}
          <div className='hidden lg:flex items-center space-x-1 sm:space-x-4'>
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='px-3 py-2 text-sm sm:text-base text-white hover:text-secondary-light transition-colors duration-200'
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu - animated dropdown with height/opacity transitions */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? 'max-h-64 opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
          id='mobile-menu'
        >
          <div className='space-y-1 py-3'>
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='block px-3 py-2 text-sm sm:text-base text-white hover:text-secondary-light hover:bg-primary-light rounded-md transition-colors duration-200'
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
