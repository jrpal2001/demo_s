import { api } from '../utils/axios';

// ========================
// ASSET INDENT APIs
// ========================

/**
 * Fetch all asset indents with pagination
 */
export const fetchAssetIndent = async (page = 0, limit = 5) => {
  try {
    const response = await api.get(`/admin/assetindent`, {
      params: { page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching asset indents:', error);
    throw error;
  }
};

/**
 * Fetch a single asset indent by ID
 */
export const fetchAssetIndentById = async (id) => {
  try {
    const response = await api.get(`/admin/assetindent/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching asset indent by ID:', error);
    throw error;
  }
};

/**
 * Create a new asset indent
 */
export const storeAssetIndent = async (formData) => {
  try {
    const response = await api.post(`/admin/assetindent/create`, formData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating asset indent:', error);
    throw error;
  }
};

/**
 * Update an existing asset indent
 */
export const updateAssetIndent = async (id, formData) => {
  try {
    const response = await api.put(`/admin/assetindent/update/${id}`, formData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating asset indent:', error);
    throw error;
  }
};

/**
 * Delete an asset indent
 */
export const deleteAssetIndent = async (id) => {
  try {
    const response = await api.delete(`/admin/assetindent/delete/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error deleting asset indent:', error);
    throw error;
  }
};

/**
 * Search asset indents
 */
export const searchAssetIndent = async (searchText, limit = 10) => {
  try {
    const response = await api.get(`/admin/assetindent/search`, {
      params: { searchText, limit },
    });
    console.log("🚀 ~ searchAssetIndent ~ response:", response)
    return response.data.data;
  } catch (error) {
    console.error('Error searching asset indents:', error);
    throw error;
  }
};

// ========================
// ITEM CODES APIs
// ========================

/**
 * Get recent item codes (last 10 created items)
 * Excludes embroidery store items
 */
export const getRecentItemCodes = async (limit = 10) => {
  try {
    console.log('📥 Frontend API: Getting recent item codes, limit:', limit);

    const response = await api.get('/admin/itemcodes/recent', {
      params: { limit },
    });

    console.log('📥 Frontend API: Recent items response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Frontend API: Error getting recent item codes:', error);
    throw error;
  }
};

/**
 * Realtime search for item codes (on every keystroke)
 * Excludes embroidery store items
 */
export const searchItemCodesRealtime = async (searchText, limit = 10) => {
  try {
    console.log('🔍 Frontend API: Making realtime search request for:', searchText);

    const response = await api.get('/admin/itemcodes/realtime-search', {
      params: {
        searchText: searchText.trim(),
        limit,
      },
    });

    console.log('🔍 Frontend API: Realtime search response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Frontend API: Error in realtime search:', error);
    throw error;
  }
};

export default api;
