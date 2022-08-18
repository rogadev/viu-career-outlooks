import { pushIfUnique } from '$lib/helpers/array.helpers'

/** @type {string | null} */
let programTitle = null
/** @type {string | null} */
let credential = null
/** @type {Object[]} */
let jobs = []

/** @type {import('@sveltejs/kit').RequestHandler<{ nid: string | number }>} */
export async function GET({ params }) {
  const nid = params.nid
  if (!nid) return { status: 404 }

  await Promise.all([fetchProgram(nid), fetchJobs(nid)]).catch(console.error)

  if (!jobs.length)
    return {
      status: 200,
      body: {
        jobs: [],
        title: 'Program Not Found.',
        credential: null,
      },
    }

  return {
    status: 200,
    // @ts-ignore
    body: {
      jobs,
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
    if (response.status !== 200) return
    const { data } = await response.json()
    data.forEach((/** @type {{nid:String, title:String;}} */ job) =>
      pushIfUnique(jobs, job.title)
    )
  } catch (e) {
    console.error(e)
  }
}

async function fetchProgram(/** @type {string | number} */ nid) {
  try {
    const response = await fetch(
      `https://viu-career-outlook.herokuapp.com/api/v1/program/${nid}`
    )
    if (response.status !== 200) return
    const { data } = await response.json()
    programTitle = data.title
    credential = data.credential
  } catch (e) {
    console.error(e)
  }
}
