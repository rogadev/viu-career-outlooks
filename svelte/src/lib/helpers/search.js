import { state, keywordFields } from '$lib/stores/searching.js'
import { visitFunctionBody } from 'typescript'

// Reactively updates variables for use in our async get request
let /** @type {string} */ credential, /** @type {string} */ keywords
keywordFields.subscribe(({ credential: cred, keywords: kw }) => {
  credential = cred
  keywords = kw
})

/** @type {import('@sveltejs/kit').RequestHandler<{ noc: string }>} */
export async function GET() {
  state.set('searching')

  const url = new URL(
    'https://viu-career-outlook.herokuapp.com/api/v1/jobs/credential'
  )
  url.searchParams.set('credentail', credential)
  url.searchParams.set('keywords', keywords)

  const response = await fetch(url)
  const data = await response.json()

  const object = {}
  try {
    object.status = 200
    object.body = { data: data.body }
  } catch (e) {
    // @ts-ignore
    state.set(e)
    object.status = 500
    // @ts-ignore
    object.body = e.message
  }
  return object
}
