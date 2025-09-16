
import { api } from "@/utils/axios";

export const getSalesExecutives = async (params = {}) => {
  console.log("🚀 ~ getSalesExecutives ~ params:", params)
  try {
    const response = await api.get('/admin/userview/sales-executives', {
      params,
    });
    console.log("🚀 ~ getSalesExecutives ~ response:", response)
    return response.data;
  } catch (error) {
    throw error;
  }
};
