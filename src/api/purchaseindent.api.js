import { api } from '@/utils/axios';

export const storePurchaseIndent = async (formData) => {
  try {
    const response = await api.post('/admin/purchaseindent/create', formData);
    if (response && response.status == 201) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchPurchaseIndent = async (page = 0, limit = 5) => {
  try {
    const response = await api.get('/admin/purchaseindent', {
      params: {
        page: page,
        limit: limit,
      },
    });

    if (response && response.status === 200) {
      return response?.data?.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Error fetching purchase indent:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const fetchPurchaseIndentById = async (id) => {
  try {
    const response = await api.get(`/admin/purchaseindent/${id}`);
    if (response && response.status == 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updatePurchaseIndent = async (id, data) => {
  try {
    // Clean the data before sending
    const cleanData = {
      ...data,
      items: data.items?.map((item) => ({
        code: item.code,
        description: item.description,
        quantity: Number(item.quantity),
        uom: item.uom,
        // Only include _id if it exists
        ...(item._id && { _id: item._id }),
      })),
    }

    console.log("Sending clean data:", cleanData)

    const response = await api.put(`/admin/purchaseindent/update/${id}`, cleanData, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response && response.status === 200) {
      return response?.data?.data
    }
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message)
    throw error
  }
}

export const deletePurchaseIndent = async (id) => {
  try {
    const response = await api.delete(`/admin/purchaseindent/delete/${id}`);
    if (response && response.status == 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const searchPurchaseIndent = async (searchParams = '') => {
  console.log('🚀 ~ searchPurchaseIndent ~ searchParams:', searchParams);
  try {
    const params = {
      limit: 10,
    };

    if (searchParams.trim()) {
      params.searchText = searchParams;
    }

    const response = await api.get(`/admin/purchaseindent/search`, { params });
    console.log('🚀 ~ searchPurchaseIndent ~ response:', response);
    if (response && response.status === 200) {
      return response?.data;
    }
  } catch (error) {
    console.log('🚀 ~ searchPurchaseIndent ~ error:', error);
    throw new Error(error?.response?.data?.message || error.message || 'Something went wrong');
  }
};
