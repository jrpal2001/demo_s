import { api } from '@/utils/axios';

// Create a new SRS dispatch
export const createSrsDispatch = async (formData) => {
  console.log('🚀 ~ createSrsDispatch ~ formData:', formData);
  try {
    const response = await api.post('/admin/srs-dispatch', formData);
    if (response && (response.status === 200 || response.status === 201)) {
      return response.data.data;
    }
    throw new Error('Failed to create SRS dispatch');
  } catch (error) {
    console.error('Error creating SRS dispatch:', error);
    throw error.response?.data || new Error(error.message);
  }
};

// Get all SRS dispatches with filters and pagination
export const getAllSrsDispatches = async (params = {}) => {
  try {
    console.log('🚀 ~ getAllSrsDispatches ~ params:', params);
    const response = await api.get('/admin/srs-dispatch', { params });
    if (response && response.status === 200) {
      return response.data;
    }
    throw new Error('Failed to fetch SRS dispatches');
  } catch (error) {
    console.error('Error fetching SRS dispatches:', error);
    throw error.response?.data || new Error(error.message);
  }
};

// Get a single dispatch by ID
export const getSrsDispatchById = async (id) => {
  try {
    console.log('🚀 ~ getSrsDispatchById ~ id:', id);
    const response = await api.get(`/admin/srs-dispatch/${id}`);
    if (response && response.status === 200) {
      return response.data.data;
    }
    throw new Error('Failed to fetch SRS dispatch by ID');
  } catch (error) {
    console.error('Error fetching SRS dispatch by ID:', error);
    throw error.response?.data || new Error(error.message);
  }
};

// Get dispatches by work order
export const getSrsDispatchesByWorkOrder = async (workOrderId) => {
  try {
    console.log('🚀 ~ getSrsDispatchesByWorkOrder ~ workOrderId:', workOrderId);
    const response = await api.get(`/admin/srs-dispatch/work-order/${workOrderId}`);
    if (response && response.status === 200) {
      return response.data.data;
    }
    throw new Error('Failed to fetch SRS dispatches by work order');
  } catch (error) {
    console.error('Error fetching SRS dispatches by work order:', error);
    throw error.response?.data || new Error(error.message);
  }
};

// Cancel a dispatch (soft delete + stock restoration)
export const cancelSrsDispatch = async (id, reason) => {
  try {
    console.log('🚀 ~ cancelSrsDispatch ~ id:', id, 'reason:', reason);
    const response = await api.patch(`/admin/srs-dispatch/${id}/cancel`, { reason });
    if (response && response.status === 200) {
      return response.data;
    }
    throw new Error('Failed to cancel SRS dispatch');
  } catch (error) {
    console.error('Error cancelling SRS dispatch:', error);
    throw error.response?.data || new Error(error.message);
  }
};
