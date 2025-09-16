import { api } from '../utils/axios';

export const createEmployeePerformance = async (data) => {
  try {
    const response = await api.post('/admin/employee-performance', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to create employee performance');
  }
};

export const getAllEmployeePerformance = async (params = {}) => {
  try {
    const response = await api.get('/admin/employee-performance', { params });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch employee performance records');
  }
};
    
export const getEmployeePerformanceById = async (id) => {
  try {
    const response = await api.get(`/admin/employee-performance/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch employee performance');
  }
};

export const updateEmployeePerformance = async (id, data) => {
  try {
    const response = await api.put(`/admin/employee-performance/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to update employee performance');
  }
};

export const deleteEmployeePerformance = async (id) => {
  try {
    const response = await api.delete(`/admin/employee-performance/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to delete employee performance');
  }
}; 