import { api } from '@/utils/axios';

// Fetch Lots by Inventory ID and Asset Type
export const fetchLotsByAssetInventory = async ( inventoryId, page = 0, pageSize = 10) => {
  try {
    const response = await api.get(`/admin/assetlot/${inventoryId}`, {
      params: { page, limit: pageSize },
    });
    console.log("🚀 ~ fetchLotsByAssetInventory ~ response:", response)

    return {
      lots: response.data?.data?.lots || [],
      page: response.data?.data?.page || 0,
      limit: response.data?.data?.limit || pageSize,
      totalCount: response.data?.data?.totalCount || 0,
      totalPages: response.data?.data?.totalPages || 0,
    };
  } catch (error) {
    console.error(`Error fetching asset lots for ${assetType}:`, error);
    return {
      lots: [],
      page,
      limit: pageSize,
      totalCount: 0,
      totalPages: 0,
      error: error?.response?.data?.message || error.message,
    };
  }
};
