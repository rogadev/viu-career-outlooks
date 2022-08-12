<script>
  import Fuse from 'fuse.js'

  export let /** @type {{nid:number, title:string}[]} */ options
  export let /** @type {number | null} */ value = null

  $: list = new Fuse(options, {
    keys: ['title'],
    shouldSort: true,
    findAllMatches: true,
  })

  let input = /** @type {string}  */ ''
  let searchTerm = /** @type {string} */ ''
  let showDropdown = /** @type {Boolean} */ false
  let filteredList = /** @type {{nid:number,title:string}[]} */ options
  /** @type {NodeJS.Timeout} */
  let debounceTimer
  /** @type {HTMLInputElement} */
  let inputElement

  /** Performs fuzzy search on our list of options. Sets our filteredList to new array of results. */
  function search() {
    const result = list.search(input).map(({ item }) => item)
    filteredList = result ? result : []
  }

  /** Find the title of a given list item based on NID.
   *  @param {number} nid to search for.
   *  @returns {string} The title of the list item.
   */
  function findTitle(/** @type {number} */ nid) {
    if (!filteredList) return ''
    const result = filteredList.find((credential) => credential.nid === nid)
    return result ? result.title : ''
  }

  /** If we have items in the filtered list,  */
  function selectFirstItem() {
    if (filteredList.length === 0) return
    const { nid } = filteredList[0]
    chooseOption(nid)
    inputElement.blur()
    showDropdown = false
  }

  /** When we click/tab to select an option from our dropdown list, choose this option and start displaying results. */
  function chooseOption(/** @type {number} */ nid) {
    const title = findTitle(nid)
    input = title
    value = nid
    if (showDropdown) showDropdown = false
  }

  /** Most of the time, when our input changes, we'll want to debounce our search function for better performance. */
  function debouncedSearch() {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(search, 300)
  }

  // Every time our input changes, run the search, debounced.
  $: input && debouncedSearch()

  // If our input is empty (may have been cleared), reset the value of our filtered list to the full list of options.
  $: if (input === '') filteredList = options
</script>

<!-- If the relatedTarget on the focusout event is null, it is not related to our input or dropdown. In  that event, close the dropdown menu. -->
<div
  on:focusout={(e) => {
    if (e.relatedTarget === null) showDropdown = false
  }}
>
  <div class="relative mt-1">
    <input
      id="combobox"
      type="text"
      class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-12 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
      role="combobox"
      aria-controls="options"
      aria-expanded="false"
      autocomplete="off"
      bind:value={input}
      on:keydown={(e) => {
        if (e.key === 'Enter') {
          selectFirstItem()
        }
      }}
      on:focus={() => {
        showDropdown = true
      }}
      bind:this={inputElement}
    />
    <button
      type="button"
      class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
      on:click={() => {
        showDropdown = !showDropdown
      }}
    >
      <!-- Up/Down Arrows - Dropdown open/close toggle icon -->
      <svg
        class="h-5 w-5 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    {#if showDropdown}
      <ul
        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        id="options"
        role="listbox"
      >
        <!--
        Combobox option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.
        Active: "text-white bg-indigo-600", Not Active: "text-gray-900"
      -->{#each filteredList as item}
          <li
            class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900"
            id={`option-${item.nid}`}
            role="option"
          >
            <!-- Selected: "font-semibold" -->
            <button type="button" on:click={() => chooseOption(item.nid)}>
              <span class="block truncate">{item.title}</span>
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
