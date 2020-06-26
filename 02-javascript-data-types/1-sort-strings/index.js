/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const newArr = [];
  arr.forEach((item) => newArr.push(item));
  if (param === 'asc') {
    return newArr.sort((first, second) => {
      return first.localeCompare(second, [], {sensitivity: 'variant', caseFirst: 'upper'});
    })
  } else if (param === 'desc') {
    return newArr.sort((first, second) => {
      return second.localeCompare(first, [], {sensitivity: 'variant', caseFirst: 'upper'});
    })
  }
}
