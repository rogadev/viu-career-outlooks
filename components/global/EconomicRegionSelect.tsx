'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { EconomicRegion } from '@prisma/client'
import { setPreferredErc } from '@/lib/cookies'

/**
 * Props interface for the EconomicRegionSelect component
 */
interface EconomicRegionSelectProps {
  /** Array of economic regions to display in the dropdown */
  regions: EconomicRegion[]
  /** Default economic region code to use as fallback */
  defaultErc: string
  /** Current selected value (for controlled component usage) */
  value?: string
  /** Callback function triggered when selection changes (for controlled component usage) */
  onValueChange?: (value: string | null) => void
  /** Additional CSS classes to apply to the select trigger */
  className?: string
}

/**
 * EconomicRegionSelect Component
 *
 * A reusable dropdown component for selecting economic regions. This component:
 * - Displays a list of economic regions in a shadcn Select dropdown
 * - Persists the user's selection in cookies for future sessions
 * - Triggers a router refresh to update the UI with the new selection
 * - Supports both controlled and uncontrolled usage patterns
 *
 * This is a client component because it uses browser APIs (cookies) and
 * interactive state management (router navigation).
 *
 * @param regions - Array of EconomicRegion objects from the database
 * @param defaultErc - Fallback economic region code if no value is provided
 * @param value - Current selected value (optional, for controlled usage)
 * @param onValueChange - Callback for value changes (optional, for controlled usage)
 * @param className - Additional styling classes for the select trigger
 */
export default function EconomicRegionSelect({
  regions,
  defaultErc,
  value,
  onValueChange,
  className,
}: EconomicRegionSelectProps) {
  const router = useRouter()

  /**
   * Handles the selection of a new economic region
   *
   * This function:
   * 1. Persists the user's choice in cookies using setPreferredErc
   * 2. Refreshes the router to trigger a re-render with the new region data
   *
   * The router.refresh() is necessary because the region selection typically
   * affects server-side data fetching and component rendering.
   *
   * @param selectedValue - The economic region code that was selected
   */
  const handleRegionChange = async (selectedValue: string): Promise<void> => {
    try {
      // Persist the user's region preference in cookies
      await setPreferredErc(selectedValue)

      // Refresh the router to trigger re-rendering with new region context
      // This ensures that any server components that depend on the region
      // will re-fetch data with the updated selection
      router.refresh()
    } catch (error) {
      // In a production app, you might want to show a toast notification
      // or handle this error more gracefully
      console.error('Failed to update region preference:', error)
    }
  }

  // Early return pattern: If no regions are provided, don't render anything
  // This prevents the component from breaking and provides a clean fallback
  if (!regions?.length) {
    return null // Could also return a loading skeleton or empty state message
  }

  return (
    <Select
      // Current selected value (supports controlled component pattern)
      value={value}
      // Handle value changes with our custom logic
      onValueChange={async (selectedValue) => {
        // First, handle our internal logic (cookie + router refresh)
        await handleRegionChange(selectedValue)

        // Then, call the optional external change handler
        // This allows parent components to react to the selection change
        onValueChange?.(selectedValue)
      }}
      // Fallback value when no value prop is provided (uncontrolled mode)
      defaultValue={defaultErc}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder='Select a region' />
      </SelectTrigger>

      <SelectContent>
        {/* Render each economic region as a selectable option */}
        {regions.map((region) => (
          <SelectItem
            key={region.economicRegionCode}
            value={region.economicRegionCode}
          >
            {/* Display the human-readable region name */}
            {region.economicRegionName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
