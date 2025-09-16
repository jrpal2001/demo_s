import { api } from "@/utils/axios"

// Fetch Lots by Inventory ID and Item Type
export const fetchLotsByOtherStoreInventory = async (itemType, inventoryId, page = 0, pageSize = 10) => {
  try {
    const response = await api.get(`/admin/otherstorelot/${itemType}/${inventoryId}`, {
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
    console.error(`Error fetching other store lots for ${itemType}:`, error)
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

// Get all Other Store Lots (with pagination + search + filters)
export const fetchAllOtherStoreLots = async ({ page = 0, limit = 10, search = "", itemType = "", condition = "" }) => {
  try {
    const response = await api.get(`/admin/otherstorelot`, {
      params: { page, limit, search, itemType, condition },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching all other store lots:", error)
    throw error
  }
}

// Get Expiring Other Store Lots
export const fetchExpiringOtherStoreLots = async ({ days = 30, page = 0, limit = 10 }) => {
  try {
    const response = await api.get(`/admin/otherstorelot/expiring`, {
      params: { days, page, limit },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching expiring other store lots:", error)
    throw error
  }
}

// Get Other Store Lot by ID
export const fetchOtherStoreLotById = async (id) => {
  try {
    const response = await api.get(`/admin/otherstorelot/detail/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching other store lot by ID:", error)
    throw error
  }
}

// Update Other Store Lot Condition
export const updateOtherStoreLotCondition = async (id, condition) => {
  try {
    const response = await api.put(`/admin/otherstorelot/condition/${id}`, {
      condition,
    })
    return response.data
  } catch (error) {
    console.error("Error updating other store lot condition:", error)
    throw error
  }
}
