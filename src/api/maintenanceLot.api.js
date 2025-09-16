import { api } from "@/utils/axios"

// Fetch Lots by Inventory ID and Maintenance Type
export const fetchLotsByMaintenanceInventory = async (maintenanceType, inventoryId, page = 0, pageSize = 10) => {
  try {
    const response = await api.get(`/admin/maintenancelot/${maintenanceType}/${inventoryId}`, {
      params: { page, limit: pageSize },
    })

    return {
      lots: response.data?.data?.lots || [],
      page: response.data?.data?.page || 0,
      limit: response.data?.data?.limit || pageSize,
      totalCount: response.data?.data?.totalCount || 0,
      totalPages: response.data?.data?.totalPages || 0,
    }
  } catch (error) {
    console.error(`Error fetching maintenance lots for ${maintenanceType}:`, error)
    return {
      lots: [],
      page,
      limit: pageSize,
      totalCount: 0,
      totalPages: 0,
      error: error?.response?.data?.message || error.message,
    }
  }
}

// Get all Maintenance Lots (with pagination + search + filters)
export const fetchAllMaintenanceLots = async ({ page = 0, limit = 10, search = "", status = "" }) => {
  try {
    const response = await api.get(`/admin/maintenancelot`, {
      params: { page, limit, search, status },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching all maintenance lots:", error)
    throw error
  }
}

// Get Maintenance Lot by ID
export const fetchMaintenanceLotById = async (id) => {
  try {
    const response = await api.get(`/admin/maintenancelot/detail/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching maintenance lot by ID:", error)
    throw error
  }
}

// Update Maintenance Lot Status
export const updateMaintenanceLotStatus = async (id, status) => {
  try {
    const response = await api.put(`/admin/maintenancelot/status/${id}`, {
      status,
    })
    return response.data
  } catch (error) {
    console.error("Error updating maintenance lot status:", error)
    throw error
  }
}
