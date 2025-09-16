import * as Yup from "yup"

export const getValidationSchema = (category) => {
  const baseSchema = {
    hsn: Yup.string().required("HSN is required"),
    uom: Yup.string().notOneOf(["default"], "UOM is required"),
    price: Yup.number().required("Price is required").positive("Price must be positive"),
  }

  switch (category) {
    case "fabric":
      return Yup.object({
        ...baseSchema,
        fabricName: Yup.string().required("Fabric name is required"),
        fabricCode: Yup.string().required("Fabric code is required"),
        fabricColor: Yup.string().required("Fabric color is required"),
        subCategory: Yup.string().required("Sub-category is required"),
        collarHeight: Yup.string().when('subCategory', {
          is: 'colar',
          then: () => Yup.string().required('Collar Height is required'),
          otherwise: () => Yup.mixed().notRequired(),
        }),
        collarLength: Yup.string().when('subCategory', {
          is: 'colar',
          then: () => Yup.string().required('Collar Length is required'),
          otherwise: () => Yup.mixed().notRequired(),
        }),
        tapeHeight: Yup.string().when('subCategory', {
          is: 'colar',
          then: () => Yup.string().required('Tape Height is required'),
          otherwise: () => Yup.mixed().notRequired(),
        }),
      })
    case "trims":
      return Yup.object({
        ...baseSchema,
        trimsName: Yup.string().required("Trims name is required"),
        trimsCode: Yup.string().required("Trims code is required"),
        trimsColor: Yup.string().required("Trims color is required"),
      })
    case "accessories":
      return Yup.object({
        ...baseSchema,
        accessoriesName: Yup.string().required("Accessories name is required"),
        accessoriesCode: Yup.string().required("Accessories code is required"),
        accessoriesColor: Yup.string().required("Accessories color is required"),
      })
    default:
      return Yup.object({
        category: Yup.string().notOneOf(["default"], "Category is required"),
        ...baseSchema,
      })
  }
}
