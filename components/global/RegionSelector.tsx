import { ReactElement } from 'react'
import EconomicRegionSelect from './EconomicRegionSelect'
import { EconomicRegion } from '@prisma/client'

/**
 * Props interface for the RegionSelector component
 */
interface RegionSelectorProps {
  /** Array of economic regions available for selection */
  regions: EconomicRegion[]
  /**
   * Default economic region code to pre-select
   * Defaults to '5900' which typically represents a specific economic region
   */
  defaultErc?: string
  /** Currently selected region value (controlled component support) */
  value?: string
  /**
   * Callback function triggered when the selected region changes
   * Receives the new region code as a string, or null if cleared
   */
  onValueChange?: (value: string | null) => void
  /** Additional CSS classes to apply to the component */
  className?: string
}

/**
 * RegionSelector Component
 *
 * A wrapper component that provides a standardized interface for selecting
 * economic regions. This component adds consistent spacing and structure
 * around the EconomicRegionSelect component.
 *
 * Features:
 * - Wraps EconomicRegionSelect with consistent margin spacing
 * - Provides a clean interface for region selection
 * - Supports both controlled and uncontrolled usage patterns
 * - Passes through all necessary props to the underlying select component
 *
 * @param props - The component props
 * @returns A styled region selector with consistent spacing
 */
export default function RegionSelector({
  regions,
  defaultErc = '5900', // Default to region code 5900 (likely a primary economic region)
  value,
  onValueChange,
  className,
}: RegionSelectorProps): ReactElement {
  return (
    /* Wrapper div provides consistent bottom margin (mb-6 = 1.5rem) to separate this component from subsequent content */
    <div className='mb-6'>
      {/* Core select component that handles the actual region selection logic. All props are passed through to maintain flexibility */}
      <EconomicRegionSelect
        regions={regions}
        defaultErc={defaultErc}
        value={value}
        onValueChange={onValueChange}
        className={className}
      />
    </div>
  )
}
