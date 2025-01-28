// CACHE
import cache from '$lib/server/cache/programs.js'

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  if (!cache.has('programs') || !cache) {
    const response = await fetch('https://www.viu.ca/searchable-programs.json')
    cache.set('programs', await response.json())
  }
  return new Response(JSON.stringify(cache.get('programs')))
}
