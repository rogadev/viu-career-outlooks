<script>
  import { state, keywordFields } from '$lib/stores/searching.js'
  import { search } from '$lib/search.js'

  // Staging values to be sent to our search via the store array variable "keywordFields".
  let /** @type {string} */ credentialValue, /** @type {string} */ keywordsValue

  const registerSearchClick = () => {
    // Send search keywords to the store.
    keywordFields.set({
      credential: credentialValue,
      keywords: keywordsValue,
    })
    // Perform search. (Search function handles updating search state.)
    search()
  }

  $: disabled = $state === 'searching'
  $: searchError = $state instanceof Error
</script>

<!-- Credential Selector -->
<div>
  <label for="location" class="block text-sm font-medium text-gray-700"
    >Location</label
  >
  <select
    id="location"
    name="location"
    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    {disabled}
    bind:value={credentialValue}
  >
    <option selected>Degree</option>
    <option>Diploma</option>
    <option>Certificate</option>
    <option>Trades</option>
  </select>
</div>
<!-- Keywords Input -->
<div>
  <label for="search" class="block text-sm font-medium text-gray-700"
    >Keywords</label
  >
  <div class="mt-1">
    <input
      type="text"
      name="search"
      id="search"
      bind:value={keywordsValue}
      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
      {disabled}
      on:keydown={(e) => {
        if (e.key === 'Enter') {
          registerSearchClick()
        }
      }}
    />
  </div>
  <p class="mt-2 text-sm text-gray-500" id="search-description">
    Separate with commas. (ex. "computer science, computer programming")
  </p>
</div>
<!-- Submit Button -->

{#if disabled}
  <p class="font-semibold py-4">Searching...</p>
{:else if searchError}
  <p class="font-semibold py-4 text-red-800">
    Something went wrong... Please refresh the page.
  </p>
{:else}
  <button
    type="button"
    on:click={registerSearchClick}
    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-[#003B5C] hover:bg-[#00304c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 my-4"
    {disabled}
  >
    Search
  </button>
{/if}
