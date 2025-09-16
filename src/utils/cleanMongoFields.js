/**
 * Removes internal MongoDB fields from an object
 * @param {Object} obj - The object to clean
 * @returns {Object} - The cleaned object without MongoDB internal fields
 */
export const cleanMongoFields = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const { _id, __v, createdAt, updatedAt, ...cleanedObj } = obj;
  return cleanedObj;
};

/**
 * Recursively removes internal MongoDB fields from nested objects and arrays
 * @param {any} data - The data to clean (object, array, or primitive)
 * @returns {any} - The cleaned data
 */
export const deepCleanMongoFields = (data) => {
  if (Array.isArray(data)) {
    return data.map(deepCleanMongoFields);
  } else if (data && typeof data === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(data)) {
      if (!['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) {
        cleaned[key] = deepCleanMongoFields(value);
      }
    }
    return cleaned;
  }
  return data;
}; 