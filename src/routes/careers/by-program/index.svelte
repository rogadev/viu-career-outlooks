<script>
  import { getPrograms, getProgram } from './programs'

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
    const data = await getProgram(nid)
    console.log(data)
  }

  $: {
    setProgram(selectedNid)
  }
</script>

<h1>Search for career outlooks for any VIU program</h1>

{#await fetchPrograms()}
  <p>Loading...</p>
{:then}
  <select name="nid" id="nid" bind:value={selectedNid}>
    <option value={null} selected>Select a program...</option>
    {#each programs as program}
      <option value={program.nid}>{program.title}</option>
    {/each}
  </select>
{/await}
