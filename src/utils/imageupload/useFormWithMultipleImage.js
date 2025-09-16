import { useFormik } from "formik"
import { useMultipleImageUpload } from "./multipleimageupload"
import { createMultipleImageFormData } from "./formdatahelper"

/**
 * Combined hook for forms with multiple image upload
 */
export const useFormWithMultipleImages = ({
  initialValues,
  validationSchema,
  onSubmit,
  imageFieldName = "images",
  validationOptions = {},
  maxImages = 10,
}) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const formData = createMultipleImageFormData(values, { imageFieldName })
      await onSubmit(formData, values)
    },
  })

  const {
    images,
    isLoading,
    errors,
    addImages,
    removeImage,
    reorderImages,
    clearAllImages,
    resetImages,
    cleanup,
    canAddMore,
    remainingSlots,
  } = useMultipleImageUpload((files) => formik.setFieldValue(imageFieldName, files), validationOptions, maxImages)

  const resetForm = () => {
    formik.resetForm()
    resetImages()
  }

  return {
    formik,
    images,
    isLoading,
    errors,
    addImages,
    removeImage,
    reorderImages,
    clearAllImages,
    resetForm,
    cleanup,
    canAddMore,
    remainingSlots,
  }
}
