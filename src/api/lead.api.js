import { api } from "@/utils/axios";

// Create a new Lead
export const createLead = async (data) => {
  console.log("🚀 ~ createLead ~ data:", data)
  try {
    const response = await api.post("/admin/lead/create", data);
    if (response && response.status === 201) {
      return response.data.message;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to create lead");
  }
};

// Get all Leads (supports pagination)
export const getAllLeads = async (params = {}) => {
  try {
    const response = await api.get("/admin/lead", { params });
    if (response && response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch leads");
  }
};

// Get Lead by ID
export const getLeadById = async (id) => {
  try {
    const response = await api.get(`/admin/lead/${id}`);
    if (response && response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch lead");
  }
};

// Update Lead
export const updateLead = async (id, data) => {
  try {
    const response = await api.put(`/admin/lead/update/${id}`, data);
    if (response && response.status === 200) {
      return response.data.message;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to update lead");
  }
};

// Delete Lead
export const deleteLead = async (id) => {
  try {
    const response = await api.delete(`/admin/lead/delete/${id}`);
    if (response && response.status === 200) {
      return response.data.message;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to delete lead");
  }
};

// Search Leads
export const searchLeads = async (params = {}) => {
  try {
    const response = await api.get("/admin/lead/search", { params });
    if (response && response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to search leads");
  }
};

// Get Last Created Lead
export const getLastLead = async () => {
  try {
    const response = await api.get("/admin/lead/last");
    if (response && response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch last lead");
  }
};

// Fetch lead dashboard summary
export const getLeadDashboardSummary = async () => {
  try {
    const response = await api.get('/admin/lead/dashboard/summary');
    if (response && response.status === 200) {
      return response.data;
    }
    throw new Error('Failed to fetch lead dashboard summary');
  } catch (error) {
    throw new Error(error);
  }
};
