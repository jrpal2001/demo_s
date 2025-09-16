import { api } from "@/utils/axios"

// Create new Other Store Inventory item
export const createOtherStoreInventory = async (data) => {
  try {
    const response = await api.post(`/admin/otherstoreinventory/create`, data)
    return response.data
  } catch (error) {
    console.error("Error creating other store inventory item:", error)
    throw error
  }
}

// Get all Other Store Inventory items (with pagination + search + filters)
export const fetchAllOtherStoreInventory = async ({ page = 1, limit = 10, search = "" }) => {
  try {
    const response = await api.get(`/admin/otherstoreinventory`, {
      params: { page, limit, search },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching all other store inventory items:", error)
    throw error
  }
}

// Get all Other Store Item Codes (with pagination + search)
export const fetchAllOtherStoreItemCodes = async ({ page = 1, limit = 10, search = "", itemType = "" }) => {
  try {
    const response = await api.get(`/admin/otherstoreinventory/codes`, {
      params: { page, limit, search, itemType },
    })
    return response.data?.data || []
  } catch (error) {
    console.error("Error fetching other store item codes:", error)
    throw error
  }
}

// Get Low Stock Items
export const fetchLowStockOtherStoreItems = async ({ page = 1, limit = 10, itemType = "" }) => {
  try {
    const response = await api.get(`/admin/otherstoreinventory/low-stock`, {
      params: { page, limit, itemType },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching low stock other store items:", error)
    throw error
  }
}

// Get Other Store Inventory item by ID
export const fetchOtherStoreInventoryById = async (id) => {
  try {
    const response = await api.get(`/admin/otherstoreinventory/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching other store inventory by ID:", error)
    throw error
  }
}

// Update Minimum Required Stock
export const updateOtherStoreMinStock = async (id, MinreqStock) => {
  try {
    const response = await api.put(`/admin/otherstoreinventory/update-min/${id}`, {
      MinreqStock,
    })
    return response.data
  } catch (error) {
    console.error("Error updating other store min stock:", error)
    throw error
  }
}

// Update Status
export const updateOtherStoreStatus = async (id, status) => {
  try {
    const response = await api.put(`/admin/otherstoreinventory/update-status/${id}`, {
      status,
    })
    return response.data
  } catch (error) {
    console.error("Error updating other store status:", error)
    throw error
  }
}

// Get All by Item Type (with pagination + search)
export const fetchOtherStoreInventoryByType = async ({ itemType, page = 1, limit = 10, search = "" }) => {
  try {
    const response = await api.get(`/admin/otherstoreinventory/by-type/${itemType}`, {
      params: { page, limit, search },
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching other store inventory by type (${itemType}):`, error)
    throw error
  }
}

export const updateOtherStoreInventory = async (id, payload) => {
  try {
    const response = await api.put(`/admin/otherstoreinventory/update/${id}`, payload)
    return response.data
  } catch (error) {
    console.error("Error updating other store inventory:", error)
    throw error
  }
}
