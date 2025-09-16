import { api } from "@/utils/axios";

// MODIFIED API function - now only accepts single department updates
export const updateDepartmentWorkOrder = async (workOrderId, department, data) => {
  console.log("🚀 ~ updateDepartmentWorkOrder ~", { workOrderId, department, data })

  // Validate that only one department is being updated
  if (department === "all") {
    throw new Error("Admin users must update one department at a time")
  }

  // FIXED: Client-side validation to ensure productId is never null
  const validateProductIds = (data, department) => {
    const errors = []

    if (department === "trims" && data.trims?.products) {
      data.trims.products.forEach((product, index) => {
        if (!product.productId || product.productId === null || product.productId === "") {
          errors.push(`Trims product ${index + 1}: Product selection is required`)
        }
      })
    }

    if (department === "stitching" && data.stitching) {
      data.stitching.forEach((stitchEntry, stitchIndex) => {
        if (stitchEntry.products) {
          stitchEntry.products.forEach((product, productIndex) => {
            if (!product.productId || product.productId === null || product.productId === "") {
              errors.push(
                `Stitching entry ${stitchIndex + 1}, product ${productIndex + 1}: Product selection is required`,
              )
            }
          })
        }
      })
    }

    if (department === "finishing" && data.finishing?.products) {
      data.finishing.products.forEach((product, index) => {
        if (!product.productId || product.productId === null || product.productId === "") {
          errors.push(`Finishing product ${index + 1}: Product selection is required`)
        }
      })
    }

    return errors
  }

  // FIXED: Validate before sending to backend
  const validationErrors = validateProductIds(data, department)
  if (validationErrors.length > 0) {
    throw new Error(`Validation failed: ${validationErrors.join(", ")}`)
  }

  try {
    const response = await api.patch(`/admin/workorder/department/update`, {
      workOrderId,
      department,
      data,
    })

    if (response && response.status === 200) {
      return response.data.message
    }
  } catch (error) {
    // FIXED: Better error handling for validation errors
    if (error.response?.status === 400 && error.response?.data?.data) {
      // Handle validation errors from backend
      const backendErrors = Array.isArray(error.response.data.data)
        ? error.response.data.data.map((err) => err.message || err).join(", ")
        : error.response.data.message
      throw new Error(`Validation Error: ${backendErrors}`)
    }

    throw new Error(error.response?.data?.message || error.message || "Update failed")
  }
}

export const getDepartmentWorkOrderById = async (id) => {
  console.log("🚀 ~ getDepartmentWorkOrderById ~", id);
  try {
    const response = await api.get(`/admin/workorder/department/${id}`);
    if (response && response.status === 200) {
      return response.data.data;  // assuming your ApiRes sends data in `data` field
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updateReturnedGoods = async (workOrderId, department, returnedGoods) => {
  console.log("🚀 ~ updateReturnedGoods ~", { workOrderId, department, returnedGoods });

  try {
    const response = await api.patch(`/admin/workorder/department/update/return`, {
      workOrderId,
      department,
      returnedGoods,
    });

    if (response && response.status === 200) {
      return response.data.message;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to update returned goods");
  }
};
