<script>
  // @ts-nocheck

  import { results } from '$lib/stores/searching.js'
  import titleCase from '$lib/helpers/titleCase.js'

  let jobObjects = $results.jobs
  /**
   * @type {Array<Object>}
   */
  let jobs = [{ noc: '', jobTitle: '' }]
  jobObjects.forEach(
    (/** @type {{ noc: string; jobs: Array<string>; }} */ obj) => {
      let noc = obj.noc
      let jobList = obj.jobs
      jobList.forEach((/** @type {string} */ jobTitle) => {
        jobs.push({
          noc: noc,
          jobTitle: titleCase(jobTitle),
        })
      })
    }
  )
</script>

{#each jobs as job}
  <div>
    <a target="_blank" href={'/outlook/' + job.noc}>{job.jobTitle}</a>
  </div>
{/each}

<!-- TODO add styling -->
