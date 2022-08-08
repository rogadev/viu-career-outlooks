<script>
  import SearchBar from '$lib/components/SearchBar.svelte'
  import Results from '$lib/components/Results.svelte'
  import { searchState } from '$lib/stores/searching.js'
  import FilterBar from '$lib/components/FilterBar.svelte'
</script>

<svelte:head>
  <title>VIU's Career Outlook Tool - Search Careers by Credential</title>
</svelte:head>

<SearchBar />
{#if $searchState === 'found'}
  <FilterBar />
  <Results />
{/if}
