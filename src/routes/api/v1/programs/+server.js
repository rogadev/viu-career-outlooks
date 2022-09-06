// CACHE
import NodeCache from 'node-cache'
const ttl = 60 * 60 * 2 // 2 hour time to live
const cache = new NodeCache({ stdTTL: ttl })

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  if (!cache.has('programs') || !cache) {
    const response = await fetch('https://www.viu.ca/searchable-programs.json')
    cache.set('programs', await response.json())
  }
  return new Response(JSON.stringify(cache.get('programs')))
}
