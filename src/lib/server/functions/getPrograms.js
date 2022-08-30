import programs from '../data/viu_programs.json'

export default function getPrograms() {
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
