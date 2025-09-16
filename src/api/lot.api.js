import { api } from '@/utils/axios';

// // Fetch lots by inventory ID for a specific department
// export const fetchLotsByInventory = async (department, inventoryId, page = 0, pageSize = 10) => {
//   try {
//     const response = await api.get(`/admin/lot/${department}/${inventoryId}`, {
//       params: {
//         page,
//         limit: pageSize,
//       },
//     });

//     if (response && response.data && response.data.data) {
//       return {
//         lots: response.data.data.lots,
//         page: response.data.data.page,
//         limit: response.data.data.limit,
//         totalCount: response.data.data.totalCount,
//       };
//     } else {
//       console.error('Unexpected API response format:', response);
//       return { lots: [], page: 0, limit: pageSize, totalCount: 0 };
//     }
//   } catch (error) {
//     console.error(`Error fetching lots for ${department}:`, error);
//     throw error;
//   }
// };

export const fetchLotsByInventory = async (department, inventoryId) => {
  console.log("🚀 ~ fetchLotsByInventory ~ department:", department)
  try {
    const response = await api.get(`/admin/lot/${department}/${inventoryId}`);
    // The backend now returns an array of lots: [{ lotName, quantity }]
    console.log("🚀 ~ fetchLotsByInventory ~ response:", response)
    return {
      lots: response.data?.data || [],
    };
  } catch (error) {
    console.error(`Error fetching lots for ${department}:`, error);
    throw error;
  }
};
