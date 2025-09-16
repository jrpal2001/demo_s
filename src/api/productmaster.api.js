import { api } from '@/utils/axios';

export const storeProductMaster = async (formData) => {
  try {
    const response = await api.post('/admin/productmaster/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response && response.status == 201) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updateProductMaster = async (id, formData) => {
  try {
    const response = await api.put(`/admin/productmaster/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response && response.status == 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchProductMaster = async ({ page, limit, search = '' }) => {
  try {
    // Trim the search term to remove any leading/trailing whitespace
    const trimmedSearch = search ? search.trim() : '';
    console.log('🚀 ~ fetchProductMaster ~ params:', { page, limit, search: trimmedSearch });
    console.log('🚀 ~ fetchProductMaster ~ Making API call to /admin/productmaster');

    const response = await api.get('/admin/productmaster', {
      params: {
        page: page || 1,
        limit: limit || 5,
        search: trimmedSearch,
      },
    });

    console.log('🚀 ~ fetchProductMaster ~ API Response status:', response.status);
    console.log('🚀 ~ fetchProductMaster ~ API Response data:', response.data);

    if (response && response.status === 200) {
      console.log('🚀 ~ fetchProductMaster ~ Returning data:', response?.data?.data);
      return response?.data?.data;
    }
    console.log('🚀 ~ fetchProductMaster ~ No valid response, returning empty data');
    return { productMaster: [], dataCount: 0 };
  } catch (error) {
    console.error('🚀 ~ fetchProductMaster ~ Error details:', error);
    console.error('🚀 ~ fetchProductMaster ~ Error response:', error.response?.data);
    console.error('🚀 ~ fetchProductMaster ~ Error status:', error.response?.status);
    return { productMaster: [], dataCount: 0 };
  }
};

export const fetchProductMasterById = async (id) => {
  try {
    const response = await api.get(`/admin/productmaster/${id}`);
    if (response && response.status == 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchProductMasterBySku = async (sku) => {
  try {
    const response = await api.get(`/admin/productmaster/sku/${sku}`);
    if (response && response.status == 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};


export const deleteProductMaster = async (id) => {
  try {
    // Input validation
    if (!id) {
      throw new Error('Product ID is required');
    }

    console.log(`Sending delete request for product ID: ${id}`);

    // Make the delete request - ensure the endpoint matches exactly what your backend expects
    const response = await api.delete(`/admin/productmaster/delete/${id}`);

    // Log response for debugging
    console.log('Delete API response:', response);

    // Return the response data
    return response.data;
  } catch (error) {
    console.error('Delete API error:', error);

    // Create a more user-friendly error message
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to delete product';

    throw new Error(errorMessage);
  }
};

export const fetchAllProductMasterSkus = async ({ page = 1, limit = 5, search = '' }) => {
  console.log('🚀 ~ fetchAllProductMasterSkus ~ page:', page);
  console.log('🚀 ~ fetchAllProductMasterSkus ~ limit:', limit);
  console.log('🚀 ~ fetchAllProductMasterSkus ~ search:', search);
  try {
    const response = await api.get('/admin/productmaster/skus', {
      params: {
        page,
        limit,
        search,
      },
    });
    console.log("🚀 ~ fetchAllProductMasterSkus ~ response:", response)

    if (response && response.status === 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchProductImagesBySkuCode = async (skuCode) => {
  try {
    const response = await api.get(`/admin/productmaster/image/${skuCode}`);
    console.log("🚀 ~ fetchProductImagesBySkuCode ~ response:", response)
    if (response && response.status === 200) {
      return response.data.data; // This will be an array of image URLs
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch product images");
  }
};

export const fetchRecentProductMasters = async ({ page = 1, limit = 10, stylecategory = '', search = '' }) => {
  try {
    const response = await api.get('/admin/productmaster/recent', {
      params: {
        page,
        limit,
        stylecategory,
        search,
      },
    });
    console.log("🚀 ~ fetchRecentProductMasters ~ response:", response)
    if (response && response.status === 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchProducableBySku = async (skuCode) => {
  try {
    const response = await api.get(`/admin/productmaster/producable/${skuCode}`);
    if (response && response.status === 200) {
      return response.data.data; // { skuCode, producable }
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch producable quantity');
  }
};