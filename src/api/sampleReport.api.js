import { api } from '../utils/axios';

// Get all sample reports (with pagination)
export const getAllSampleReports = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('admin/samplereport', {
      params: { page, limit },
    });
    console.log("🚀 ~ getAllSampleReports ~ response:", response.data)
    return response.data.data;
  } catch (error) {
    console.error("Error fetching sample reports:", error);
    return {
      success: false,
      message: error?.response?.data?.error || "Failed to fetch sample reports",
      status: error?.response?.status || 500,
    };
  }
};

export const getAllSampleReportsNoPagination = async () => {
  try {
    const response = await api.get('admin/samplereport/all', {
      params: { pagination: false },
    });
    console.log("🚀 ~ getAllSampleReportsNoPagination ~ response:", response.data);
    return response.data.data.samples;
  } catch (error) {
    console.error("Error fetching all sample reports:", error);
    return {
      success: false,
      message: error?.response?.data?.error || "Failed to fetch sample reports",
      status: error?.response?.status || 500,
    };
  }
};

export const getSampleReportById = (id) => api.get(`admin/samplereport/${id}`);
export const createSampleReport = (data) => api.post('admin/samplereport', data);
export const updateSampleReport = (id, data) => api.put(`admin/samplereport/${id}`, data);
export const deleteSampleReport = (id) => api.delete(`admin/samplereport/${id}`);
