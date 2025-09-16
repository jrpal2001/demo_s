import { api } from "@/utils/axios"

// Create a new Sample Job Card
export const createSampleJobCard = async (data) => {
  console.log("🚀 ~ createSampleJobCard ~ data:", data)
  try {
    const response = await api.post("/admin/sample-job-card/create", data)
    if (response && response.status === 201) {
      return response.data.message
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to create sample job card")
  }
}

// Get all Sample Job Cards (supports pagination)
export const getAllSampleJobCards = async (params = {}) => {
  try {
    const response = await api.get("/admin/sample-job-card", { params })
    if (response && response.status === 200) {
      return response.data.data
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch sample job cards")
  }
}

// Get Sample Job Card by ID
export const getSampleJobCardById = async (id) => {
  try {
    const response = await api.get(`/admin/sample-job-card/${id}`)
    if (response && response.status === 200) {
      return response.data.data
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch sample job card")
  }
}

// Update Sample Job Card
export const updateSampleJobCard = async (id, data) => {
  try {
    const response = await api.put(`/admin/sample-job-card/update/${id}`, data)
    if (response && response.status === 200) {
      return response.data.message
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to update sample job card")
  }
}

// Delete Sample Job Card
export const deleteSampleJobCard = async (id) => {
  try {
    const response = await api.delete(`/admin/sample-job-card/delete/${id}`)
    if (response && response.status === 200) {
      return response.data.message
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to delete sample job card")
  }
}

// Search Sample Job Cards
export const searchSampleJobCards = async (params = {}) => {
  try {
    const response = await api.get("/admin/sample-job-card/search", { params })
    if (response && response.status === 200) {
      return response.data.data
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to search sample job cards")
  }
}

// Get Last Created Sample Job Card
export const getLastSampleJobCard = async () => {
  try {
    const response = await api.get("/admin/sample-job-card/last")
    if (response && response.status === 200) {
      return response.data.data
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch last sample job card")
  }
}
