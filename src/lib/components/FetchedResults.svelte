<script>
  import titleCase from '$lib/helpers/titleCase'
  import Button from './viu/Button.svelte'
  import H1 from './viu/H1.svelte'
  import H3 from './viu/H3.svelte'

  import { clearSelectedProgram } from '$lib/stores/programs'
  import Filter from './Filter.svelte'

  /** @type {string} */
  export let nid

  /**
   * @typedef Program
   * @property {string} title
   * @property {string} nid
   * @property {string} credential
   * @property {any} program_area
   * @property {any} viu_search_keywords
   * @property {any} noc_search_keywords
   * @property {any} known_noc_groups
   */

  /**
   * @typedef Job
   * @property {string} title
   * @property {string} noc
   */

  //  ERROR VARIABLES
  let message = ''
  let error = false

  /** @type {Program} */
  let program
  /** @type {Job[]} */
  let jobs = []

  // TODO replace heroku
  async function fetchJobs() {
    try {
      const response = await fetch(`/api/v1/jobs-by-program/${nid}`)
      const data = await response.json()
      program = data.program
      jobs = data.jobs
    } catch (e) {
      // @ts-ignore
      message = e.message
      error = true
    }
  }
</script>

{#if error}
  <dialog class="border rounded shadow" open={error}>
    <div class="m-4">
      <H3>Oops...</H3>
      <p>{message}</p>

      <Button
        on:click={() => {
          error = false
          message = ''
        }}>OK</Button
      >
    </div>
  </dialog>
{:else}
  {#await fetchJobs()}
    <p>loading...</p>
  {:then}
    <!-- Program Area -->
    <div class="py-4">
      <H1>{titleCase(program.title)}</H1>
      <p class="text-xl font-bold">
        {program.program_area.title} - {program.credential}
      </p>
      <Button on:click={clearSelectedProgram}>Choose Another Program</Button>
    </div>
    <Filter haystack={jobs} />
  {/await}
{/if}
