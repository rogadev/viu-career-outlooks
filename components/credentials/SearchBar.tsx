'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { useState, useMemo, useCallback } from 'react'
import { Label } from '../ui/label'
import Fuse from 'fuse.js'
import type { Program, ProgramArea } from '@prisma/client'
import CredentialsTable from './CredentialsTable'

/**
 * Debounce function to limit the rate at which a function can fire.
 * This is useful for optimizing performance by reducing the number of calls
 * to the search function while the user is typing.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to wait before calling the function.
 * @returns {Function} A debounced version of the provided function.
 */
function debounce<T extends (arg: string) => void>(
  func: T,
  wait: number
): (arg: string) => void {
  let timeout: NodeJS.Timeout | null = null

  return (arg: string) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(arg), wait)
  }
}

interface ExtendedProgram extends Program {
  programArea: ProgramArea
}

interface SearchBarProps {
  programs: ExtendedProgram[]
}

/**
 * SearchBar component provides a user interface for searching through a list of programs.
 * It utilizes the Fuse.js library for fuzzy searching, allowing users to find programs
 * based on various attributes like title, name, and description.
 *
 * @param {SearchBarProps} props - Contains an array of programs to search through.
 * @returns {JSX.Element} The rendered SearchBar component.
 */
export default function SearchBar({ programs }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] =
    useState<ExtendedProgram[]>(programs)

  // Initialize Fuse.js for fuzzy searching with specified keys and options
  const fuse = useMemo(
    () =>
      new Fuse(programs, {
        keys: ['title', 'name', 'description', 'keywords', 'programCode'],
        threshold: 0.6, // Lower threshold for more strict matching
        minMatchCharLength: 2, // Minimum characters to start searching
        ignoreLocation: true, // Ignore the location of the match in the string
        shouldSort: true, // Sort results by relevance
      }),
    [programs]
  )

  // Create a debounced search function to optimize performance
  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        if (term) {
          // Perform search and update results
          const results = fuse.search(term).map((result) => result.item)
          setSearchResults(results)
        } else {
          // Reset results if search term is empty
          setSearchResults(programs)
        }
      }, 300),
    [fuse, programs]
  )

  // Handle search term changes and trigger the debounced search
  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term)
      debouncedSearch(term)
    },
    [debouncedSearch]
  )

  // Clear the search input and reset results to the original program list
  const clearSearch = () => {
    setSearchTerm('')
    setSearchResults(programs)
  }

  return (
    <div className='w-full mb-8 space-y-4'>
      <div className='flex gap-4 items-end'>
        <div className='flex-1'>
          <Label htmlFor='search' className='text-sm font-medium mb-2 block'>
            Search Programs
          </Label>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4' />
            <Input
              id='search'
              type='search'
              placeholder='Search by program name or keyword...'
              className='pl-10'
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur() // Remove focus on Enter key press
                }
              }}
            />
          </div>
        </div>
        {searchTerm && (
          <Button
            variant='outline'
            onClick={clearSearch}
            className='flex items-center gap-2'
          >
            <X className='h-4 w-4' />
            Clear
          </Button>
        )}
      </div>

      <CredentialsTable programs={searchResults} />
    </div>
  )
}
