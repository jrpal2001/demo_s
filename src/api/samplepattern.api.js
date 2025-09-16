import { api } from "@/utils/axios";

// Create a new Sample Pattern
export const createSamplePattern = async (data) => {
  try {
    const response = await api.post("/admin/samplepattern/create", data);
    console.log("🚀 ~ createSamplePattern ~ response:", response)
    if (response && response.status === 201) {
      return response.data.message;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to create sample pattern");
  }
};

// Get all Sample Patterns (with optional search and pagination)
export const getAllSamplePatterns = async (params = {}) => {
  try {
    const response = await api.get("/admin/samplepattern", { params });
    if (response && response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch sample patterns");
  }
};

// Get a Sample Pattern by ID
export const getSamplePatternById = async (id) => {
  try {
    const response = await api.get(`/admin/samplepattern/${id}`);
    if (response && response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch sample pattern");
  }
};

// Update a Sample Pattern
export const updateSamplePattern = async (id, data) => {
  try {
    const response = await api.put(`/admin/samplepattern/update/${id}`, data);
    if (response && response.status === 200) {
      return response.data.message;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to update sample pattern");
  }
};

// Delete a Sample Pattern
export const deleteSamplePattern = async (id) => {
  try {
    const response = await api.delete(`/admin/samplepattern/delete/${id}`);
    if (response && response.status === 200) {
      return response.data.message;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to delete sample pattern");
  }
};

// Optional: Search Sample Patterns
export const searchSamplePatterns = async (queryParams) => {
  try {
    const response = await api.get("/admin/samplepattern/search", { params: queryParams });
    if (response && response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to search sample patterns");
  }
};
