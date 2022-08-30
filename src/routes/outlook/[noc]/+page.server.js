import { loading } from '$lib/stores/loading'
import { error } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  loading.set(true)
  const noc = String(params.noc)

  if (typeof Number.parseInt(noc) !== 'number') {
    loading.set(false)
    throw error(404, `Received bad noc parameter type: ${noc}, ${typeof noc}`)
  }

  const p1 = new Promise(async (resolve, reject) => {
    let trends, outlook_verbose, outlook
    try {
      // TODO replace heroku
      const response = await fetch(
        `https://viu-career-outlook.herokuapp.com/api/v1/outlook/${noc}`
      )
      const { data } = await response.json()
      trends = data.trends
      outlook_verbose = data.outlook_verbose
      outlook = data.potential
    } catch (errors) {
      reject(errors)
      // @ts-ignore
      throw error(500, errors)
    }
    resolve({ trends, outlook, outlook_verbose })
  })

  const p2 = new Promise(async (resolve, reject) => {
    let title, jobs, requirements, duties
    try {
      // TODO replace heroku
      const response = await fetch(
        `https://viu-career-outlook.herokuapp.com/api/v1/noc/${noc}`
      )
      const { data } = await response.json()
      title = data.title
      jobs = data.jobs
      requirements = data.requirements
      duties = data.duties
    } catch (errors) {
      reject(errors)
      // @ts-ignore
      throw error(500, errors)
    }
    resolve({ title, jobs, requirements, duties })
  })

  return await Promise.all([p1, p2]).then((results) => {
    loading.set(false)
    return {
      status: 200,
      noc,
      title: results[1].title,
      jobs: results[1].jobs,
      requirements: results[1].requirements,
      duties: results[1].duties,
      outlook: results[0].outlook,
      outlook_verbose: results[0].outlook_verbose,
      trends: results[0].trends,
      province: 'British Columbia',
    }
  })
}
