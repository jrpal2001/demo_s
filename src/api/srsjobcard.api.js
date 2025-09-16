import { api } from '@/utils/axios';

export const createSrsJobCard = async (formData) => {
  console.log('🚀 ~ createSrsJobCard ~ formData:', formData);
  try {
    const response = await api.post(`/admin/srs-jobcard/create`, formData);
    if (response) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updateSrsJobCard = async (id, formData) => {
  console.log('🚀 ~ updateSrsJobCard ~ formData:', formData);
  try {
    const response = await api.put(`/admin/srs-jobcard/${id}`, formData);
    if (response && response.status == 200) {
      return response?.data?.message;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteSrsJobCard = async (id) => {
  try {
    const response = await api.delete(`/admin/srs-jobcard/${id}`);
    if (response) {
      return response?.data?.message;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllSrsJobCards = async (page = 0, limit = 10, search = '', status = '') => {
  try {
    console.log(`Fetching SRS job cards with params:`, {
      page,
      limit,
      search,
      status,
    });

    const response = await api.get(`/admin/srs-jobcard/all`, {
      params: {
        page,
        limit,
        search,
        status,
      },
    });
    console.log("🚀 ~ getAllSrsJobCards ~ response:", response)

    return response.data;
  } catch (error) {
    console.error('Error fetching SRS job cards:', error);
    throw error;
  }
};

export const getSrsJobCardById = async (id) => {
  console.log('🚀 ~ getSrsJobCardById ~ id:', id);
  try {
    const response = await api.get(`/admin/srs-jobcard/${id}`);
    console.log("🚀 ~ getSrsJobCardById ~ response:", response)
    if (response && response.status === 200) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
};

export const getSrsJobCardStats = async () => {
  try {
    const response = await api.get('/admin/srs-jobcard/stats');
    if (response && response.status === 200) {
      return response.data;
    }
    throw new Error('Failed to fetch SRS job card statistics');
  } catch (error) {
    throw new Error(error);
  }
}; 