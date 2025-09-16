"use client"

import { useState, useCallback } from "react"
import { validateImageFile } from "../utils/imagevalidation"

/**
 * Hook for handling single image upload
 * @param {Function} onImageChange - Callback when image changes
 * @param {Object} validationOptions - Image validation options
 * @returns {Object} Single image upload utilities
 */
export const useSingleImageUpload = (onImageChange, validationOptions = {}) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleImageChange = useCallback(
    (event) => {
      const file = event.target.files[0]
      setError(null)

      if (!file) {
        clearImage()
        return
      }

      // Validate file
      const validation = validateImageFile(file, validationOptions)
      if (!validation.isValid) {
        setError(validation.errors[0])
        return
      }

      setIsLoading(true)

      try {
        // Clean up previous preview URL
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl)
        }

        const previewUrl = URL.createObjectURL(file)
        setImagePreviewUrl(previewUrl)
        setImageFile(file)

        // Call the provided callback with the file
        if (onImageChange) {
          onImageChange(file)
        }
      } catch (err) {
        setError("Failed to process image")
      } finally {
        setIsLoading(false)
      }
    },
    [imagePreviewUrl, onImageChange, validationOptions],
  )

  const clearImage = useCallback(() => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl)
    }
    setImagePreviewUrl(null)
    setImageFile(null)
    setError(null)

    if (onImageChange) {
      onImageChange(null)
    }
  }, [imagePreviewUrl, onImageChange])

  const resetImage = useCallback(() => {
    clearImage()
  }, [clearImage])

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl)
    }
  }, [imagePreviewUrl])

  return {
    imagePreviewUrl,
    imageFile,
    isLoading,
    error,
    handleImageChange,
    clearImage,
    resetImage,
    cleanup,
  }
}
