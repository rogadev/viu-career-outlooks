<script>
  import Fuse from 'fuse.js'
  import ProgramSelectList from './ProgramSelectList.svelte'
  import { selectProgram } from '$lib/stores/programs'

  /** @type {{nid:string,title:string}[]} */
  export let programs
  let filteredPrograms = programs

  /** @type {string} */
  let input = ''

  const fuseOptions = {
    shouldSort: true,
    keys: ['title', 'viu_search_keywords'],
    threshold: 0.425,
    ignoreLocation: true,
  }

  $: fuse = new Fuse(programs, fuseOptions)

  $: {
    const searchItems = fuse.search(input).map(({ item }) => item)
    if (!searchItems.length) {
      filteredPrograms = programs
    } else {
      filteredPrograms = searchItems
    }
  }
  function selectFirstItem() {
    if (filteredPrograms.length) {
      selectProgram(filteredPrograms[0])
    }
  }
</script>

<input
  class="my-4 w-full rounded shadow"
  placeholder="ex. Computer Science"
  type="text"
  bind:value={input}
  on:keypress={({ key }) => {
    if (key === 'Enter') {
      selectFirstItem()
    }
  }}
/>
<ProgramSelectList list={filteredPrograms} />
