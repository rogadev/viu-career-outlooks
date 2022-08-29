import enforceArray from './enforceArray'

/**
 * Generates all possible combinations of 2 input keyword strings and/or string arrays.
 * @param {string[] | string} arr1
 * @param {string[] | string} arr2
 */
export default (arr1, arr2) => {
  if (!arr1 || !arr2) throw new Error('enforceArray() requires 2 arguments')

  const combinations = []
  for (const item of enforceArray(arr1)) {
    for (const item2 of enforceArray(arr2)) {
      combinations.push([item, item2])
    }
  }
  const expandedResults = combinations.map((combo) =>
    combo.map((item) => item.toLowerCase())
  )
  return expandedResults
}
