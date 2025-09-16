import { api } from "@/utils/axios"

// Fetch all inventory by department
export const fetchAllInventory = async (department, page, pageSize) => {
  try {
    const response = await api.get(`/admin/inventory/${department}`, {
      params: {
        page,
        limit: pageSize,
      },
    })

    if (response && response.data && response.data.data) {
      return {
        data: response.data.data,
        totalCount: response.data.totalCount || response.data.data.length,
      }
    } else {
      console.error("Unexpected API response format:", response)
      return { data: [], totalCount: 0 }
    }
  } catch (error) {
    console.error(`Error fetching ${department} inventory:`, error)
    throw error
  }
}

// Fetch all item codes by department with pagination and search
export const fetchAllItemCodes = async ({ department, page = 1, limit = 10, search = "" }) => {
  console.log("🚀 ~ fetchAllItemCodes ~ department:", department)
  try {
    const response = await api.get(`/admin/inventory/itemcodes/${department}`, {
      params: {
        page,
        limit,
        search,
      },
    })
    console.log("🚀 ~ fetchAllItemCodes ~ response:", response.data.data)

    if (response && response.data && response.data.data) {
      return response.data.data
    } else {
      console.error("Unexpected API response format:", response)
      return []
    }
  } catch (error) {
    console.error(`Error fetching item codes for ${department}:`, error)
    throw error
  }
}

// Fetch inventory by ID
export const fetchInventoryById = async (department, id) => {
  try {
    const response = await api.get(`/admin/inventory/${department}/${id}`)

    console.log("Full API response:", response)

    if (!response.data) {
      throw new Error("No data received from server")
    }

    return response.data
  } catch (error) {
    console.error("Error fetching inventory item:", error)

    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch inventory item"

    throw new Error(errorMessage)
  }
}

// Update inventory item (comprehensive update)
export const updateInventoryItem = async (department, id, formData) => {
  try {
    const response = await api.put(`/admin/inventory/${department}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Full API response:", response)

    if (!response.data) {
      throw new Error("No data received from server")
    }

    return response.data
  } catch (error) {
    console.error("Error updating inventory item:", error)

    const errorMessage = error.response?.data?.message || error.message || "Failed to update inventory item"

    throw new Error(errorMessage)
  }
}

// Legacy function for minimum stock update (kept for backward compatibility)
export const fetchInventoryByIdandUpdate = async (department, id, updateData) => {
  try {
    const response = await api.put(`/admin/inventory/min/${department}/${id}`, updateData)

    console.log("Full API response:", response)

    if (!response.data) {
      throw new Error("No data received from server")
    }

    return response.data
  } catch (error) {
    console.error("Error updating inventory item:", error)

    const errorMessage = error.response?.data?.message || error.message || "Failed to update inventory item"

    throw new Error(errorMessage)
  }
}

// Create new inventory item
export const createInventory = async (formData) => {
  try {
    const response = await api.post(`/admin/inventory/store`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error creating inventory item:", error)
    throw error
  }
}

// Update inventory item (legacy)
export const updateInventory = async (department, id, data) => {
  try {
    const response = await api.put(`/admin/inventory/${department}/${id}`, data)
    return response.data
  } catch (error) {
    console.error("Error updating inventory item:", error)
    throw error
  }
}

// Delete inventory item
export const deleteInventory = async (department, id) => {
  try {
    const response = await api.delete(`/admin/inventory/${department}/${id}`)
    return response.data
  } catch (error) {
    console.error("Error deleting inventory item:", error)
    throw error
  }
}
