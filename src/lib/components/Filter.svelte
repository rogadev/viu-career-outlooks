<script>
  export let /** @type {{noc:string,title:string}[]} */ haystack

  import Fuse from 'fuse.js'
  import Button from './viu/Button.svelte'
  import ReactiveResults from '$lib/components/ReactiveResults.svelte'
  import H3 from './viu/H3.svelte'

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
  <label for="filter-input" class="font-bold"
    >Filter results by typing below:</label
  >
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
<div class="mt-0 mb-6">
  <H3>Career Paths</H3>
  <p>
    Select a career from the list to see detailed information including the BC's
    3-year market trends and outlook
  </p>
</div>
<ReactiveResults list={filteredResults} />
