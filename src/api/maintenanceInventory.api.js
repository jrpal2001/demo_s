import { api } from "@/utils/axios"

// Create new Maintenance Inventory item
export const createMaintenanceInventory = async (data) => {
  try {
    const response = await api.post(`/admin/maintenanceinventory/create`, data)
    return response.data
  } catch (error) {
    console.error("Error creating maintenance inventory item:", error)
    throw error
  }
}

// Get all Maintenance Inventory items
export const fetchAllMaintenanceInventory = async () => {
  try {
    const response = await api.get(`/admin/maintenanceinventory`)
    return response.data
  } catch (error) {
    console.error("Error fetching all maintenance inventory items:", error)
    throw error
  }
}

// Get all Maintenance Codes (with pagination + search)
export const fetchAllMaintenanceCodes = async ({ page = 1, limit = 10, search = "" }) => {
  try {
    const response = await api.get(`/admin/maintenanceinventory/codes`, {
      params: { page, limit, search },
    })
    console.log("🚀 ~ fetchAllMaintenanceCodes ~ response:", response)
    return response.data?.data || []
  } catch (error) {
    console.error("Error fetching maintenance codes:", error)
    throw error
  }
}

// Get Maintenance Inventory item by ID
export const fetchMaintenanceInventoryById = async (id) => {
  try {
    const response = await api.get(`/admin/maintenanceinventory/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching maintenance inventory by ID:", error)
    throw error
  }
}

// Update Minimum Required Stock
export const updateMaintenanceMinStock = async (id, MinreqStock) => {
  try {
    const response = await api.put(`/admin/maintenanceinventory/update-min/${id}`, {
      MinreqStock,
    })
    return response.data
  } catch (error) {
    console.error("Error updating maintenance min stock:", error)
    throw error
  }
}

// Update Status
export const updateMaintenanceStatus = async (id, status) => {
  try {
    const response = await api.put(`/admin/maintenanceinventory/update-status/${id}`, {
      status,
    })
    return response.data
  } catch (error) {
    console.error("Error updating maintenance status:", error)
    throw error
  }
}

// Get All by Maintenance Type (with pagination + search)
export const fetchMaintenanceInventoryByType = async ({ maintenanceType, page = 1, limit = 10, search = "" }) => {
  try {
    const response = await api.get(`/admin/maintenanceinventory/by-type/${maintenanceType}`, {
      params: { page, limit, search },
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching maintenance inventory by type (${maintenanceType}):`, error)
    throw error
  }
}

export const updateMaintenanceInventory = async (id, payload) => {
  try {
    const response = await api.put(`/admin/maintenanceinventory/update/${id}`, payload)
    return response.data
  } catch (error) {
    console.error("Error updating maintenance inventory:", error)
    throw error
  }
}
