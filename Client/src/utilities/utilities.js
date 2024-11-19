export function flattenNestedData(data, parentKey = '') {
  let result = {};

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const itemKey = parentKey ? `${parentKey}_${index}` : `${index}`;
      result = { ...result, ...flattenNestedData(item, itemKey) };
    });
  } else if (typeof data === 'object' && data !== null) {
    Object.keys(data).forEach(key => {
      const newKey = parentKey ? `${parentKey}_${key}` : key;

      if (Array.isArray(data[key])) {
        // Flatten array items
        data[key].forEach((arrItem, arrIndex) => {
          const arrayItemKey = `${newKey}_${arrIndex}`;
          result = { ...result, ...flattenNestedData(arrItem, arrayItemKey) };
        });
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        // Flatten nested objects
        result = { ...result, ...flattenNestedData(data[key], newKey) };
      } else {
        // Base case: if it's a primitive value, set it in the result
        result[newKey] = data[key];
      }
    });
  } else {
    // Base case: if it's a primitive value, set it in the result
    result[parentKey] = data;
  }

  return result;
}

// Function to flatten an array of arrays of data objects
export function flattenData(data) {
  let flattenedResult = [];
  
  // Loop through the array of arrays and flatten each inner array of objects
  data.forEach(innerArray => {
    // For each inner array, flatten the objects inside it and merge into the final result
    innerArray.forEach(item => {
      flattenedResult.push(flattenNestedData(item));
    });
  });

  return flattenedResult;
}
