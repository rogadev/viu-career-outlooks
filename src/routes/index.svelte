<script>
  import { getPrograms, getProgram } from './programs'
  import { searchState, results } from '$lib/stores/searching'

  import { programs } from '$lib/stores/programs'

  import Results from '$lib/components/Results.svelte'
  import FilterBar from '$lib/components/FilterBar.svelte'

  /** @type {number} */
  let selectedNid

  // @ts-ignore
  $: errorState = $searchState instanceof Error

  async function setProgram(/** @type {number} */ nid) {
    if (!nid) return 
    searchState.set('searching')
    const jobs = await getProgram(nid)
    if (!jobs.length) {
      results.set([])
      // @ts-ignore
      searchState.set(new Error('No results found'))
    } else {
      results.set(jobs)
      searchState.set('found')
    }
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

{#if errorState}
  <p>
    At this time, there are no results for this credential. Touch base with our <a
      class="text-blue-700 cursor-pointer underline"
      href="mailto:web@viu.ca"
      target="_blank">web team via email</a
    > to let us know.
  </p>
{/if}

{#if $searchState === 'found'}
  <FilterBar />
  <Results />
{/if}
