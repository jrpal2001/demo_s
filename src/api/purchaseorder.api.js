import { api } from '@/utils/axios';

export const storePurchaseOrder = async (formData) => {
  try {
    const response = await api.post(`/admin/purchaseorder/create`, formData);
    if (response && response.status == 201) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchPurchaseOrders = async (page = 0, limit = 5) => {
  try {
    const response = await api.get(`/admin/purchaseorder`, {
      params: {
        page: page,
        limit: limit,
      },
    });
    if (response && response.status == 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

//update purchase order
export const updatePurchaseOrderApproval = async (orderId, approvalData) => {
  console.log("🚀 ~ updatePurchaseOrderApproval ~ approvalData:", approvalData)
  try {
    const response = await api.patch(`/admin/purchaseorder/${orderId}/approval`, approvalData);
    console.log("🚀 ~ updatePurchaseOrderApproval ~ response:", response)
    if (response && response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchPurchaseOrderById = async (id) => {
  try {
    const response = await api.get(`/admin/purchaseorder/${id}`);
    if (response && response.status == 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updatePurchaseOrder = async (id, formData) => {
  try {
    const response = await api.put(`/admin/purchaseorder/update/${id}`, formData);
    if (response && response.status == 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const deletePurchaseOrder = async (id) => {
  try {
    const response = await api.delete(`/admin/purchaseorder/delete/${id}`);
    if (response && response.status == 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const searchPurchaseOrders = async (searchText) => {
  try {
    const response = await api.get(`/admin/purchaseorder/search`, {
      params: {
        search: searchText,
        limit: 10,
      },
    });
    if (response && response.status == 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updatePurchaseOrderMainStatus = async (id, statusData) => {
  try {
    const response = await api.patch(`/admin/purchaseorder/${id}/status`, statusData);
    if (response && response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

// Fetch purchase orders dashboard summary
export const getPurchaseOrdersDashboardSummary = async () => {
  try {
    const response = await api.get('/admin/purchaseorder/dashboard/summary');
    if (response && response.status === 200) {
      return response.data;
    }
    throw new Error('Failed to fetch purchase orders dashboard summary');
  } catch (error) {
    throw new Error(error);
  }
};

