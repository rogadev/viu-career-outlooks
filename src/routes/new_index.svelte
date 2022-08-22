<script>
  import { getPrograms, getProgram } from './programs'
  import { programs } from '$lib/stores/programs'
  import ProgramsFilter from '$lib/components/ProgramsFilter.svelte'

  // If we have programs in our store, it should load these without the need for an additional fetch() request.
  /** @type {{nid:string,title:string}[]} */
  let programList = $programs.map((v) => v)

  // Note that we only fetch our list of programs if we don't yet have any in our store.
  async function fetchProgramList() {
    if (!programList.length) {
      programList = await getPrograms() // getPrograms() will populate our store for future loads of this component/view
    }
    return
  }
</script>

<h1>Search for career outlooks for any VIU program</h1>

{#await fetchProgramList()}
  <p class="text-center my-4 py-4">Loading VIU program list - standby...</p>
{:then}
  <ProgramsFilter programs={programList} />
{/await}
