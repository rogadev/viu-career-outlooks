<script>
  import SearchBar from '$lib/components/SearchBar.svelte'
  import Results from '$lib/components/Results.svelte'
  import { state } from '$lib/stores/searching.js'
</script>

<SearchBar />
{#if $state === 'found'}
  <Results />
{/if}

<p>This will be the search page.</p>

<p>Load an empty screen with nothing but a search box.</p>

<p>Then, click search and render results.</p>
