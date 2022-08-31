/** @type {string | null} */
let programTitle = null
/** @type {string | null} */
let credential = null
/** @type {Object[]} */
let jobResults = []

/** @type {import('@sveltejs/kit').PageServerLoad<{ nid: string | number }>} */
export async function load({ params }) {
  const nid = params.nid
  if (!nid) throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
  return { status: 404 }

  try {
    await fetchJobs(nid)
  } catch (e) {
    console.error(e)
  }

  if (!jobResults.length)
    return {
  jobs: [],
  title: 'Program Not Found.',
  credential: '',
}

  return {
  jobs: jobResults,
  title: programTitle,
  credential,
}
}

async function fetchJobs(/** @type {string | number} */ nid) {
  try {
    const response = await fetch(`/api/v1/jobs-program-program/${nid}`)
    if (response.status !== 200) return { success: false }
    console.log('asdf', await response.json())
    const { jobs, program } = await response.json()

    if (jobs.length > 0) {
      jobResults = jobs
    }

    if (program) {
      programTitle = program.title
      credential = program.credential
    }
  } catch (e) {
    console.error(e)
    return { success: false }
  }
}
