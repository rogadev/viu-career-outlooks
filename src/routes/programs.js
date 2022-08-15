// Extracted from .svelte file for testing.

/**
 * Fetch the searchable program list from our API.
 * @returns
 */
const getPrograms = async () => {
  try {
    const response = await fetch(
      'https://viu-career-outlook.herokuapp.com/api/v1/programs/searchable'
    )
    const { data } = await response.json()
    return data
  } catch (e) {
    console.error(e)
    // @ts-ignore
    return new Error(e)
  }
}

const getProgram = async (/** @type {number} */ nid) => {
  const response = await fetch(
    `https://viu-career-outlook.herokuapp.com/api/v1/jobs/program/${nid}`
  )
  const { data } = await response.json()
  return data
}

export { getPrograms, getProgram }
