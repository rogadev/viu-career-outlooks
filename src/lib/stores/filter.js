import { writable } from 'svelte/store'
import { results as searchResults } from '$lib/stores/searching.js'

const createFilter = () => {
  const { subscribe, set, update } = writable([])

  /**
   * Clears the results store (sets to an empty array).
   */
  // @ts-ignore
  const clear = () => set([])

  /**
   * Set the filtered results back to the full results saved in the searching store. If the searching store is empty, set to an empty array.
   */
  const reset = () => {
    searchResults.subscribe((value) => {
      if (!value) set([])
      else set(value)
    })
  }

  /**
   * Use fuzzy searching to filter/reduce the search results.
   * @param {string} keyword The keyword to filter by. If empty, clears the results.
   */
  const filterFor = (keyword) => {
    if (!keyword) {
      reset()
      return
    }
    const allResults = searchResults.subscribe((value) => value)
    const results = fuzzySearch(keyword, allResults)
    if (results.success) {
      outputSearchResults(results)
      console.log(results)
    } else {
      console.error(results)
    }
  }

  return {
    subscribe,
    clear,
    filterFor,
  }
}

export const results = createFilter()

const fuzzySearch = (needle, haystake) => {
  const reulsts = []
  // TODO
}
