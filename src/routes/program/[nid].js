import { pushIfUnique } from '$lib/helpers/array.helpers'

/** @type {string | null} */
let programTitle = null
/** @type {Object[]} */
let jobs = []

/** @type {import('@sveltejs/kit').RequestHandler<{ nid: string | number }>} */
export async function GET({ params }) {
  const nid = params.nid
  if (!nid) return { status: 404 }

  await fetchJobs(nid)
  await fetchProgram(nid)

  if (!jobs.length) return { status: 404 }

  return {
    status: 200,
    // @ts-ignore
    body: {
      jobs,
      title: programTitle,
    },
  }
}

async function fetchJobs(/** @type {string | number} */ nid) {
  const response = await fetch(
    `https://viu-career-outlook.herokuapp.com/api/v1/jobs/program/${nid}`
  )
  const { data } = await response.json()
  data.forEach((/** @type {{nid:String, title:String;}} */ job) =>
    pushIfUnique(jobs, job)
  )
}

async function fetchProgram(/** @type {string | number} */ nid) {
  const response = await fetch(
    `https://viu-career-outlook.herokuapp.com/api/v1/program/${nid}`
  )
  const { data } = await response.json()
  programTitle = data.title
}
