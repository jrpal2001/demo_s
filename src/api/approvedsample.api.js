import { api } from "@/utils/axios";

// Create a new Approved Sample
export const createApprovedSample = async (data) => {
  try {
    const response = await api.post("/admin/approvedsample/create", data);
    if (response && response.status === 201) {
      return response.data.message;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to create approved sample");
  }
};

// Get all Approved Samples (supports pagination/search)
export const getAllApprovedSamples = async (params = {}) => {
  try {
    const response = await api.get("/admin/approvedsample", { params });
    if (response && response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch approved samples");
  }
};

// Get Approved Sample by ID
export const getApprovedSampleById = async (id) => {
  try {
    const response = await api.get(`/admin/approvedsample/${id}`);
    if (response && response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch approved sample");
  }
};

// Update Approved Sample
export const updateApprovedSample = async (id, data) => {
  try {
    const response = await api.put(`/admin/approvedsample/update/${id}`, data);
    if (response && response.status === 200) {
      return response.data.message;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to update approved sample");
  }
};

// Delete Approved Sample
export const deleteApprovedSample = async (id) => {
  try {
    const response = await api.delete(`/admin/approvedsample/delete/${id}`);
    if (response && response.status === 200) {
      return response.data.message;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to delete approved sample");
  }
};

// Search Approved Samples (if separate from `/` with query params)
export const searchApprovedSamples = async (queryParams = {}) => {
  try {
    const response = await api.get("/admin/approvedsample/search", { params: queryParams });
    if (response && response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to search approved samples");
  }
};

// Get all Design IDs (with optional search & limit)
export const getAllDesignIds = async (params = {}) => {
  console.log("🚀 ~ getAllDesignIds ~ params:", params)
  try {
    const response = await api.get("/admin/approvedsample/design-ids", { params });
    console.log("🚀 ~ getAllDesignIds ~ response:", response)
    if (response && response.status === 200) {
      return response.data.data; // contains designIds, total, page, limit
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch design IDs");
  }
};
