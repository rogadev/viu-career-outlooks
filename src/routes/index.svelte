<script>
  import { getPrograms, getProgram } from './programs'
  import { searchState, results } from '$lib/stores/searching'

  import { programs } from '$lib/stores/programs'

  import Results from '$lib/components/Results.svelte'
  import FilterBar from '$lib/components/FilterBar.svelte'

  /** @type {number} */
  let selectedNid
  /** @type {string} */
  let keywords

  async function setProgram(/** @type {number} */ nid) {
    if (!nid) return (keywords = '')
    searchState.set('searching')
    const jobs = await getProgram(nid)
    results.set(jobs)
    searchState.set('found')
    // @ts-ignore
    if (!jobs.length) searchState.set(new Error('No results found'))
  }

  async function fetchPrograms() {
    if (!$programs.length) {
      await getPrograms()
    }
  }

  $: {
    setProgram(selectedNid)
  }
</script>

<h1>Search for career outlooks for any VIU program</h1>

{#await fetchPrograms()}
  <p class="text-center my-4 py-4">App loading... This may take a moment.</p>
{:then}
  <!-- <SelectList bind:value={selectedNid} options={programs} /> -->
  <select
    name="nid"
    id="nid"
    bind:value={selectedNid}
    class="w-full text-ellipsis my-4"
  >
    <option value={null} selected>Select a program...</option>
    {#each $programs as program}
      <option value={program.nid}>{program.title}</option>
    {/each}
  </select>
{/await}

{#if $searchState === 'found'}
  <FilterBar />
  <Results />
{/if}
