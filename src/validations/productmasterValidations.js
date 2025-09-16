import * as Yup from 'yup';

export const productcreationValidationSchema = Yup.object({
    skuCode: Yup.string().required("Product SKU Code is required"),
    color: Yup.string().required("Product Color is required"),
    panelcolor: Yup.string(),
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Product description is required"),
    brand: Yup.string().required("Product brand is required"),
    category: Yup.string().notOneOf(['default'], "Product description is required").required("Product description is required"),
    stylecategory: Yup.string().notOneOf(['default'], "Product style category is required").required("Product style category is required"),
    images: Yup.array()
        .min(1, "At least one image is required")
        .of(
            Yup.mixed()
        ),
    brandingcost: Yup.number().typeError("Branding cost must be a number").min(0, "Branding cost cannot be negative"),
    makingcost: Yup.number().typeError("Making cost must be a number").min(0, "Making cost cannot be negative"),
    mrp: Yup.number().typeError("MRP must be a number").min(0, "MRP cannot be negative"),
    fabric: Yup.array().of(
        Yup.object().shape({
            code: Yup.string().required('Code is required'),
            consumption: Yup.string().required('Consumption is required'),
            cost: Yup.string().required('Price is required'),
            uom: Yup.string().notOneOf(["default"], "UOM is required").required('UOM is required')
        })
    ),
    trims: Yup.array().of(
        Yup.object().shape({
            code: Yup.string().required('Code is required'),
            consumption: Yup.string().required('Consumption is required'),
            cost: Yup.string().required('Price is required'),
            uom: Yup.string().notOneOf(["default"], "UOM is required").required('UOM is required'),
            type: Yup.mixed().notRequired(),
        })
    ),
    accessories: Yup.array().of(
        Yup.object().shape({
            code: Yup.string().required('Code is required'),
            consumption: Yup.string().required('Consumption is required'),
            cost: Yup.number().required('Price is required'),
            uom: Yup.string().notOneOf(["default"], "UOM is required").required('UOM is required')
        })
    ),
})

export const productEditValidationSchema = Yup.object({
    skuCode: Yup.string(),
    color: Yup.string(),
    panelcolor: Yup.string(),
    name: Yup.string(),
    description: Yup.string(),
    brand: Yup.string(),
    category: Yup.string().notOneOf(['default'], "Product description is required"),
    images: Yup.array().of(Yup.mixed()),
    brandingcost: Yup.number().typeError("Branding cost must be a number").min(0, "Branding cost cannot be negative"),
    makingcost: Yup.number().typeError("Making cost must be a number").min(0, "Making cost cannot be negative"),
    mrp: Yup.number().typeError("MRP must be a number").min(0, "MRP cannot be negative"),
    fabric: Yup.array().of(
        Yup.object().shape({
            code: Yup.string().required('Code is required'),
            consumption: Yup.string().required('Consumption is required'),
            cost: Yup.string().required('Price is required'),
            uom: Yup.string().notOneOf(["default"], "UOM is required").required('UOM is required')
        })
    ),
    trims: Yup.array().of(
        Yup.object().shape({
            code: Yup.string().required('Code is required'),
            consumption: Yup.string().required('Consumption is required'),
            cost: Yup.string().required('Price is required'),
            uom: Yup.string().notOneOf(["default"], "UOM is required").required('UOM is required')
        })
    ),
    accessories: Yup.array().of(
        Yup.object().shape({
            code: Yup.string().required('Code is required'),
            consumption: Yup.string().required('Consumption is required'),
            cost: Yup.number().required('Price is required'),
            uom: Yup.string().notOneOf(["default"], "UOM is required").required('UOM is required')
        })
    ),
})