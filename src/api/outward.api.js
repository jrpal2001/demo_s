import { api } from '@/utils/axios';

// Fetch all outward records for a department
export const fetchAllOutwards = async (department) => {
  console.log("🚀 ~ fetchAllOutwards ~ department:", department)
  try {
    const response = await api.get(`/admin/outward/${department}`);
    console.log("🚀 ~ fetchAllOutwards ~ response:", response)
    if (response && response.data && response.data.data) {
      return response.data.data;
    } else {
      console.error('Unexpected API response format:', response);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching outward records for ${department}:`, error);
    throw error;
  }
};

// Fetch a single outward record by ID
export const fetchOutwardById = async (department, id) => {
  console.log("🚀 ~ fetchOutwardById ~ department:", department)
  try {
    const response = await api.get(`/admin/outward/${department}/${id}`);

    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching outward record:', error);
    const errorMessage =
      error.response?.data?.message || error.message || 'Failed to fetch outward record';
    throw new Error(errorMessage);
  }
};

// Update issued status and issuedQuantity for outward record
export const updateOutwardIssuedStatus = async (department, id, updateData) => {
  try {
    const response = await api.put(`/admin/outward/${department}/${id}`, updateData);

    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating outward record:', error);
    const errorMessage =
      error.response?.data?.message || error.message || 'Failed to update outward record';
    throw new Error(errorMessage);
  }
};

// Fetch outward records by work order ID for a department
export const fetchOutwardsByWorkOrderId = async (department, workOrderId) => {
  try {
    const response = await api.get(`/admin/outward/${department}/workorder/${workOrderId}`);
    console.log("🚀 ~ fetchOutwardsByWorkOrderId ~ response:", response)
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching outward records by work order ID:', error);
    const errorMessage =
      error.response?.data?.message || error.message || 'Failed to fetch outward records by work order ID';
    throw new Error(errorMessage);
  }
};
