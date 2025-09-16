import { api } from "@/utils/axios";

export const fetchBomByCategory = async (category='BOM') => {
    try {
        const response = await api.get(`/admin/bom/bomcodes/${category}`);
        if(response && response.status == 200) {
            console.log("🚀 ~ fetchBomByCategory ~ response:", response)
            return response?.data?.data;
        }
    } catch (error) {
        throw new Error(error);
    }
}