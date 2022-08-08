import { writable } from 'svelte/store'

/** @type {"idle" | "searching" | "found" | Error} */
let initialState = 'idle'

export const state = writable(
  /** @type {"idle" | "searching" | "found" | Error} */ (initialState)
)

export const keywordFields = writable({ credential: '', keywords: '' })

export const results = writable([])

<<<<<<< Updated upstream
// export const jobs = writable([])
// results.subscribe((results) => {
//   const jobs = results.jobs
//   jobs.forEach((/** @type {{ noc: string; jobs: string[]; }} */ job) => {
//     const noc = job.noc
//     const titles = job.jobs
//     titles.forEach((title) => {
//       jobs.push({ noc, title })
//     })
//   })
// })
=======
export const jobs = writable([])
results.subscribe(() => {
  const resJobs = results.subscribe((res) => res?.jobs)
  resJobs.forEach((/** @type {{ noc: string; jobs: string[]; }} */ job) => {
    const noc = job.noc
    const titles = job.jobs
    titles.forEach((title) => {
      jobs.set([...jobs.get(), { noc, title }])
    })
  })
})
>>>>>>> Stashed changes
