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
