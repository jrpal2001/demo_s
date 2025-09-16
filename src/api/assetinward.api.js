import { api } from '@/utils/axios';

// Create Asset Inward (POST)
export const storeAssetInward = async (formData) => {
  try {
    const response = await api.post('/admin/assetinward/create', { data: formData });
    return response.data;
  } catch (error) {
    console.error('Error storing asset inward:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Fetch All Asset Inwards (GET)
export const fetchAllAssetInwards = async (page = 0, limit = 5, search = '') => {
  try {
    const response = await api.get('/admin/assetinward/all', {
      params: {
        page,
        limit,
        search,
      },
    });

    if (response && response.status === 200) {
      return response.data;
    }

    return {
      data: [],
      totalCount: 0,
      page,
      limit,
      totalPages: 0,
    };
  } catch (error) {
    console.error('Error fetching asset inwards:', error);
    return {
      data: [],
      totalCount: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
};

// Fetch Asset Inward by ID (GET)
export const fetchAssetInwardById = async (id) => {
  try {
    const response = await api.get(`/admin/assetinward/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching asset inward by ID:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};
