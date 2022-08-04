import { writable } from 'svelte/store'

/** @type {"idle" | "searching" | "found" | Error} */
let initialState = 'idle'

export const state = writable(
  /** @type {"idle" | "searching" | "found" | Error} */ (initialState)
)

export const keywordFields = writable({ credential: '', keywords: '' })

export const results = writable([])
