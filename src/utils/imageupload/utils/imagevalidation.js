/**
 * Image validation utilities
 */

/**
 * Validates image file before upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateImageFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    minSize = 0,
    allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
    maxWidth = null,
    maxHeight = null,
    minWidth = 0,
    minHeight = 0,
  } = options

  const errors = []

  // Check if file exists
  if (!file) {
    errors.push("No file selected")
    return { isValid: false, errors }
  }

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${(maxSize / (1024 * 1024)).toFixed(1)}MB`)
  }

  if (file.size < minSize) {
    errors.push(`File size must be at least ${(minSize / 1024).toFixed(1)}KB`)
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.map((type) => type.split("/")[1]).join(", ")}`)
  }

  // For dimension validation (async - would need to be handled separately)
  // This is a placeholder for dimension checking
  if (maxWidth || maxHeight || minWidth || minHeight) {
    // You can implement dimension checking here if needed
    // This would require creating an Image object and checking its dimensions
    // For now, we'll skip this as it requires async handling
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validates multiple image files
 * @param {FileList|Array} files - Files to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with details for each file
 */
export const validateMultipleImageFiles = (files, options = {}) => {
  const fileArray = Array.from(files)
  const results = fileArray.map((file, index) => ({
    index,
    file,
    ...validateImageFile(file, options),
  }))

  const validFiles = results.filter((result) => result.isValid)
  const invalidFiles = results.filter((result) => !result.isValid)

  return {
    isValid: invalidFiles.length === 0,
    validFiles,
    invalidFiles,
    totalFiles: fileArray.length,
    validCount: validFiles.length,
    invalidCount: invalidFiles.length,
  }
}
