import { writable } from 'svelte/store'
import { results as searchResults } from '$lib/stores/searching.js'
import { search } from '$lib/search'

export const results = writable([])

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
    // TODO filter results from the searchResults and return as new, filtered array.
    return keyword
  }

  return {
    subscribe,
    clear,
    filterFor,
  }
}
