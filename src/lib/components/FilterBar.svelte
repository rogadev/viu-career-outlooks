<script>
  import Fuse from 'fuse.js'
  import { results, filteredResults } from '$lib/stores/searching'
  import Button from './viu/Button.svelte'

  const fuseOptions = {
    keys: ['title'],
  }

  let input = ''
  let haystack = $results
  $: fuse = new Fuse(haystack, fuseOptions)

  $: {
    const fuseResults = fuse.search(input)
    const searchResults = fuseResults.map(({ item }) => item)
    if (searchResults.length > 0) {
      // @ts-ignore
      $filteredResults = searchResults
    } else {
      // @ts-ignore
      $filteredResults = $results
    }
  }

  function clearInput() {
    input = ''
  }
</script>

<div class="flex flex-col my-4">
  <label for="filter-input">
    Refine your search further with the input field below:
  </label>
  <div class="flex items-center gap-6 mt-2 mb-4">
    <input
      type="text"
      name="filter-input"
      id="filter-input"
      bind:value={input}
      class="mr-4 w-full "
    />
    <Button on:click={clearInput}>Clear</Button>
  </div>
</div>
