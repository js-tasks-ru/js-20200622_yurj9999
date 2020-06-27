/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const resultOmit = {};
  const objData = Object.entries(obj);

  [...fields].forEach((field) => {
    objData.forEach((objElement, index) => {
      if (objElement[0] === field) {
        objData.splice(index, 1);
      }
    });
  });

  objData.forEach((objElement) => {
    resultOmit[`${objElement[0]}`] = objElement[1];
  });

  return resultOmit;
};
