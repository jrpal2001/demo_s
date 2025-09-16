import { api } from "@/utils/axios"

// Fetch all outward records for a department
export const fetchAllNewOutwards = async (department) => {
  console.log("🚀 ~ fetchAllNewOutwards ~ department:", department)
  try {
    const response = await api.get(`/admin/asset-outward/${department}`)
    console.log("🚀 ~ fetchAllNewOutwards ~ response:", response)
    if (response && response.data && response.data.data) {
      return response.data.data
    } else {
      console.error("Unexpected API response format:", response)
      return []
    }
  } catch (error) {
    console.error(`Error fetching outward records for ${department}:`, error)
    throw error
  }
}

// Fetch a single outward record by ID
export const fetchNewOutwardById = async (department, id) => {
  console.log("🚀 ~ fetchNewOutwardById ~ department:", department)
  try {
    const response = await api.get(`/admin/asset-outward/${department}/${id}`)

    if (!response.data) {
      throw new Error("No data received from server")
    }
    return response.data
  } catch (error) {
    console.error("Error fetching outward record:", error)
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch outward record"
    throw new Error(errorMessage)
  }
}

// Get next outward number for a department
export const fetchNextOutwardNumber = async (department) => {
  console.log("🚀 ~ fetchNextOutwardNumber ~ department:", department)
  try {
    const response = await api.get(`/admin/asset-outward/${department}/next-number`)

    if (!response.data) {
      throw new Error("No data received from server")
    }
    return response.data.data.nextOutwardNumber
  } catch (error) {
    console.error("Error fetching next outward number:", error)
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch next outward number"
    throw new Error(errorMessage)
  }
}

// Create a new outward record
export const createNewOutward = async (department, outwardData) => {
  try {
    const response = await api.post(`/admin/asset-outward/${department}`, outwardData)

    if (!response.data) {
      throw new Error("No data received from server")
    }
    return response
  } catch (error) {
    console.error("Error creating outward record:", error)
    const errorMessage = error.response?.data?.message || error.message || "Failed to create outward record"
    throw new Error(errorMessage)
  }
}

// Update issued status and issuedQuantity for outward record
export const updateNewOutwardIssuedStatus = async (department, id, updateData) => {
  try {
    const response = await api.put(`/admin/asset-outward/${department}/${id}`, updateData)

    if (!response.data) {
      throw new Error("No data received from server")
    }
    return response
  } catch (error) {
    console.error("Error updating outward record:", error)
    const errorMessage = error.response?.data?.message || error.message || "Failed to update outward record"
    throw new Error(errorMessage)
  }
}

// Delete an outward record
export const deleteNewOutward = async (department, id) => {
  try {
    const response = await api.delete(`/admin/asset-outward/${department}/${id}`)

    if (!response.data) {
      throw new Error("No data received from server")
    }
    return response.data
  } catch (error) {
    console.error("Error deleting outward record:", error)
    const errorMessage = error.response?.data?.message || error.message || "Failed to delete outward record"
    throw new Error(errorMessage)
  }
}
