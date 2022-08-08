import { searchState, keywordFields, results } from '$lib/stores/searching.js'

let credentialField = ''
let keywordsField = ''

keywordFields.credential.subscribe(
  (credential) => (credentialField = credential.toLowerCase())
)
keywordFields.keywords.subscribe(
  (keywords) => (keywordsField = keywords.toLowerCase())
)

export const search = async () => {
  searchState.set('searching')
  try {
    const url = new URL(
      'https://viu-career-outlook.herokuapp.com/api/v1/jobs-by-credential'
    )
    url.searchParams.set('credential', credentialField)
    url.searchParams.set('keywords', keywordsField)

    const response = await fetch(url)
    const data = await response.json()
    const jobs = data.jobs

    if (jobs.length < 1) throw new Error('No results found.')

    searchState.set('found')
    results.set(jobs)
  } catch (e) {
    console.error(e)
    // @ts-ignore
    return searchState.set(new Error(e))
  }
}
