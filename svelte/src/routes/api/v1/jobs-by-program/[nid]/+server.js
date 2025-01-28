import { json as json$1, error } from '@sveltejs/kit'
// HELPERS
import generateKeywordCombinations from '$lib/server/helpers/generateKeywordCombinations'
import pushJobIfUnique from '$lib/server/helpers/pushJobIfUnique'

// DATA
import unitGroups from '$lib/server/data/noc_2016_unit_groups.json'
import viuPrograms from '$lib/server/data/viu_programs.json'
// import enforceArray from '$lib/server/helpers/enforceArray'

// TYPES
/**
 * @typedef Job
 * @property {string} nid NID of the job
 * @property {string} title Title of the job
 */

// LOCAL FUNCTIONS
/**
 * Add matched NOC groups to the collector array.
 * @param {Job[]} collector Collection of job objects.
 * @param {string[]} knownGroups Array of known NOC groups.
 * @returns {Job[]} The collector array with the new jobs added (primarily for debugging purposes).
 */
const addJobsFromKnownGroups = (collector, knownGroups) => {
  unitGroups.forEach(({ noc, jobs }) => {
    if (knownGroups.includes(noc)) {
      jobs.forEach((title) => {
        // @ts-ignore
        collector = pushJobIfUnique({ noc, title }, collector)
      })
    }
  })
  return collector
}

/**
 * Expands the credential into an array of credentials. This offers better searchability when comparing against NOC requirements properties. Without this expansion, the search would be severely limited due to the poor quality of NOC data.
 * @param {string} credential Credential to expand upon.
 * @returns {string[]} Array of expanded credentials.
 */
const expandCredential = (credential) => {
  if (!credential || typeof credential !== 'string')
    throw error(
      500,
      `Did not receive a valid credential property while expanding credential field(s). Validating ${credential}`
    ) // validate credential param

  // Collector
  const expandedCredentials = []

  // Expand credential
  switch (credential.toLowerCase().trim()) {
    case 'degree':
      expandedCredentials.push(
        'degree',
        'diploma',
        'university program',
        'university or college'
      )
      break
    case 'diploma':
      expandedCredentials.push(
        'diploma',
        'college program',
        'college or other program'
      )
      break
    case 'certificate':
      expandedCredentials.push(
        'certificate',
        'school programs',
        'school program',
        'apprenticeship',
        'red seal',
        'trades program',
        'trades school'
      )
    case 'trades':
      expandedCredentials.push(
        'trades school',
        'trades program',
        'trades certificate',
        'trades diploma',
        'trades degree',
        'trades university',
        'trades college',
        'trade school',
        'trade program',
        'trade certificate',
        'trade diploma',
        'trade degree',
        'red seal'
      )
      break
    default:
      // Should never hit this case. If we do, something has gone very wrong.
      throw error(
        500,
        'Server function expandCredentials() did not receive a valid credential property to expand. Accepted properties include: degree, diploma, certificate, trades.'
      )
  }
  return expandedCredentials
}

/**
 * Validates whether the NID param was passed, whether it is a valid VIU NID value, and whether it's the right param type.
 * @param {string} nid NID to validate
 * @returns {boolean} Whether the NID is valid. Invalid, false. Valid, true.
 */
const validNID = (nid) => {
  if (!nid) return false // validate nid exists
  if (typeof nid !== 'string') return false // validate nid param passed is a string
  const nidNumber = Number(nid) // convert nid to number
  if (!nidNumber || !(Number.isInteger(nidNumber) && nidNumber > 0))
    return false // validate nid as a number is not undefined, and is an integer greater, than 0
  if (!viuPrograms.find(({ nid: programNid }) => programNid.toString() === nid))
    return false // validate nid is a valid VIU program nid
  // If all conditions validate, return true.
  return true
}

/**
 * Find jobs related to the given keywords and credential. Adds them to the collector array only if they are unique to the array.
 * @param {Job[]} collector
 * @param {string | string[]} keywords
 * @param {string} credential
 * @return {Job[]} The collector array with the new jobs added (primarily for debugging purposes).
 */
const addJobsWithKeywordsAndCredential = (collector, keywords, credential) => {
  // Expand credentials and create exhaustive list of keyword combinations to search for.
  const expandedCredentials = expandCredential(credential)
  const keywordCombinations = generateKeywordCombinations(
    keywords,
    expandedCredentials
  )

  unitGroups.forEach((group) => {
    // Extract the NOC code
    const { noc } = group

    // Ignore groups that require "years of experience" in the requirements property.
    let experienceRequired = false
    group.requirements.forEach((requirement) => {
      if (requirement.includes('years of experience')) experienceRequired = true
    })
    if (experienceRequired) return // skip groups that require experience

    // Compare search keywords against group requirements and add jobs if they match.
    group.requirements.forEach((requirement) => {
      keywordCombinations.forEach(([keyword, credential]) => {
        if (requirement.includes(keyword) && requirement.includes(credential))
          group.jobs.forEach((title) => {
            // @ts-ignore
            collector = pushJobIfUnique({ noc, title }, collector)
          })
      })
    })
  })

  return collector
}

/** @type {import('@sveltejs/kit').RequestHandler<{ nid: string }>} */
export async function GET({ params }) {
  const { nid } = params // extract nid
  if (!validNID(nid))
    throw error(400, `Invalid NID provided. Validating ${nid}`) // validate nid param

  const program = viuPrograms.find(
    ({ nid: programNid }) => programNid.toString() === nid
  ) // find program by nid
  if (!program) throw error(500, `No program found. Validating ${program}`) // After initial validation of nid param, we SHOULD have a program. If not, something went horribly wrong.

  const {
    title,
    credential,
    noc_search_keywords: knownKeywords = false,
    known_noc_groups: knownGroups = false,
  } = program // extract program data
  if (!title || !credential)
    throw error(
      500,
      `There was a problem with the server. Validating title and credential: ${title}, ${credential}`
    ) // validate program data - if missing title or credential, we have a server/data problem.

  /** @type {Job[]} */
  const jobs = [] // collector array

  // OPTIONAL KNOWN KEYWORDS SEARCH
  if (knownKeywords) {
    addJobsWithKeywordsAndCredential(jobs, knownKeywords, credential)
  }

  // OPTIONAL KNOWN NOC GROUPS SEARCH
  if (knownGroups) {
    addJobsFromKnownGroups(jobs, knownGroups)
  }

  // ORGANIC SEARCH
  addJobsWithKeywordsAndCredential(jobs, title, credential)

  if (jobs.length === 0) {
    console.info(
      `[PROG-NO-RESULTS] url=https://career-outlooks.viu.ca prog-nid=${nid}`
    )
  }

  return json$1({
    program,
    jobs,
  })
}
