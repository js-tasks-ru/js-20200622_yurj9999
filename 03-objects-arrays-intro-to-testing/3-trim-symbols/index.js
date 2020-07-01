/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  const arr = string.split('');
  const duplicate = [];

  return arr.map((item, index) => {
    if (item === arr[index + 1]) {
      duplicate.push(item);
    } else {
      const result = [item, ...duplicate].join('').slice(0, size);
      duplicate.length = 0;
      return result;
    }
  }).join('');

}
