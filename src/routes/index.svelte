<script>
  import { getPrograms, getProgram } from './programs'
  import {
    programs,
    programSelected,
    selectedProgram,
  } from '$lib/stores/programs'
  import ProgramsFilter from '$lib/components/ProgramsFilter.svelte'
  import H2 from '$lib/components/viu/H2.svelte'
  import FetchedResults from '$lib/components/FetchedResults.svelte'
  import H3 from '$lib/components/viu/H3.svelte'

  // If we have programs in our store, it should load these without the need for an additional fetch() request.
  /** @type {{nid:string,title:string}[]} */
  let programList = $programs.map((v) => v)

  // Note that we only fetch our list of programs if we don't yet have any in our store.
  async function fetchProgramList() {
    // TODO handle erros and show a message to the user.
    if (!programList.length) {
      programList = await getPrograms() // getPrograms() will populate our store for future loads of this component/view
    }
    return
  }

  // @ts-ignore
  $: programTitle = $selectedProgram?.title || ''

  // @ts-ignore
  $: nidToFetch = $selectedProgram?.nid ?? '0000'
</script>

<svelte:head>
  <title>VIU | Career Outlooks</title>
</svelte:head>

{#await fetchProgramList()}
  <p class="text-center my-4 py-4">Loading VIU program list - standby...</p>
{:then}
  {#if !$programSelected}
    <H2>Search for career outlooks for any VIU program</H2>

    <ProgramsFilter programs={programList} />
  {:else}
    <FetchedResults nid={nidToFetch} />
  {/if}
{/await}
