import { programs } from '$lib/stores/programs'
let programList = programs.subscribe((v) => v)

/**
 * Fetch the searchable program list from our API.
 * @returns
 */
const getPrograms = async () => {
  if (!programList.length) {
    try {
      const response = await fetch('/api/v1/programs')
      const { data } = await response.json()
      programs.set(data)
      return data
    } catch (e) {
      console.error(e)
    }
  } else {
    return programList
  }
}

const getProgram = async (/** @type {number} */ nid) => {
  try {
    const response = await fetch(
      `https://viu-career-outlook.herokuapp.com/api/v1/jobs/program/${nid}`
    )
    if (response.status === 200) {
      const { data } = await response.json()
      return data
    }
    return []
  } catch (e) {
    console.error(e)
  }
}

export { getPrograms, getProgram }
