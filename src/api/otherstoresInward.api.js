import { api } from "@/utils/axios"

// Create new Other Store Inward
export const createOtherStoreInward = async (data) => {
  try {
    const response = await api.post(`/admin/otherstoreinward/create`, { data })
    return response.data
  } catch (error) {
    console.error("Error creating other store inward:", error)
    throw error
  }
}

// Get all Other Store Inwards (with pagination + search + filters)
export const fetchAllOtherStoreInwards = async ({ page = 0, limit = 5, search = "", itemType = "" }) => {
  try {
    const response = await api.get(`/admin/otherstoreinward/all`, {
      params: { page, limit, search, itemType },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching other store inwards:", error)
    throw error
  }
}

// Get Other Store Inward by ID
export const fetchOtherStoreInwardById = async (id) => {
  try {
    const response = await api.get(`/admin/otherstoreinward/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching other store inward by ID:", error)
    throw error
  }
}

// Get Other Store Inwards by Item Type
export const fetchOtherStoreInwardsByType = async ({ itemType, page = 0, limit = 10 }) => {
  try {
    const response = await api.get(`/admin/otherstoreinward/by-type/${itemType}`, {
      params: { page, limit },
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching other store inwards by type (${itemType}):`, error)
    throw error
  }
}
