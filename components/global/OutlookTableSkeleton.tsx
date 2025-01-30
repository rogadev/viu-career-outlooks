import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function OutlookTableSkeleton() {
  // Create 5 rows of skeleton data (matching our limit)
  const rows = Array(5).fill(null)

  return (
    <div className='w-full overflow-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            {/* Match the number of columns in short variant */}
            {['NOC', 'Title', 'Economic Region', 'Province', 'Outlook'].map(
              (header) => (
                <TableHead key={header}>
                  <Skeleton className='h-4 w-20' />
                </TableHead>
              )
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className='h-4 w-16' /> {/* NOC */}
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-40' /> {/* Title */}
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-32' /> {/* Economic Region */}
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-8' /> {/* Province */}
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-24' /> {/* Outlook */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
