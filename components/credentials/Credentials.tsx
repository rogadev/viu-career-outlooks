import { prisma } from '@/lib/db'
import SearchBar from './SearchBar'

/**
 * Credentials component fetches and displays all program credentials with their associated program areas.
 * It provides a searchable interface through the SearchBar component.
 *
 * @returns A SearchBar component populated with program credentials data
 */
const Credentials = async () => {
  // Fetch all programs and include their program area relationships for complete data
  const credentials = await prisma.program.findMany({
    include: {
      programArea: true,
    },
  })
  return (
    <>
      <SearchBar programs={credentials} />
    </>
  )
}

export default Credentials
