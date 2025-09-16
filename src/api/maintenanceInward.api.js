import { api } from "@/utils/axios"

// Create new Maintenance Inward
export const createMaintenanceInward = async (data) => {
  try {
    const response = await api.post(`/admin/maintenanceinward/create`, { data })
    return response.data
  } catch (error) {
    console.error("Error creating maintenance inward:", error)
    throw error
  }
}

// Get all Maintenance Inwards (with pagination + search)
export const fetchAllMaintenanceInwards = async ({ page = 0, limit = 5, search = "" }) => {
  try {
    const response = await api.get(`/admin/maintenanceinward/all`, {
      params: { page, limit, search },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching maintenance inwards:", error)
    throw error
  }
}

// Get Maintenance Inward by ID
export const fetchMaintenanceInwardById = async (id) => {
  try {
    const response = await api.get(`/admin/maintenanceinward/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching maintenance inward by ID:", error)
    throw error
  }
}
