'use client'

import { ReactElement, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'

// Constants for better maintainability and avoiding magic values
const ANIMATION_DURATION = 'duration-200'
const CHEVRON_ROTATION_DEGREES = 'rotate-180'
const CONTENT_ID = 'instructions-content'

/**
 * Props interface for the InstructionsDropdown component
 * Provides type safety and clear documentation of expected props
 */
interface InstructionsDropdownProps {
  /** The instruction text to display when the dropdown is expanded */
  instructions: string
}

/**
 * A collapsible dropdown component that shows/hides instructions text.
 * 
 * This component provides a clean way to display instructions that users can
 * toggle on/off to reduce visual clutter. Perfect for forms, tutorials, or
 * any content where instructions might be helpful but not always needed.
 * 
 * Features:
 * - Smooth expand/collapse animation
 * - Rotating chevron icon for visual feedback
 * - Accessible with proper ARIA attributes
 * - Responsive design with shadcn components
 * 
 * @param props - Component props
 * @param props.instructions - The instruction text to display when expanded
 * @returns A button that toggles instruction visibility with smooth animations
 */
export default function InstructionsDropdown({
  instructions,
}: InstructionsDropdownProps): ReactElement {
  // State to track whether the instructions are currently visible
  // Starting with false means instructions are hidden by default
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // Generate dynamic text for the button based on current state
  // This provides clear context to users about what the button will do
  const buttonText = `${isOpen ? 'Hide' : 'Show'} Instructions`

  // Dynamic CSS classes for the chevron icon rotation animation
  // The chevron rotates 180 degrees when open to indicate state change
  const chevronClasses = `h-4 w-4 transition-transform ${ANIMATION_DURATION} ${
    isOpen ? `transform ${CHEVRON_ROTATION_DEGREES}` : ''
  }`

  return (
    {/* 
      Collapsible wrapper component from shadcn
      - Controls the overall expand/collapse functionality
      - 'open' prop controls current state
      - 'onOpenChange' callback updates our local state when toggled
      - 'w-full' ensures the component takes full width of its container
      - 'mb-4' adds bottom margin for spacing from other content
    */}
    <Collapsible 
      className='mb-4 w-full' 
      open={isOpen} 
      onOpenChange={setIsOpen}
    >
      {/* 
        CollapsibleTrigger wraps the button that users click to toggle
        'asChild' prop passes the trigger functionality to our Button component
        instead of creating a nested button (which would be invalid HTML)
      */}
      <CollapsibleTrigger asChild>
        <Button
          variant='link'
          className='p-0 h-auto font-normal flex items-center gap-1'
          aria-expanded={isOpen}
          aria-controls={CONTENT_ID}
          aria-describedby='instructions-description'
        >
          {/* 
            Chevron icon that provides visual feedback about state
            - Rotates 180 degrees when instructions are open
            - Smooth transition animation for better user experience
            - Size h-4 w-4 keeps it proportional to text
          */}
          <ChevronDown className={chevronClasses} />
          
          {/* 
            Button text that changes based on current state
            - Blue color and underline make it look like a typical link
            - Text dynamically updates to show current action
          */}
          <span className='text-blue-600 underline'>
            {buttonText}
          </span>
        </Button>
      </CollapsibleTrigger>

      {/* 
        CollapsibleContent contains the actual instructions
        - Only visible when isOpen is true
        - Smooth expand/collapse animation is handled automatically
        - 'id' attribute connects to aria-controls for accessibility
        - 'mt-2' adds top margin to separate from the trigger button
      */}
      <CollapsibleContent 
        id={CONTENT_ID} 
        className='mt-2'
      >
        {/* 
          Instructions container with shadcn card styling
          - 'rounded-lg border' gives it a modern card appearance
          - 'bg-card' and 'text-card-foreground' use theme colors
          - 'shadow-sm' adds subtle depth
          - 'p-4' provides comfortable padding around content
        */}
        <div className='rounded-lg border bg-card p-4 text-card-foreground shadow-sm'>
          {/* 
            Instructions text paragraph
            - 'text-gray-700' ensures good readability
            - Instructions prop is safely rendered as text content
          */}
          <p className='text-gray-700'>{instructions}</p>
        </div>
      </CollapsibleContent>

      {/* 
        Hidden description for screen readers
        Provides additional context about what this component does
      */}
      <div 
        id='instructions-description' 
        className='sr-only'
      >
        Toggle to show or hide detailed instructions for this section
      </div>
    </Collapsible>
  )
}
