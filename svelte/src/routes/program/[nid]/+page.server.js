import { error } from '@sveltejs/kit'
import viuPrograms from '$lib/server/data/viu_programs.json'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  let nid = params.nid
  if (!nid) throw error(404, 'Missing nid parameter')
  if (typeof Number.parseInt(nid) !== 'number')
    throw error(404, 'Received bad nid parameter type')
  const program = viuPrograms.find(
    (program) => program.nid === Number.parseInt(nid) ?? false
  )
  if (!program) throw error(404, `No program found for nid: ${nid}`)
  return { nid }
}
