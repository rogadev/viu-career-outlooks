/** @type {string | null} */
let programTitle = null
/** @type {string | null} */
let credential = null
/** @type {Object[]} */
let jobResults = []

/** @type {import('@sveltejs/kit').RequestHandler<{ nid: string | number }>} */
export async function GET({ params }) {
  const nid = params.nid
  if (!nid) return { status: 404 }

  try {
    await fetchJobs(nid)
  } catch (e) {
    console.error(e)
  }

  if (!jobResults.length)
    return {
      status: 200,
      body: {
        jobs: [],
        title: 'Program Not Found.',
        credential: '',
      },
    }

  return {
    status: 200,
    // @ts-ignore
    body: {
      jobs: jobResults,
      title: programTitle,
      credential,
    },
  }
}

async function fetchJobs(/** @type {string | number} */ nid) {
  try {
    const response = await fetch(
      `https://viu-career-outlook.herokuapp.com/api/v1/jobs/program/${nid}`
    )
    if (response.status !== 200) return { success: false }
    const { data } = await response.json()
    const { jobs, program } = data

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
