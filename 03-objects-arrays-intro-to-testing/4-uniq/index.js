/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  const set = new Set(arr);
  const result = [];

  for (const value of set) {
    result.push(value);
  }

  return result;
}
