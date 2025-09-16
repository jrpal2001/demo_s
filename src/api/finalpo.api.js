import { api } from '@/utils/axios';

export const createFinalPO = async (data) => {
  const response = await api.post('/admin/finalpo', data);
  return response.data;
};

export const getAllFinalPO = async () => {
  const response = await api.get('/admin/finalpo');
  return response.data;
};

export const getFinalPOById = async (id) => {
  const response = await api.get(`/admin/finalpo/${id}`);
  return response.data;
};

export const updateFinalPO = async (id, data) => {
  const response = await api.put(`/admin/finalpo/${id}`, data);
  return response.data;
};

export const deleteFinalPO = async (id) => {
  const response = await api.delete(`/admin/finalpo/${id}`);
  return response.data;
};

export const uploadPoFile = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/admin/finalpo/${id}/upload-po-file`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}; 