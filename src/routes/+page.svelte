<script>
  import {
    programs,
    programSelected,
    selectedProgram,
  } from '$lib/stores/programs'
  import ProgramsFilter from '$lib/components/ProgramsFilter.svelte'
  import H2 from '$lib/components/viu/H2.svelte'
  import FetchedResults from '$lib/components/FetchedResults.svelte'
  import getPrograms from '$lib/server/functions/getPrograms'
  import Loading from '$lib/components/Loading.svelte'

  // If we have programs in our store, it should load these without the need for an additional fetch() request.
  /** @type {{nid:string,title:string}[]} */
  $: programList = $programs.map((v) => v)

  /**
   * Check the programs store (programList subscribed to store) and if it's empty, fetch the programs from the server.
   */
  async function fetchProgramList() {
    if (!programList.length) {
      const searchablePrograms = await getPrograms()
      // @ts-ignore
      programs.set(searchablePrograms)
    }
  }

  // @ts-ignore
  $: nidToFetch = $selectedProgram?.nid ?? '0000'
</script>

<svelte:head>
  <title>VIU | Career Outlooks</title>
</svelte:head>

{#await fetchProgramList()}
  <Loading />
{:then}
  {#if !$programSelected}
    <H2>Search for career outlooks for any VIU program</H2>
    <ProgramsFilter programs={programList} />
  {:else}
    <FetchedResults nid={nidToFetch} />
  {/if}
{/await}
