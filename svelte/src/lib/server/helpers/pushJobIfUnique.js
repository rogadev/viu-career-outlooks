/**
 * @typedef Job
 * @property {string} noc NID of the job
 * @property {string} title Title of the job
 */

/**
 * Pushes a job to the target array only if it is unique to that array.
 * @param {Job} job
 * @param {Job[]} array
 * @returns {Job[]}
 */
export default (job, array) => {
  // Validate that both properties are defined.
  if (!job || !array) {
    throw new Error('pushUniqueJobObject() requires an item and an array.')
  }

  // Validate that the job object has the correct properties.
  if (!job.noc || !job.title) {
    throw new Error(
      'pushUniqueJobObject() requires a job object with "noc" and "title" properties.'
    )
  }

  // First, ensure that our array is, in fact, an array.
  if (!Array.isArray(array)) {
    throw new Error(
      `pushUniqueJobObject() expects an array as the second argument. Received: "${array}", of type: ${typeof array}`
    )
  }

  // If the array does not contain an object with the same noc and title properties, push this job object to the array.
  const arrayContainsJob = array.some(
    (item) => item.noc === job.noc && item.title === job.title
  )
  if (!arrayContainsJob) {
    array.push(job)
  }

  return array
}
