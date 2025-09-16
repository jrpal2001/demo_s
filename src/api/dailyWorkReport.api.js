import { api } from '../utils/axios';

export const createDailyWorkReport = async (data) => {
  try {
    const response = await api.post('/admin/daily-work-report', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to create daily work report');
  }
};

export const getAllDailyWorkReports = async (params = {}) => {
  try {
    const response = await api.get('/admin/daily-work-report', { params });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch daily work reports');
  }
};

export const getDailyWorkReportById = async (id) => {
  try {
    const response = await api.get(`/admin/daily-work-report/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch daily work report');
  }
};

export const updateDailyWorkReport = async (id, data) => {
  try {
    const response = await api.put(`/admin/daily-work-report/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to update daily work report');
  }
};

export const deleteDailyWorkReport = async (id) => {
  try {
    const response = await api.delete(`/admin/daily-work-report/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to delete daily work report');
  }
}; 