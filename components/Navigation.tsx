// components/Navigation.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Logo } from './global/Logo'
import { Button } from './ui/button'

const navigationItems = [
  { name: 'Credentials', href: '/credentials' },
  { name: 'Career Paths', href: '/career-paths' },
  { name: 'Employment Outlook', href: '/employment-outlook' },
  { name: 'VIU', href: 'https://www.viu.ca/' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className='bg-primary border-b border-primary-light'>
      <div className='container mx-auto flex items-center justify-between p-4'>
        <Link
          href='/'
          aria-label='VIU Home'
          className='flex items-center gap-3'
        >
          <Logo width={50} height={50} />
          <span className='text-white text-xl font-semibold'>
            VIU Career Outlooks
          </span>
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
              className='text-white hover:text-secondary-light'
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
                className='block text-white hover:text-secondary-light'
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
