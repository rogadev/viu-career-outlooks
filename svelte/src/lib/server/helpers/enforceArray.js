/**
 * Accepts an item that may be an array, or a string of items, separated by commas. Enforces that the returned value is an array of strings.
 * @param {string[] | string} input Item to be enforced as an array of strings.
 * @returns {string[]} Array of strings.
 */
export default (input) => {
  if (Array.isArray(input)) {
    return input
  } else {
    if (typeof input === 'string' && input.includes(',')) {
      return input.split(',')
    } else {
      return [input]
    }
  }
}
