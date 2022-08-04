import { state, keywordFields, results } from '$lib/stores/searching.js'

let credentialField = ''
let keywordsField = ''

// Reactively updates variables for use in our async get request
let /** @type {string} */ credential, /** @type {string} */ keywords
keywordFields.subscribe(({ credential, keywords }) => {
  credentialField = credential.toLowerCase()
  keywordsField = keywords.toLowerCase()
})

export const search = async () => {
  // Set search state to searching
  state.set('searching')
  // Fetch and store results. Handle errors.
  let searchData = {}
  try {
    const url = new URL(
      'https://viu-career-outlook.herokuapp.com/api/v1/jobs-by-credential'
    )
    url.searchParams.set('credential', credentialField)
    url.searchParams.set('keywords', keywordsField)

    const response = await fetch(url)
    searchData = await response.json()
  } catch (e) {
    // @ts-ignore
    const error = new Error(e)
    console.error(e)
    state.set(error)
  }

  // Set search state to 'found'
  state.set('found')

  // Return results
  results.set(searchData)
}
