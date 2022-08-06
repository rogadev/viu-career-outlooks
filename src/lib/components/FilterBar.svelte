<script>
  import { results } from '$lib/stores/filter.js'

  let input = ''

  $: () => results.filterFor(input)
</script>

<input type="text" id="filter-input" bind:value={input} />
