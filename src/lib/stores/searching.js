// IMPORTS
import { writable } from 'svelte/store'

/** State store - Stores the current state of the searching store.
 *
 * Valid types: 'idle' | 'searching' | 'found' | Error */
export const state = writable(
  /** @type {"idle" | "searching" | "found" | Error} */ 'idle'
)

/** Keyword field stores, values used for searching. */
export const keywordFields = {
  credential: writable(''),
  keywords: writable(''),
}

/**
 * Results store.
 */
export const results = writable([])
