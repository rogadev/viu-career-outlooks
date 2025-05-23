'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { useState, useMemo, useCallback } from 'react'
import { Label } from '../ui/label'
import Fuse from 'fuse.js'
import type { Program, ProgramArea } from '@prisma/client'
import CredentialsTable from './CredentialsTable'

// Constants for Fuse.js search configuration
// These values are extracted for easier maintenance and testing
const SEARCH_CONFIG = {
  // Keys to search within each program object
  keys: ['title', 'name', 'description', 'keywords', 'programCode'],
  // Lower threshold = more strict matching (0.0 = perfect match, 1.0 = match anything)
  threshold: 0.6,
  // Minimum number of characters required before search begins
  minMatchCharLength: 2,
  // Don't factor in the position of the match within the string
  ignoreLocation: true,
  // Sort results by relevance score (best matches first)
  shouldSort: true,
} as const

// Debounce delay in milliseconds - prevents excessive API calls while user is typing
const DEBOUNCE_DELAY = 300

/**
 * Debounce utility function to limit how frequently a function can be executed.
 * This is crucial for search performance - without debouncing, the search would
 * run on every keystroke, which could cause lag with large datasets.
 *
 * How it works:
 * 1. When called, it cancels any previous timer
 * 2. Sets a new timer to execute the function after the specified delay
 * 3. If called again before the timer expires, the process repeats
 *
 * Example: User types "react" - without debouncing, search runs 5 times.
 * With 300ms debouncing, search only runs once after user stops typing.
 *
 * @param func - The function to debounce (must accept a string parameter)
 * @param wait - Delay in milliseconds before executing the function
 * @returns A debounced version of the original function
 */
function debounce<T extends (arg: string) => void>(
  func: T,
  wait: number
): (arg: string) => void {
  // Store the timeout reference to allow cancellation
  let timeout: NodeJS.Timeout | null = null

  return (arg: string) => {
    // Cancel the previous timeout if it exists (prevents multiple executions)
    if (timeout) clearTimeout(timeout)

    // Set a new timeout to execute the function after the specified delay
    timeout = setTimeout(() => func(arg), wait)
  }
}

// Type definitions for better TypeScript support and code clarity
interface ExtendedProgram extends Program {
  programArea: ProgramArea
}

interface SearchBarProps {
  programs: ExtendedProgram[]
}

/**
 * SearchBar Component
 *
 * Provides a comprehensive search interface for filtering through educational programs.
 * Features include:
 * - Real-time fuzzy search using Fuse.js
 * - Debounced input to optimize performance
 * - Clear functionality to reset search
 * - Accessibility support with proper labels
 *
 * Data Flow:
 * 1. User types in search input
 * 2. handleSearch updates searchTerm state and triggers debounced search
 * 3. After debounce delay, Fuse.js performs fuzzy search on program data
 * 4. Search results update the searchResults state
 * 5. CredentialsTable re-renders with filtered results
 *
 * @param programs - Array of programs to search through (includes programArea relation)
 * @returns React component with search input and filtered results table
 */
export default function SearchBar({ programs }: SearchBarProps) {
  // State for the current search input value
  // This is controlled by the input field and drives the search functionality
  const [searchTerm, setSearchTerm] = useState('')

  // State for the filtered search results
  // Starts with all programs, then gets filtered based on search term
  const [searchResults, setSearchResults] =
    useState<ExtendedProgram[]>(programs)

  /**
   * Initialize Fuse.js instance for fuzzy searching
   *
   * useMemo ensures this expensive operation only runs when programs array changes,
   * not on every re-render. This is critical for performance.
   *
   * Fuse.js provides intelligent fuzzy searching that can handle:
   * - Typos (e.g., "reakt" matches "react")
   * - Partial matches (e.g., "comp sci" matches "Computer Science")
   * - Multiple search terms
   */
  const fuse = useMemo(
    () => new Fuse(programs, SEARCH_CONFIG),
    [programs] // Only recreate if programs array changes
  )

  /**
   * Create debounced search function
   *
   * useMemo ensures the debounced function is only created once per fuse/programs change.
   * Without this, a new debounced function would be created on every render,
   * defeating the purpose of debouncing.
   *
   * The search logic:
   * - If there's a search term: use Fuse.js to find matches and extract the items
   * - If search term is empty: show all programs (reset to original state)
   */
  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        if (term.trim()) {
          // Perform fuzzy search and extract the actual program objects from Fuse results
          // Fuse.js returns objects with { item: Program, score: number }, we just want the items
          const results = fuse.search(term).map((result) => result.item)
          setSearchResults(results)
        } else {
          // Empty search term means show all programs
          setSearchResults(programs)
        }
      }, DEBOUNCE_DELAY),
    [fuse, programs] // Recreate if search instance or programs change
  )

  /**
   * Handle search input changes
   *
   * useCallback prevents this function from being recreated on every render,
   * which is important because this function is passed as a prop to the Input component.
   * Without useCallback, the Input would see a "new" function every time and potentially re-render unnecessarily.
   */
  const handleSearch = useCallback(
    (term: string) => {
      // Update the visible search term immediately for responsive UI
      setSearchTerm(term)
      // Trigger the debounced search (actual search happens after delay)
      debouncedSearch(term)
    },
    [debouncedSearch] // Only recreate if debounced search function changes
  )

  /**
   * Clear search functionality
   *
   * Resets both the search input and results to initial state.
   * This provides a quick way for users to see all programs again.
   */
  const clearSearch = () => {
    setSearchTerm('')
    setSearchResults(programs)
  }

  return (
    <div className='w-full mb-8 space-y-4'>
      {/* Search Input Section */}
      <div className='flex gap-4 items-end'>
        <div className='flex-1'>
          {/* Accessible label for screen readers and better UX */}
          <Label htmlFor='search' className='text-sm font-medium mb-2 block'>
            Search Programs
          </Label>

          {/* Search input with icon - relative positioning allows icon overlay */}
          <div className='relative'>
            {/* Search icon positioned absolutely within the input */}
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4' />

            <Input
              id='search'
              type='search' // Provides browser-native search functionality (clear button, etc.)
              placeholder='Search by program name or keyword...'
              className='pl-10' // Left padding to accommodate the search icon
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => {
                // Remove focus when user presses Enter (improves mobile UX)
                if (e.key === 'Enter') {
                  e.currentTarget.blur()
                }
              }}
            />
          </div>
        </div>

        {/* Conditional Clear Button - only show when there's a search term */}
        {searchTerm && (
          <Button
            variant='outline'
            onClick={clearSearch}
            className='flex items-center gap-2'
            aria-label='Clear search' // Accessibility: screen readers will announce this
          >
            <X className='h-4 w-4' />
            Clear
          </Button>
        )}
      </div>

      {/* Results Table - automatically updates when searchResults state changes */}
      <CredentialsTable programs={searchResults} />
    </div>
  )
}
