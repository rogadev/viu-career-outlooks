import { json as json$1 } from '@sveltejs/kit'
// HELPERS
import generateKeywordCombinations from '$lib/server/helpers/generateKeywordCombinations'
import pushJobIfUnique from '$lib/server/helpers/pushJobIfUnique'

// DATA
import unitGroups from '$lib/server/data/noc_2016_unit_groups.json'
import viuPrograms from '$lib/server/data/viu_programs.json'
// import enforceArray from '$lib/server/helpers/enforceArray'

/**
 * @typedef Job
 * @property {string} nid NID of the job
 * @property {string} title Title of the job
 */

/** @type {import('@sveltejs/kit').RequestHandler<{ nid: string }>} */
export async function GET({ params }) {
  const { nid } = params // extract nid
  if (!validNID(nid)) return new Response(undefined, { status: 400 }) // validate nid param

  const program = viuPrograms.find(
    ({ nid: programNid }) => programNid.toString() === nid
  ) // find program by nid
  if (!program) return new Response(undefined, { status: 500 }) // After initial validation of nid param, we SHOULD have a program. If not, something went horribly wrong.

  const {
    title,
    credential,
    noc_search_keywords: knownKeywords = false,
    known_noc_groups: knownGroups = false,
  } = program // extract program data
  if (!title || !credential) return new Response(undefined, { status: 500 }) // validate program data - if missing title or credential, we have a server/data problem.

  /** @type {Job[]} */
  const jobs = [] // collector array

  // OPTIONAL KNOWN KEYWORDS SEARCH
  if (knownKeywords) {
    console.log('Evaluating known keywords...')
    addJobsWithKeywordsAndCredential(jobs, knownKeywords, credential)
  }

  // OPTIONAL KNOWN NOC GROUPS SEARCH
  if (knownGroups) {
    console.log('Evaluating known groups...')
    addJobsFromKnownGroups(jobs, knownGroups)
  }

  // ORGANIC SEARCH
  console.log('Evaluating organic search...')
  addJobsWithKeywordsAndCredential(jobs, title, credential)

  console.log(`Found ${jobs.length} jobs.`) // log the number of jobs found

  return json$1({
    program,
    jobs,
  })
}

/**
 * Validates whether the NID param was passed, whether it is a valid VIU NID value, and whether it's the right param type.
 * @param {string} nid NID to validate
 * @returns {boolean} Whether the NID is valid. Invalid, false. Valid, true.
 */
function validNID(nid) {
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
function addJobsWithKeywordsAndCredential(collector, keywords, credential) {
  const initialCollectorLength = collector.length // save the initial length of the collector array

  const expandedCredentials = expandCredential(credential)
  const keywordCombinations = generateKeywordCombinations(
    keywords,
    expandedCredentials
  )

  unitGroups.forEach((group) => {
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

  console.info(`Added ${collector.length - initialCollectorLength} jobs.`) // log the number of jobs added to the collector array
  return collector
}

/**
 * Expands the credential into an array of credentials. This offers better searchability when comparing against NOC requirements properties. Without this expansion, the search would be severely limited due to the poor quality of NOC data.
 * @param {string} credential Credential to expand upon.
 * @returns {string[]} Array of expanded credentials.
 */
function expandCredential(credential) {
  if (!credential || typeof credential !== 'string')
    throw new Error(
      'expandCredentials() did not receive a valid credential property.'
    ) // validation

  const expandedCredentials = []
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
    default:
      throw new Error(
        'expandCredentials() did not receive a valid credential property to expand. Accepted properties include: degree, diploma, certificate, trades.'
      )
  }
  return expandedCredentials
}

/**
 * Add matched NOC groups to the collector array.
 * @param {Job[]} collector Collection of job objects.
 * @param {string[]} knownGroups Array of known NOC groups.
 * @returns {Job[]} The collector array with the new jobs added (primarily for debugging purposes).
 */
function addJobsFromKnownGroups(collector, knownGroups) {
  const initialCollectorLength = collector.length // save the initial length of the collector array
  unitGroups.forEach(({ noc, jobs }) => {
    if (knownGroups.includes(noc)) {
      jobs.forEach((title) => {
        // @ts-ignore
        collector = pushJobIfUnique({ noc, title }, collector)
      })
    }
  })
  console.info(`Added ${collector.length - initialCollectorLength} jobs.`) // log the number of jobs added to the collector array
  return collector
}
