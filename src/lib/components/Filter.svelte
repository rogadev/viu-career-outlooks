<script>
  export let /** @type {{noc:string,title:string}[]} */ haystack

  import Fuse from 'fuse.js'
  import Button from './viu/Button.svelte'
  import ReactiveResults from '$lib/components/ReactiveResults.svelte'

  const fuseOptions = {
    keys: ['title'],
  }

  let input = ''
  let filteredResults = haystack

  $: fuse = new Fuse(haystack, fuseOptions)

  $: {
    const fuseResults = fuse.search(input)
    const searchResults = fuseResults.map(({ item }) => item)
    if (!searchResults.length) {
      filteredResults = haystack
    } else {
      filteredResults = searchResults
    }
  }

  function clearInput() {
    input = ''
  }
</script>

<div class="flex flex-col my-4">
  <div class="flex items-center gap-6 mb-4">
    <input
      type="text"
      name="filter-input"
      id="filter-input"
      bind:value={input}
      class="mr-4 w-full "
      placeholder="Search..."
    />
    <Button on:click={clearInput}>Clear</Button>
  </div>
</div>

<ReactiveResults list={filteredResults} />
