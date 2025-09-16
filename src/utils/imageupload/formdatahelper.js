/**
 * Utility functions for handling FormData with images
 */

/**
 * Creates FormData for single image upload
 * @param {Object} values - Form values object
 * @param {Object} options - Configuration options
 * @returns {FormData} Prepared FormData object
 */
export const createSingleImageFormData = (values, options = {}) => {
  const { excludeFields = [], imageFieldName = "image", conditionalFields = {} } = options

  const formData = new FormData()

  Object.keys(values).forEach((key) => {
    // Skip excluded fields
    if (excludeFields.includes(key)) {
      return
    }

    // Handle image field
    if (key === imageFieldName) {
      if (values[key] instanceof File) {
        formData.append(key, values[key])
      }
      return
    }

    // Handle conditional fields
    if (conditionalFields[key]) {
      const condition = conditionalFields[key]
      if (typeof condition === "function" && condition(values)) {
        formData.append(key, values[key])
      } else if (condition === true) {
        formData.append(key, values[key])
      }
      return
    }

    // Append regular fields
    if (values[key] !== null && values[key] !== undefined && values[key] !== "") {
      formData.append(key, values[key])
    }
  })

  return formData
}

/**
 * Creates FormData for multiple image upload
 * @param {Object} values - Form values object
 * @param {Object} options - Configuration options
 * @returns {FormData} Prepared FormData object
 */
export const createMultipleImageFormData = (values, options = {}) => {
  const { excludeFields = [], imageFieldName = "images", conditionalFields = {} } = options

  const formData = new FormData()

  Object.keys(values).forEach((key) => {
    // Skip excluded fields
    if (excludeFields.includes(key)) {
      return
    }

    // Handle multiple images field
    if (key === imageFieldName) {
      if (Array.isArray(values[key])) {
        values[key].forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`${imageFieldName}[${index}]`, file)
          }
        })
      }
      return
    }

    // Handle conditional fields
    if (conditionalFields[key]) {
      const condition = conditionalFields[key]
      if (typeof condition === "function" && condition(values)) {
        formData.append(key, values[key])
      } else if (condition === true) {
        formData.append(key, values[key])
      }
      return
    }

    // Append regular fields
    if (values[key] !== null && values[key] !== undefined && values[key] !== "") {
      formData.append(key, values[key])
    }
  })

  return formData
}

/**
 * Generic FormData creator that handles both single and multiple images
 * @param {Object} values - Form values object
 * @param {Object} options - Configuration options
 * @returns {FormData} Prepared FormData object
 */
export const createFormDataFromValues = (values, options = {}) => {
  const { imageFields = ["image"], multipleImageFields = ["images"] } = options

  const formData = new FormData()

  Object.keys(values).forEach((key) => {
    // Handle single image fields
    if (imageFields.includes(key)) {
      if (values[key] instanceof File) {
        formData.append(key, values[key])
      }
      return
    }

    // Handle multiple image fields
    if (multipleImageFields.includes(key)) {
      if (Array.isArray(values[key])) {
        values[key].forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`${key}[${index}]`, file)
          }
        })
      }
      return
    }

    // Handle other fields
    if (values[key] !== null && values[key] !== undefined && values[key] !== "") {
      formData.append(key, values[key])
    }
  })

  return formData
}
