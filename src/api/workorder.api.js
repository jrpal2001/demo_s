import { api } from '@/utils/axios';

export const storeWorkOrderData = async (formData) => {
  console.log('🚀 ~ storeWorkOrderData ~ formData:', formData);
  try {
    const response = await api.post(`/admin/workorder/create`, formData);
    if (response) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updateWorkOrderData = async (id, formData) => {
  console.log('🚀 ~ updateWorkOrderData ~ formData:', formData);
  try {
    const response = await api.patch(`/admin/workorder/update/${id}`, formData);
    if (response && response.status == 200) {
      return response?.data?.message;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteWorkOrderData = async (id) => {
  try {
    const response = await api.delete(`/admin/workorder/delete/${id}`);
    if (response) {
      return response?.data?.message;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getWorkOrdersByJobCardId = async (
  jobCardId,
  page = 0,
  limit = 5,
  workOrderIdSearch = '',
) => {
  try {
    console.log(`Fetching work orders for job card ${jobCardId} with params:`, {
      page,
      limit,
      workOrderIdSearch,
    });

    const response = await api.get(`/admin/workorder/by-jobcard/${jobCardId}`, {
      params: {
        page,
        limit,
        workOrderIdSearch,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching work orders:', error);
    throw error;
  }
};

export const getLastCreatedWorkOrder = async (jobcardId) => {
  console.log("🚀 ~ getLastCreatedWorkOrder ~ jobcardId:", jobcardId)
  try {
    const response = await api.get(`/admin/workorder/last/${jobcardId}`);
    console.log("🚀 ~ getLastCreatedWorkOrder ~ response:", response)
    if (response && response.status === 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchWorkflowForWorkorderId = async (workorderId) => {
  console.log('🚀 ~ fetchWorkflowForWorkorderId ~ workorderId:', workorderId);
  try {
    const response = await api.get(`/admin/workflow/workorder/${workorderId}`);
    if (response) {
      return response.data; // Assuming the response contains workflow data
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const getWorkOrderById = async (workOrderId) => {
  console.log('🚀 ~ getWorkOrderById ~ workOrderId:', workOrderId);
  try {
    const response = await api.get(`/admin/workorder/${workOrderId}`);
    if (response && response.status === 200) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
};

export const closeWorkOrder = async (id) => {
  const response = await api.patch(`/admin/workorder/close/${id}`);
  if (response && response.status === 200) {
    return response.data;
  }
  throw new Error('Failed to close work order');
};

// Fetch work orders dashboard summary
export const getWorkOrdersDashboardSummary = async () => {
  try {
    const response = await api.get('/admin/workorder/dashboard/summary');
    if (response && response.status === 200) {
      return response.data;
    }
    throw new Error('Failed to fetch work orders dashboard summary');
  } catch (error) {
    throw new Error(error);
  }
};

// Switch the status of a work order
export const switchWorkOrderStatus = async (id, status) => {
  try {
    const response = await api.patch(`/admin/workorder/switch-status/${id}`, { status });
    console.log("🚀 ~ switchWorkOrderStatus ~ response:", response)
    if (response && response.status === 200) {
      return response.data.data;
    }
    throw new Error('Failed to switch work order status');
  } catch (error) {
    throw new Error(error);
  }
};

// Get count of non-closed work orders
export const getNonClosedWorkOrdersCount = async () => {
  try {
    const response = await api.get('/admin/workorder/count/non-closed');
    if (response && response.status === 200) {
      return response.data;
    }
    throw new Error('Failed to fetch non-closed work orders count');
  } catch (error) {
    throw new Error(error);
  }
};

// Create a recutting work order
export const createRecuttingWorkOrder = async (originalWorkOrderId, formData) => {
  try {
    console.log('🚀 ~ createRecuttingWorkOrder ~ originalWorkOrderId:', originalWorkOrderId);
    console.log('🚀 ~ createRecuttingWorkOrder ~ formData:', formData);
    const response = await api.post(`/admin/workorder/recutting/${originalWorkOrderId}`, formData);
    console.log("🚀 ~ createRecuttingWorkOrder ~ response:", response)
    if (response && (response.status === 200 || response.status === 201)) {
      return response.data;
    }
    throw new Error('Failed to create recutting work order');
  } catch (error) {
    console.log('API Error:', error);
    console.log('API Error Response:', error.response);
    console.log('API Error Data:', error.response?.data);
    
    // If the error has a response, throw it with the response data
    if (error.response) {
      throw error; // Re-throw the error with response data
    }
    throw new Error(error.message || 'Failed to create recutting work order');
  }
};

// Get recutting work orders for a specific work order
export const getRecuttingWorkOrders = async (workOrderId) => {
  try {
    console.log('🚀 ~ getRecuttingWorkOrders ~ workOrderId:', workOrderId);
    const response = await api.get(`/admin/workorder/recutting/${workOrderId}`);
    if (response && response.status === 200) {
      return response.data;
    }
    throw new Error('Failed to fetch recutting work orders');
  } catch (error) {
    throw new Error(error);
  }
};

// Get the last created recutting work order for a specific work order
export const getLastCreatedRecuttingWorkOrder = async (workOrderId) => {
  try {
    console.log('🚀 ~ getLastCreatedRecuttingWorkOrder ~ workOrderId:', workOrderId);
    const response = await api.get(`/admin/workorder/recutting/last/${workOrderId}`);
    if (response && response.status === 200) {
      return response.data;
    }
    throw new Error('Failed to fetch last created recutting work order');
  } catch (error) {
    throw new Error(error);
  }
};
