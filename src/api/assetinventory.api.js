import { api } from '@/utils/axios';

// Create new Asset Inventory item
export const createAssetInventory = async (data) => {
  try {
    const response = await api.post(`/admin/assetinventory/create`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating asset inventory item:', error);
    throw error;
  }
};

// Get all Asset Inventory items
export const fetchAllAssetInventory = async () => {
  try {
    const response = await api.get(`/admin/assetinventory`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all asset inventory items:', error);
    throw error;
  }
};

// Get all Asset Codes (with pagination + search)
export const fetchAllAssetCodes = async ({ page = 1, limit = 10, search = '' }) => {
  try {
    const response = await api.get(`/admin/assetinventory/codes`, {
      params: { page, limit, search },
    });
    console.log("🚀 ~ fetchAllAssetCodes ~ response:", response)
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching asset codes:', error);
    throw error;
  }
};

// Get Asset Inventory item by ID
export const fetchAssetInventoryById = async (id) => {
  try {
    const response = await api.get(`/admin/assetinventory/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching asset inventory by ID:', error);
    throw error;
  }
};

// Update Minimum Required Stock
export const updateAssetMinStock = async (id, MinreqStock) => {
  try {
    const response = await api.put(`/admin/assetinventory/update-min/${id}`, {
      MinreqStock,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating min stock:', error);
    throw error;
  }
};

// Get All by Asset Type (with pagination + search)
export const fetchAssetInventoryByType = async ({ assetType, page = 1, limit = 10, search = '' }) => {
  try {
    const response = await api.get(`/admin/assetinventory/by-type/${assetType}`, {
      params: { page, limit, search },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching asset inventory by type (${assetType}):`, error);
    throw error;
  }
};

// Update Asset Inventory item
export const updateAssetInventory = async (id, data) => {
  try {
    const response = await api.put(`/admin/assetinventory/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating asset inventory item (${id}):`, error);
    throw new Error(error.response?.data?.message || 'Error updating asset inventory item');
  }
};
