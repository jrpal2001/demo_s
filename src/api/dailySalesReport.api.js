import { api } from '../utils/axios';

// Get all daily sales reports (with pagination)
export const getAllDailySalesReports = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('admin/dailysalesreport', {
      params: { page, limit },
    });
    console.log("🚀 ~ getAllDailySalesReports ~ response:", response.data)
    return response.data.data;
  } catch (error) {
    console.error("Error fetching daily sales reports:", error);
    return {
      success: false,
      message: error?.response?.data?.error || "Failed to fetch daily sales reports",
      status: error?.response?.status || 500,
    };
  }
};

export const getDailySalesReportById = (id) => api.get(`admin/dailysalesreport/${id}`);
export const createDailySalesReport = (data) => api.post('admin/dailysalesreport', data);
export const updateDailySalesReport = (id, data) => api.put(`admin/dailysalesreport/${id}`, data);
export const deleteDailySalesReport = (id) => api.delete(`admin/dailysalesreport/${id}`);

export const getSalesByExecutiveId = async (salesExecutiveId) => {
  try {
    const response = await api.get(`/admin/dailysalesreport/executive/${salesExecutiveId}`);
    return response;
  } catch (error) {
    console.error("Error fetching sales by executive ID:", error);

    // You can return a more structured error object if needed
    return {
      success: false,
      message: error?.response?.data?.error || "Failed to fetch sales data",
      status: error?.response?.status || 500,
    };
  }
};

export const getSalesSummary = async ({ type, year, month, quarter }) => {
  try {
    const response = await api.get('/admin/dailysalesreport/sales/summary', {
      params: {
        type,
        year,
        month,
        quarter,
      },
    });
    console.log("🚀 ~ getSalesSummary ~ response.data:", response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching sales summary:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.error || 'Failed to fetch sales summary');
  }
};