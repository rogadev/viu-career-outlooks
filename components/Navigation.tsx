// components/Navigation.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Logo } from './global/Logo'
import { Button } from './ui/button'

const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Credentials', href: '/credentials' },
  { name: 'Career Paths', href: '/career-paths' },
  { name: 'Employment Outlook', href: '/employment-outlook' },
  { name: 'About VIU', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className='bg-primary border-b border-primary-light'>
      <div className='container mx-auto flex items-center justify-between p-4'>
        <Link href='/' aria-label='VIU Home'>
          <Logo width={150} height={150} />
        </Link>
        <Button
          className='bg-cta hover:bg-cta-light md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cta-light'
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-controls='mobile-menu'
        >
          <Menu className='text-white h-6 w-6' />
        </Button>
        <div className='hidden md:flex space-x-4'>
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className='text-secondary-light hover:text-secondary'
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      {isOpen && (
        <div className='md:hidden' id='mobile-menu'>
          <div className='space-y-1 px-2 pt-2 pb-3'>
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='block text-secondary-light hover:text-secondary'
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
