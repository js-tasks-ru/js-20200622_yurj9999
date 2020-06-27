/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const resultOmit = {};
  const objData = Object.entries(obj);

  objData.forEach((data, index) => {
    if (!fields.includes(data[0])) {
      resultOmit[`${data[0]}`] = data[1];
    }
  });

  return resultOmit;
};
