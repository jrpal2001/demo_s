import { api } from '@/utils/axios';

export const storeAssetPurchaseOrder = async (formData) => {
  try {
    const response = await api.post(`/admin/assetpurchaseorder/create`, formData);
    if (response && response.status === 201) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchAssetPurchaseOrders = async (page = 0, limit = 5) => {
  try {
    const response = await api.get(`/admin/assetpurchaseorder`, {
      params: {
        page,
        limit,
      },
    });
    if (response && response.status === 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updateAssetPurchaseOrderApproval = async (orderId, approvalData) => {
  try {
    const response = await api.patch(`/admin/assetpurchaseorder/${orderId}/approval`, approvalData);
    if (response && response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchAssetPurchaseOrderById = async (id) => {
  try {
    const response = await api.get(`/admin/assetpurchaseorder/${id}`);
    if (response && response.status === 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updateAssetPurchaseOrder = async (id, formData) => {
  try {
    const response = await api.put(`/admin/assetpurchaseorder/update/${id}`, formData);
    if (response && response.status === 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteAssetPurchaseOrder = async (id) => {
  try {
    const response = await api.delete(`/admin/assetpurchaseorder/delete/${id}`);
    if (response && response.status === 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const searchAssetPurchaseOrders = async (searchText) => {
  console.log("🚀 ~ searchAssetPurchaseOrders ~ searchText:", searchText)
  try {
    const response = await api.get(`/admin/assetpurchaseorder/search`, {
      params: {
        search: searchText,
        limit: 10,
      },
    });
    console.log("🚀 ~ searchAssetPurchaseOrders ~ response:", response)
    if (response && response.status === 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};
