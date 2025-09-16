import { useFormik } from "formik"
import { useSingleImageUpload } from "./hooks/usesingleimageupload"
import { createSingleImageFormData } from "../utils/formDataHelper"

/**
 * Combined hook for forms with single image upload
 */
export const useFormWithSingleImage = ({
  initialValues,
  validationSchema,
  onSubmit,
  imageFieldName = "image",
  validationOptions = {},
}) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const formData = createSingleImageFormData(values, { imageFieldName })
      await onSubmit(formData, values)
    },
  })

  const { imagePreviewUrl, imageFile, isLoading, error, handleImageChange, clearImage, resetImage, cleanup } =
    useSingleImageUpload((file) => formik.setFieldValue(imageFieldName, file), validationOptions)

  const resetForm = () => {
    formik.resetForm()
    resetImage()
  }

  return {
    formik,
    imagePreviewUrl,
    imageFile,
    isLoading,
    error,
    handleImageChange,
    clearImage,
    resetForm,
    cleanup,
  }
}
