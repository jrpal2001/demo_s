import { api } from '@/utils/axios';

// Store Material Inward (POST)
export const storeInwardMaterial = async (itemCode, formData) => {
  console.log('🚀 ~ storeInwardMaterial ~ itemCode:', itemCode);
  console.log('🚀 ~ storeInwardMaterial ~ formData:', formData);
  try {
    const response = await api.post(`/admin/inwardmaterial/create`, { itemCode, data: formData });
    return response.data;
  } catch (error) {
    throw new Error(error.message);a
  }
};

// Fetch All Material Inwards for a Specific Department (GET)
export const fetchAllMaterialInwards = async (department, page = 0, limit = 5, search = '') => {
  console.log('🚀 ~ fetchAllMaterialInwards ~ department:', department);
  console.log('🚀 ~ fetchAllMaterialInwards ~ search:', search);
  try {
    const response = await api.get(`/admin/inwardmaterial/all/${department}`, {
      params: {
        page,
        limit,
        search,
      },
    });
    console.log('API Response:', response.data);
    if (response && response.status === 200) {
      // Return the response as is, without modifying the structure
      return response.data;
    }
    return { data: { data: [], totalCount: 0 } };
  } catch (error) {
    console.error('Error in fetchAllMaterialInwards:', error);
    return { data: { data: [], totalCount: 0 } };
  }
};

// Fetch Material Inward by ID (GET)
export const fetchMaterialInwardById = async (id, department) => {
  try {
    const response = await api.get(`/admin/inwardmaterial/${department}/${id}`);
    console.log('🚀 ~ fetchMaterialInwardById ~ response:', response);
    if (response) {
      return response.data;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
