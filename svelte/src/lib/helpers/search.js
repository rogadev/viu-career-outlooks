import { state, keywordFields } from '$lib/stores/searching.js'

// Reactively updates variables for use in our async get request
let /** @type {string} */ credential, /** @type {string} */ keywords
keywordFields.subscribe(({ credential: cred, keywords: kw }) => {
  credential = cred
  keywords = kw
})

export const search = async () => {
  // Set search state to searching
  state.set('searching')
  // Fetch and store results. Handle errors.
  let searchData = {}
  try {
    const url = new URL(
      'https://viu-career-outlook.herokuapp.com/api/v1/jobs/credential'
    )
    url.searchParams.set('credentail', credential)
    url.searchParams.set('keywords', keywords)

    const response = await fetch(url)
    searchData = await response.json()
  } catch (e) {
    // @ts-ignore
    const error = new Error(e)
    state.set(error)
    return {
      status: 500,
      message: 'Internal Server Error',
      error: error,
    }
  }

  // Set search state to 'found'
  state.set('found')

  // Return results
  return {
    status: 200,
    body: searchData,
  }
}
