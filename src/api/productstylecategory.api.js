import { api } from '@/utils/axios';

export const getAllProductStyleCategories = async (params = {}) => {
  const response = await api.get('/admin/productstylecategory', { params });
  console.log("🚀 ~ getAllProductStyleCategories ~ response:", response)
  if (response && response.status === 200) {
    return response.data.data;
  }
  throw new Error('Failed to fetch product style categories');
};

export const createProductStyleCategory = async (data) => {
  const response = await api.post('/admin/productstylecategory/create', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  if (response && response.status === 201) {
    return response.data.data;
  }
  throw new Error('Failed to create product style category');
};

export const updateProductStyleCategory = async (id, data) => {
  const response = await api.put(`/admin/productstylecategory/update/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log("🚀 ~ updateProductStyleCategory ~ response:", response)
  if (response && response.status === 200) {
    return response.data.data;
  }
  throw new Error('Failed to update product style category');
};

export const deleteProductStyleCategory = async (id) => {
  const response = await api.delete(`/admin/productstylecategory/delete/${id}`);
  if (response && response.status === 200) {
    return response.data.data;
  }
  throw new Error('Failed to delete product style category');
};

export const getProductStyleCategoryById = async (id) => {
  const response = await api.get(`/admin/productstylecategory/${id}`);
  if (response && response.status === 200) {
    return response.data.data;
  }
  throw new Error('Failed to fetch product style category');
};

// GET ALL UNIQUE STYLE CATEGORIES (optionally filtered by productCategory)
export const getAllStyleCategories = async (productCategory) => {
  const params = productCategory ? { productCategory } : {};
  const response = await api.get('/admin/productstylecategory/style-categories/all', { params });
  if (response && response.status === 200) {
    return response.data.data;
  }
  throw new Error('Failed to fetch style categories');
}; 