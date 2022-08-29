import programs from '$lib/server/data/viu_programs.json'
/** @type {import('@sveltejs/kit').RequestHandler<{ nid: string }>} */
export async function GET() {
  return {
    status: 200,
    body: {
      programs,
    },
  }
}
