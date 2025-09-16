import { api } from '@/utils/axios';


export const createFinalPI = async (data) => {
  try {
    const response = await api.post('/admin/finalpi', data);
    return response.data;
  } catch (err) {
    // Normalize backend error message for callers
    const message = err?.response?.data?.message || err?.message || 'Failed to create Final PI';
    const details = err?.response?.data?.errors || null;
    const error = new Error(message);
    if (details) error.details = details;
    throw error;
  }
};

export const getAllFinalPI = async () => {
  const response = await api.get('/admin/finalpi');
  return response.data;
};

export const getFinalPIById = async (id) => {
  const response = await api.get(`/admin/finalpi/${id}`);
  return response.data;
};

export const updateFinalPI = async (id, data) => {
  const response = await api.put(`/admin/finalpi/${id}`, data);
  return response.data;
};

export const deleteFinalPI = async (id) => {
  const response = await api.delete(`/admin/finalpi/${id}`);
  return response.data;
}; 