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

/**
 * Finds the indexes of the first character that match in the query string.
 * @param {string} item The item to search through.
 * @param {string} query The query to search for.
 * @returns {(number)[]} The indices of the item that match the query.
 */
function indexesOfFirstLetter(item, query) {
  const match = query[0]
  return item
    .split('')
    .map((letter, index) => {
      if (letter !== match) {
        return -1
      }

      return index
    })
    .filter((item) => item !== -1)
}

/**
 *
 * @param {string} item
 * @param {string} query
 * @returns
 */
function nearestIndexesFor(item, query) {
  /** Array of characters from our query string. */
  const letters = query.split('')

  /**
   * @type {Array<Array<number>>}
   */
  let indexes = []

  const firstLetterIndex = indexesOfFirstLetter(item, query)
  firstLetterIndex.forEach((startingIndex, loopingIndex) => {
    let index = startingIndex + 1
    let matchIndexes = [startingIndex]

    for (let i = 1; i < letters.length; i++) {
      const letter = letters[i]
      const match = letter === item[index]

      if (!match) {
        break
      }

      matchIndexes.push(index)

      index++
    }
  })

  indexes = indexes.filter((letterIndexes) => letterIndexes !== [])

  if (!indexes.length) {
    return false
  }

  return indexes.sort((a, b) => {
    if (a.length === 1) {
      return a[0] - b[0]
    }

    a = a[a.length - 1] - a[0]
    b = b[b.length - 1] - b[0]

    return a - b
  })[0]
}
