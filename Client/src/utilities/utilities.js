// Recursive function to flatten nested data (objects and arrays)
export function flattenNestedData(data, parentKey = '') {
  let result = {};

  // If data is an array, iterate through it
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const itemKey = parentKey ? `${parentKey}_${index}` : `${index}`;
      result = { ...result, ...flattenNestedData(item, itemKey) };
    });
  }
  // If data is an object, iterate through the keys
  else if (typeof data === 'object' && data !== null) {
    Object.keys(data).forEach(key => {
      const newKey = parentKey ? `${parentKey}_${key}` : key;

      // If the value is an array, recursively flatten its elements
      if (Array.isArray(data[key])) {
        data[key].forEach((arrItem, arrIndex) => {
          const arrayItemKey = `${newKey}_${arrIndex}`;
          result = { ...result, ...flattenNestedData(arrItem, arrayItemKey) };
        });
      }
      // If the value is an object, recursively flatten it
      else if (typeof data[key] === 'object' && data[key] !== null) {
        result = { ...result, ...flattenNestedData(data[key], newKey) };
      }
      // If it's a primitive value, add it to the result
      else {
        result[newKey] = data[key];
      }
    });
  } else {
    // For primitive values, just add them with the current key
    result[parentKey] = data;
  }

  return result;
}

// A helper function to flatten an array of data items
export function flattenData(data) {
  return data.map(item => flattenNestedData(item));
}