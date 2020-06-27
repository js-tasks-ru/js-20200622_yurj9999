/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const resultPick = {};
  const objData = Object.entries(obj);

  objData.forEach((data, index) => {
    if (fields.includes(data[0])) {
      resultPick[`${data[0]}`] = data[1];
    }
  });

  return resultPick;
};
