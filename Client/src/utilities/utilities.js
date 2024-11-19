// Recursive function to flatten nested data (objects and arrays)
export function flattenNestedData(data, parentKey = '') {
  let result = {};
    if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const itemKey = parentKey ? `${parentKey}_${index}` : `${index}`;
      result = { ...result, ...flattenNestedData(item, itemKey) };
    });
  }
  else if (typeof data === 'object' && data !== null) {
    Object.keys(data).forEach(key => {
      const newKey = parentKey ? `${parentKey}_${key}` : key;
      if (Array.isArray(data[key])) {
        data[key].forEach((arrItem, arrIndex) => {
          const arrayItemKey = `${newKey}_${arrIndex}`;
          result = { ...result, ...flattenNestedData(arrItem, arrayItemKey) };
        });
      }
      else if (typeof data[key] === 'object' && data[key] !== null) {
        result = { ...result, ...flattenNestedData(data[key], newKey) };
      }
      else {
        result[newKey] = data[key];
      }
    });
  } else {
    result[parentKey] = data;
  }
  return result;
}
export function flattenData(data) {
  return data.map(item => flattenNestedData(item));
}
