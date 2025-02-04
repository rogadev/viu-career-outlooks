'use client'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

/**
 * A collapsible dropdown component that shows/hides instructions text.
 * Uses shadcn's Collapsible component for the expanding/collapsing functionality.
 *
 * @param {Object} props - Component props
 * @param {string} props.instructions - The instruction text to display when expanded
 * @returns {ReactElement} A button that toggles instruction visibility
 */
export default function InstructionsDropdown({
  instructions,
}: {
  instructions: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible className='mb-4 w-full' open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        {/* Using asChild to maintain button semantics while using Collapsible trigger functionality */}
        <Button
          variant='link'
          className='p-0 h-auto font-normal flex items-center gap-1'
          aria-expanded={isOpen}
          aria-controls='instructions-content'
        >
          {/* Chevron icon that rotates 180 degrees when expanded */}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
          <span className='text-blue-600 underline '>
            {isOpen ? 'Hide' : 'Show'} Instructions
          </span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent id='instructions-content' className='mt-2'>
        <div className='rounded-lg border bg-card p-4 text-card-foreground shadow-sm'>
          <p className='text-gray-700'>{instructions}</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
