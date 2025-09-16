import { api } from '../utils/axios';

const BASE_URL = '/admin/fabric-qc-report';

export const fetchFabricQcReportsData = async (page = 0, limit = 5) => {
  try {
    const response = await api.get(BASE_URL, {
      params: { page, limit }
    });
    if (response && response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllFabricQcReports = () => api.get(BASE_URL);
export const getFabricQcReportById = (id) => api.get(`${BASE_URL}/${id}`);
export const createFabricQcReport = (data) => api.post(BASE_URL, data);
export const updateFabricQcReport = (id, data) => api.put(`${BASE_URL}/${id}`, data);
export const deleteFabricQcReport = (id) => api.delete(`${BASE_URL}/${id}`); 