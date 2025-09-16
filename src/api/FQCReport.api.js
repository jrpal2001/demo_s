import { api } from '../utils/axios';

// Create a new Final QC Report
export const createFinalQcReport = async (data) => {
  console.log("🚀 ~ createFinalQcReport ~ data:", data)
  try {
    const response = await api.post('/admin/final-qc-reports', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to create final QC report');
  }
};

// Get all Final QC Reports with optional query params (pagination, filters)
export const getAllFinalQcReports = async (params = {}) => {
  try {
    const response = await api.get('/admin/final-qc-reports', { params });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch final QC reports');
  }
};

// Get a single Final QC Report by ID
export const getFinalQcReportById = async (id) => {
  try {
    const response = await api.get(`/admin/final-qc-reports/${id}`);
    console.log("🚀 ~ getFinalQcReportById ~ response:", response)
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch final QC report');
  }
};

// Update a Final QC Report by ID
export const updateFinalQcReport = async (id, data) => {
  try {
    const response = await api.put(`/admin/final-qc-reports/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to update final QC report');
  }
};

// Delete a Final QC Report by ID
export const deleteFinalQcReport = async (id) => {
  try {
    const response = await api.delete(`/admin/final-qc-reports/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to delete final QC report');
  }
};
