import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Program, ProgramArea } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

interface ExtendedProgram extends Program {
  programArea: ProgramArea
}

interface CredentialsTableProps {
  programs: ExtendedProgram[]
}

/**
 * CredentialsTable displays a paginated list of educational programs with sorting and filtering capabilities.
 * Features include:
 * - Clickable rows that navigate to program details
 * - Pagination with configurable items per page
 * - Accessible navigation controls
 * - Visual feedback for interactive elements
 *
 * @param {CredentialsTableProps} props - Contains array of programs with their associated program areas
 * @returns {ReactElement} A table component with pagination controls
 */
export default function CredentialsTable({ programs }: CredentialsTableProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Calculate pagination values and slice data for current page
  const totalPages = Math.ceil(programs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPrograms = programs.slice(startIndex, endIndex)

  // Track displayed items range for accessibility and UI feedback
  const currentStart = startIndex + 1
  const currentEnd = Math.min(endIndex, programs.length)
  const totalItems = programs.length

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope='col'>Program Name</TableHead>
            <TableHead scope='col'>Type</TableHead>
            <TableHead scope='col'>Area</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPrograms.map((program) => (
            <TableRow
              key={program.nid}
              className='cursor-pointer hover:bg-muted'
            >
              <TableCell>
                {/* Keyboard-accessible button for program navigation */}
                <button
                  className='w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm'
                  onClick={() => router.push(`/programs/${program.nid}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      router.push(`/programs/${program.nid}`)
                    }
                  }}
                >
                  {program.title}
                </button>
              </TableCell>
              <TableCell>{program.credential}</TableCell>
              <TableCell>{program.programArea.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className='border-t px-4 py-2 flex items-center justify-between'>
        {/* Pagination controls with accessibility attributes */}
        <div role='navigation' aria-label='Pagination'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <button
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                  className={cn(
                    'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-900 hover:bg-gray-50'
                  )}
                  disabled={currentPage === 1}
                  aria-label='Go to previous page'
                  aria-disabled={currentPage === 1}
                >
                  Previous
                </button>
              </PaginationItem>
              <PaginationItem>
                <span className='text-sm' aria-current='page'>
                  Page {currentPage} of {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <button
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                  className={cn(
                    'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-900 hover:bg-gray-50'
                  )}
                  disabled={currentPage === totalPages}
                  aria-label='Go to next page'
                  aria-disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <div className='flex items-center gap-4'>
          {/* Screen reader text for current page status */}
          <div className='sr-only' role='status' aria-live='polite'>
            Showing {currentStart} to {currentEnd} of {totalItems} results
          </div>
          <div aria-hidden='true' className='text-sm text-muted-foreground'>
            Showing {currentStart}-{currentEnd} of {totalItems}
          </div>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setItemsPerPage(Number(value))
              setCurrentPage(1) // Reset to first page when changing items per page
            }}
            aria-label='Select number of items per page'
          >
            <SelectTrigger className='w-[180px]' aria-label='Items per page'>
              <SelectValue placeholder='Rows per page' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>10 per page</SelectItem>
              <SelectItem value='25'>25 per page</SelectItem>
              <SelectItem value='50'>50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
