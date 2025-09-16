import { api } from "@/utils/axios";

// Create a new Quotation
export const createQuotation = async (data) => {
  try {
    const response = await api.post("/admin/quotation/create", data);
    if (response && response.status === 201) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to create quotation");
  }
};

// Get all Quotations (with optional search and pagination)
export const getAllQuotations = async (params = {}) => {
  try {
    const response = await api.get("/admin/quotation", { params });
    if (response && response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch quotations");
  }
};

// Get a Quotation by ID
export const getQuotationById = async (id) => {
  try {
    const response = await api.get(`/admin/quotation/${id}`);
    if (response && response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch quotation");
  }
};

// Update a Quotation
export const updateQuotation = async (id, data) => {
  try {
    const response = await api.put(`/admin/quotation/update/${id}`, data);
    if (response && response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to update quotation");
  }
};

// Delete a Quotation
export const deleteQuotation = async (id) => {
  try {
    const response = await api.delete(`/admin/quotation/delete/${id}`);
    if (response && response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to delete quotation");
  }
}; 

// Get the last quotation number
export const getLastQuotationNumber = async () => {
  try {
    const response = await api.get("/admin/quotation", { 
      params: { 
        page: 1, 
        limit: 1,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      } 
    });
    
    if (response && response.status === 200 && response.data.data && response.data.data.data && response.data.data.data.length > 0) {
      const lastQtnNo = response.data.data.data[0].qtnNo;
      return lastQtnNo;
    }
    return null;
  } catch (error) {
    console.error('Error fetching last quotation number:', error);
    return null;
  }
}; 

// Fetch quotation dashboard summary
export const getQuotationDashboardSummary = async () => {
  try {
    const response = await api.get('/admin/quotation/dashboard/summary');
    if (response && response.status === 200) {
      return response.data;
    }
    throw new Error('Failed to fetch quotation dashboard summary');
  } catch (error) {
    throw new Error(error);
  }
}; 