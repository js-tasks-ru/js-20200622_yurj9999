/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const newArr = [...arr];
  const compareIt = (a, b) => {
    return a.localeCompare(b, [], {sensitivity: 'variant', caseFirst: 'upper'});
  }
  if (param === 'asc') {
    return newArr.sort((first, second) => {
      return compareIt(first, second);
    })
  } else if (param === 'desc') {
    return newArr.sort((first, second) => {
      return compareIt(second, first);
    })
  }
}
