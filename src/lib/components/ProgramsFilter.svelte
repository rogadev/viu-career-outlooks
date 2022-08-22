<script>
  import Fuse from 'fuse.js'
  import ProgramSelectList from './ProgramSelectList.svelte'

  /** @type {{nid:string,title:string}[]} */
  export let programs

  const fuseOptions = {
    shouldSort: true,
  }
  const fuse = new Fuse(programs, fuseOptions)

  /** @type {string} */
  let input = ''

  let filteredPrograms = programs

  $: {
    const searchItems = fuse.search(input).map(({ item }) => item)
    if (!searchItems.length) {
      filteredPrograms = programs
    } else {
      filteredPrograms = searchItems
    }
  }
</script>

<input type="text" bind:value={input} />
<ProgramSelectList list={filteredPrograms} />
