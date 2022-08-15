<script>
  import { getPrograms, getProgram } from './programs'
  import { searchState, results } from '$lib/stores/searching'

  import Results from '$lib/components/Results.svelte'
  import FilterBar from '$lib/components/FilterBar.svelte'
  import SelectList from '$lib/components/SelectList.svelte'

  /** @type {{nid:number, title:string}[]} */
  let programs = []
  /** @type {number} */
  let selectedNid
  /** @type {string} */
  let keywords

  async function fetchPrograms() {
    programs = await getPrograms()
  }

  async function setProgram(/** @type {number} */ nid) {
    if (!nid) return (keywords = '')
    searchState.set('searching')
    const jobs = await getProgram(nid)
    results.set(jobs)
    searchState.set('found')
    // @ts-ignore
    if (!jobs.length > 0) searchState.set(new Error('No results found'))
  }

  $: {
    setProgram(selectedNid)
  }
</script>

<h1>Search for career outlooks for any VIU program</h1>

{#await fetchPrograms()}
  <p class="text-center py-6">Loading...</p>
{:then}
  <!-- <SelectList bind:value={selectedNid} options={programs} /> -->
  <select
    name="nid"
    id="nid"
    bind:value={selectedNid}
    class="w-full text-ellipsis"
  >
    <option value={null} selected>Select a program...</option>
    {#each programs as program}
      <option value={program.nid}>{program.title}</option>
    {/each}
  </select>
{/await}

{#if $searchState === 'found'}
  <FilterBar />
  <Results />
{/if}
