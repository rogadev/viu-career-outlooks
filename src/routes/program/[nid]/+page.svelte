<script>
  import H1 from '$lib/components/viu/H1.svelte'
  import Filter from '$lib/components/Filter.svelte'
  import Loading from '$lib/components/Loading.svelte'

  export let data
  const { nid } = data

  /**
   * @typedef Job
   * @property {string} title
   * @property {string} noc
   */

  /** @type {string}  */ let title
  /** @type {string} */ let credential
  /** @type {Job[]} */ let jobs

  /**
   * Fetches jobs data from the server. Sets local variables to represent the data returned.
   */
  const fetchPrograms = async () => {
    const response = await fetch(`/api/v1/jobs-by-program/${nid}`)
    const data = await response.json()
    title = data.program.title
    credential = data.program.credential
    jobs = data.jobs
  }
</script>

<svelte:head>
  <title>{title} | Career Opportunties</title>
</svelte:head>

{#await fetchPrograms()}
  <Loading />
{:then}
  <H1>{title} {credential}</H1>

  {#if !jobs.length}
    <p>
      No results found for this credential, at this time. Contact the Web Team
      if you think there's been a mistake.
    </p>
  {:else}
    <Filter haystack={jobs} />
  {/if}
{/await}
