<script>
  import { results } from '$lib/stores/searching.js'

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
          jobTitle: jobTitle,
        })
      })
    }
  )
  console.log(jobs)
</script>

{#each jobs as job}
  <div class="job">
    <div class="noc">
      {job.noc}
    </div>
    <div class="job-title">
      {job.jobTitle}
    </div>
  </div>
{/each}
