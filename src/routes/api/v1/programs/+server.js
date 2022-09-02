import { writeFileSync } from 'fs'

// CACHE
import NodeCache from 'node-cache'
const ttl = 60 * 60 * 2 // 2 hour time to live
const cache = new NodeCache({ stdTTL: ttl })

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  if (!cache.has('programs')) {
    const response = await fetch('https://www.viu.ca/searchable-programs.json')
    cache.set('programs', await response.json())
    writeFileSync(
      'src/lib/server/data/viu_programs.json',
      JSON.stringify(cache.get('programs'), null, 2),
      { flag: 'w' }
    )
  }
  return new Response(JSON.stringify(cache.get('programs')))
}
