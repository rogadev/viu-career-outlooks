import { state, keywordFields, results } from '$lib/stores/searching.js'
import { pushIfUnique } from '$lib/helpers/array.helpers.js'

let credentialField = ''
let keywordsField = ''

// Reactively updates variables for use in our async get request
let /** @type {string} */ credential, /** @type {string} */ keywords

keywordFields.credential.subscribe(
  (credential) => (credentialField = credential.toLowerCase())
)
keywordFields.keywords.subscribe(
  (keywords) => (keywordsField = keywords.toLowerCase())
)

export const search = async () => {
  // Set search state to searching
  state.set('searching')

  // Fetch and store results. Handle errors.
  try {
    // Prepare request url.
    const url = new URL(
      'https://viu-career-outlook.herokuapp.com/api/v1/jobs-by-credential'
    )
    url.searchParams.set('credential', credentialField)
    url.searchParams.set('keywords', keywordsField)
    // fetch and parse json response
    const response = await fetch(url)
    const data = await response.json()
    const jobs = data.jobs
    if (jobs.length < 1) throw new Error('No results found.')
    state.set('found')
    results.set(jobs)
  } catch (e) {
    console.error(e)
    // @ts-ignore
    return state.set(new Error(e))
  }
}
