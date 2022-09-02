/**
 * Uses the internal API to get the programs for a given user. This internal endpoint returns the contents of the server cache and calls the VIU endpoint to update the cache.
 * @returns {Promise<{nid:string, title:string, credential: string, program: string}[]>} - Array of programs
 */
export default async function getPrograms() {
  const response = await fetch('/api/v1/programs')
  const programs = await response.json()
  // @ts-ignore
  const info = programs.map(({ nid, title, credential, program_area }) => {
    return {
      nid,
      title,
      credential,
      program: program_area.title,
    }
  })
  return info
}
