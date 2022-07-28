/**
 * Shadow Endpoing - handles getting job outlook data for a given NOC code. Querries our express api, which proxys to the LMI-EO api, and returns the data.
 * @param {*} param0
 */
export async function GET({ params }) {
  const noc = Number(params.noc)

  const p1 = new Promise(async (resolve, reject) => {
    let trends, outlook_verbose, outlook
    try {
      const response = await fetch(
        `https://viu-career-outlook.herokuapp.com/api/v1/outlook/${noc}`
      )
      const data = await response.json()
      trends = data.trends
      outlook_verbose = data.outlook_verbose
      outlook = data.potential
    } catch (errors) {
      reject(errors)
    }
    resolve({ trends, outlook, outlook_verbose })
  })

  const p2 = new Promise(async (resolve, reject) => {
    let title, jobs, requirements, duties
    try {
      const response = await fetch(
        'https://viu-career-outlook.herokuapp.com/api/v1/noc/' + noc
      )
      const data = await response.json()
      title = data.title
      jobs = data.jobs
      requirements = data.requirements
      duties = data.duties
    } catch (errors) {
      reject(errors)
    }
    resolve({ title, jobs, requirements, duties })
  })

  Promise.all([p1, p2]).then((results) => {
    return {
      status: 200,
      body: {
        noc,
        title: results[1].title,
        jobs: results[1].jobs,
        requirements: results[1].requirements,
        duties: results[1].duties,
        outlook: results[0].outlook,
        outlook_verbose: results[0].outlook_verbose,
        trends: results[0].trends,
        province: 'British Columbia',
        eruid: 5900,
      },
    }
  })
}
