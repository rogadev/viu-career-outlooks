<script>
  import Fuse from 'fuse.js'
  import { results, filteredResults } from '$lib/stores/searching'

  const fuseOptions = {
    keys: ['title'],
  }

  let input = ''
  let haystack = $results
  $: fuse = new Fuse(haystack, fuseOptions)

  $: {
    console.log(input)
    const fuseResults = fuse.search(input)
    const searchResults = fuseResults.map(({ item }) => item)
    console.log(searchResults)
    if (searchResults.length > 0) {
      // @ts-ignore
      $filteredResults = searchResults
    } else {
      // @ts-ignore
      $filteredResults = $results
    }
  }
</script>

<div class="flex flex-col my-4">
  <label for="filter-input"
    >Refine your search further with the input field below:
  </label>
  <input
    type="text"
    name="filter-input"
    id="filter-input"
    bind:value={input}
    class="mt-2"
  />
</div>
