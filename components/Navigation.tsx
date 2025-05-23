// components/Navigation.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import Logo from './Logo'
import { Button } from './ui/button'

/**
 * Type definition for navigation items to ensure consistency
 * and provide better TypeScript support
 */
interface NavigationItem {
  name: string
  href: string
}

/**
 * Navigation items configuration array.
 *
 * Structure explanation:
 * - name: Display text shown to users
 * - href: Destination URL (internal relative paths or external absolute URLs)
 *
 * Notes:
 * - Internal links use relative paths starting with '/' for Next.js routing
 * - External links (like VIU) use complete URLs with protocol
 * - Order in this array determines display order in both desktop and mobile menus
 */
const navigationItems: NavigationItem[] = [
  { name: 'Credentials', href: '/credentials' },
  { name: 'Career Paths', href: '/career-paths' },
  { name: 'Employment Outlook', href: '/employment-outlook' },
  { name: 'VIU', href: 'https://www.viu.ca/' },
]

/**
 * Responsive Navigation Component
 *
 * This component implements a responsive navigation pattern:
 * - Desktop (lg screens and up): Horizontal menu with visible links
 * - Mobile/Tablet (below lg): Collapsible hamburger menu
 *
 * Responsive Strategy:
 * - Uses Tailwind's 'lg:' prefix for large screen breakpoint (1024px+)
 * - Mobile menu is hidden by default and toggles with smooth animations
 * - Logo and hamburger button always visible on mobile
 *
 * Accessibility Features:
 * - Proper ARIA labels and controls for screen readers
 * - Keyboard navigation support through semantic HTML
 * - Focus management with focus:ring utilities
 * - aria-expanded attribute indicates menu state to assistive technology
 *
 * @returns {ReactElement} A fully responsive navigation bar component
 */
export default function Navigation() {
  // State to control mobile menu visibility
  // false = closed (default), true = open
  const [isOpen, setIsOpen] = useState(false)

  /**
   * Toggle function for mobile menu state
   * Flips the current state between open/closed
   * Used by the hamburger button click handler
   */
  const toggleMenu = (): void => {
    setIsOpen(!isOpen)
  }

  /**
   * Helper function to close mobile menu
   * Used when user clicks on a navigation link to improve UX
   * Prevents menu staying open after navigation
   */
  const closeMobileMenu = (): void => {
    setIsOpen(false)
  }

  /**
   * Generates consistent styling classes for navigation links
   * Centralizes link styling to maintain design consistency
   * @param isMobile - Whether this is for mobile or desktop menu
   */
  const getLinkClasses = (isMobile: boolean): string => {
    const baseClasses =
      'text-white hover:text-secondary-light transition-colors duration-200'

    if (isMobile) {
      // Mobile links: block layout with padding and background hover effect
      return `block px-3 py-2 text-sm sm:text-base ${baseClasses} hover:bg-primary-light rounded-md`
    }

    // Desktop links: inline layout with horizontal padding
    return `px-3 py-2 text-sm sm:text-base ${baseClasses}`
  }

  /**
   * Dynamic classes for mobile menu container
   * Implements smooth slide-down animation using CSS transitions
   *
   * Animation Explanation:
   * - max-h-0 + opacity-0: Completely hidden state
   * - max-h-64 + opacity-100: Fully visible state
   * - overflow-hidden: Prevents content spillover during animation
   * - transition-all: Animates both height and opacity changes
   * - duration-300: 300ms animation timing
   * - ease-in-out: Smooth acceleration/deceleration curve
   */
  const mobileMenuClasses = `lg:hidden transition-all duration-300 ease-in-out ${
    isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
  }`

  return (
    <nav className='bg-primary border-b border-primary-light'>
      {/* 
        Main navigation container with VIU brand colors
        - bg-primary: VIU's primary brand color background
        - border-b border-primary-light: Subtle bottom border for visual separation
      */}
      {/* 
        Content container with responsive padding
        - container mx-auto: Centers content and provides max-width
        - px-4 py-3: Consistent padding on all screen sizes
      */}
      <div className='container mx-auto px-4 py-3'>
        {/* 
          Top navigation bar layout
          Uses flexbox for optimal alignment between logo and menu controls
        */}
        <div className='flex items-center justify-between'>
          {/* 
            Logo and branding section
            - Combines VIU logo with text branding
            - Entire area is clickable and leads to homepage
            - aria-label provides context for screen readers
          */}
          <Link
            href='/'
            aria-label='VIU Home'
            className='flex items-center gap-3'
          >
            {/* Logo component with fixed dimensions for consistency */}
            <Logo width={40} height={40} />

            {/* 
              Responsive branding text
              - text-base on mobile, text-xl on small screens and up
              - font-semibold provides appropriate visual hierarchy
            */}
            <span className='text-white text-base sm:text-xl font-semibold'>
              VIU Career Outlooks
            </span>
          </Link>

          {/* 
            Mobile hamburger menu button
            - Only visible on large screens and below (lg:hidden)
            - Uses VIU's call-to-action colors for consistency
            - Includes proper ARIA attributes for accessibility
          */}
          <Button
            className='bg-cta hover:bg-cta-light p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cta-light lg:hidden'
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls='mobile-menu'
          >
            {/* Menu icon with responsive sizing */}
            <Menu className='text-white h-5 w-5 sm:h-6 sm:w-6' />
          </Button>

          {/* 
            Desktop navigation menu
            - Hidden on mobile (hidden), visible on large screens (lg:flex)
            - Horizontal layout with consistent spacing
            - space-x-1 on mobile, space-x-4 on small screens+ for better spacing
          */}
          <div className='hidden lg:flex items-center space-x-1 sm:space-x-4'>
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={getLinkClasses(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* 
          Mobile dropdown menu
          - Hidden on desktop screens (lg:hidden)
          - Smooth slide-down animation controlled by isOpen state
          - Uses CSS transitions for smooth user experience
          
          Animation Details:
          - Closed: max-height 0, opacity 0, overflow hidden
          - Open: max-height 16rem (64 * 0.25rem), opacity 100%
          - Duration: 300ms with ease-in-out timing function
        */}
        <div className={mobileMenuClasses} id='mobile-menu'>
          {/* 
            Mobile menu content container
            - space-y-1: Vertical spacing between menu items
            - py-3: Top and bottom padding for the menu area
          */}
          <div className='space-y-1 py-3'>
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={getLinkClasses(true)}
                onClick={closeMobileMenu} // Auto-close menu when link is clicked
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
