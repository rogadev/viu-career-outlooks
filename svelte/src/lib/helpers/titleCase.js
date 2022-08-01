/**
 * Title case a given string, ignoring aything inside brackets.
 * @param {string} str  Input string to title case.
 * @returns {string} The title case of the input string.
 */
export const titleCase = (str) => {
  // Break the string into portions if the word contains brackets. Do this, then recursively call this function on each portion outside of the brackets.
  if (str.includes('(') && str.includes(')')) {
    const startIndex = str.indexOf('(')
    const endIndex = str.indexOf(')')
    const beforeBrackets = startIndex > 0 ? str.substring(0, startIndex) : ''
    const betweenBrackets = str.substring(startIndex, endIndex + 1)
    const afterBrackets =
      endIndex < str.length - 1 ? str.substring(endIndex + 1) : ''
    return `${
      beforeBrackets ? titleCase(beforeBrackets) : ''
    }${betweenBrackets}${afterBrackets ? titleCase(afterBrackets) : ''}`
  }

  return str
    .split(' ')
    .map((word) => {
      // Look for special characters '-' and '_' and save their index in the array.
      const specialCharIndex = []
      for (let i = 0; i < word.length; i++) {
        if (word.charAt(i) === '-' || word.charAt(i) === '_') {
          specialCharIndex.push(i)
        }
      }
      // for every index in specialCharIndex, capitalize the next character in 'word' if one exists.
      for (let i = 0; i < specialCharIndex.length; i++) {
        if (word.length > specialCharIndex[i] + 1) {
          word =
            word.substring(0, specialCharIndex[i] + 1) +
            word.charAt(specialCharIndex[i] + 1).toUpperCase() +
            word.substring(specialCharIndex[i] + 2)
        }
      }
      // Lastly, capitalize the first character of every word and return it.
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}
