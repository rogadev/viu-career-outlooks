<script>
  //import { jobs as results } from '$lib/stores/searching.js'

  //  let allSearchResults = $results

  let filterInput = ''

  let filteredResults

  // $: {
  //   if (filterInput === '') filteredResults = allSearchResults
  //   else {
  //     console.log(allSearchResults)
  //     filteredResults = allSearchResults.filter((result) => {
  //       return result.title.toLowerCase().includes(filterInput.toLowerCase())
  //     })
  //     console.log(filteredResults)
  //   }
  // }
</script>

<input type="text" id="filter-input" bind:value={filterInput} />
