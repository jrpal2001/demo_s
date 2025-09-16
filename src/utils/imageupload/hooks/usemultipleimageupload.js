"use client"

import { useState, useCallback } from "react"
import { validateImageFile } from "../utils/imagevalidation"


/**
 * Hook for handling multiple image uploads
 * @param {Function} onImagesChange - Callback when images change
 * @param {Object} validationOptions - Image validation options
 * @param {number} maxImages - Maximum number of images allowed
 * @returns {Object} Multiple image upload utilities
 */
export const useMultipleImageUpload = (onImagesChange, validationOptions = {}, maxImages = 10) => {
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState([])

  const addImages = useCallback(
    (event) => {
      const files = Array.from(event.target.files)
      setErrors([])

      if (!files.length) return

      // Check if adding these files would exceed the limit
      if (images.length + files.length > maxImages) {
        setErrors([`Maximum ${maxImages} images allowed`])
        return
      }

      setIsLoading(true)

      try {
        const validFiles = []
        const newErrors = []

        files.forEach((file, index) => {
          const validation = validateImageFile(file, validationOptions)
          if (validation.isValid) {
            const previewUrl = URL.createObjectURL(file)
            validFiles.push({
              id: Date.now() + index,
              file,
              previewUrl,
              name: file.name,
              size: file.size,
            })
          } else {
            newErrors.push(`${file.name}: ${validation.errors[0]}`)
          }
        })

        if (newErrors.length > 0) {
          setErrors(newErrors)
        }

        if (validFiles.length > 0) {
          const updatedImages = [...images, ...validFiles]
          setImages(updatedImages)

          if (onImagesChange) {
            onImagesChange(updatedImages.map((img) => img.file))
          }
        }
      } catch (err) {
        setErrors(["Failed to process images"])
      } finally {
        setIsLoading(false)
      }
    },
    [images, maxImages, onImagesChange, validationOptions],
  )

  const removeImage = useCallback(
    (imageId) => {
      const imageToRemove = images.find((img) => img.id === imageId)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl)
      }

      const updatedImages = images.filter((img) => img.id !== imageId)
      setImages(updatedImages)

      if (onImagesChange) {
        onImagesChange(updatedImages.map((img) => img.file))
      }
    },
    [images, onImagesChange],
  )

  const reorderImages = useCallback(
    (fromIndex, toIndex) => {
      const updatedImages = [...images]
      const [movedImage] = updatedImages.splice(fromIndex, 1)
      updatedImages.splice(toIndex, 0, movedImage)

      setImages(updatedImages)

      if (onImagesChange) {
        onImagesChange(updatedImages.map((img) => img.file))
      }
    },
    [images, onImagesChange],
  )

  const clearAllImages = useCallback(() => {
    // Clean up all preview URLs
    images.forEach((img) => {
      URL.revokeObjectURL(img.previewUrl)
    })

    setImages([])
    setErrors([])

    if (onImagesChange) {
      onImagesChange([])
    }
  }, [images, onImagesChange])

  const resetImages = useCallback(() => {
    clearAllImages()
  }, [clearAllImages])

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.previewUrl)
    })
  }, [images])

  return {
    images,
    isLoading,
    errors,
    addImages,
    removeImage,
    reorderImages,
    clearAllImages,
    resetImages,
    cleanup,
    canAddMore: images.length < maxImages,
    remainingSlots: maxImages - images.length,
  }
}
