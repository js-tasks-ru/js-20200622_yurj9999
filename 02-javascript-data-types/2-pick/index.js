/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const resultPick = {};
  const objData = Object.entries(obj);

  [...fields].forEach((field) => {
    objData.forEach((objElement) => {
      if (objElement[0] === field) {
        resultPick[`${objElement[0]}`] = objElement[1];
      }
    });
  });

  return resultPick;
};
