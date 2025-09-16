import { api } from "@/utils/axios";

// ✅ Get FG Store entries by Work Order ID
export const getFgStoreByWorkOrder = async (workorderId) => {
  try {
    const response = await api.get(`/admin/fgstore/workorder/${workorderId}`);
    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch FG Store by Work Order");
  }
};

// ✅ Get FG Store entries by SKU Code with pagination
export const getFgStoreBySKU = async (searchSku, page = 1, pageSize = 5) => {
console.log("🚀 ~ getFgStoreBySKU ~ page:", page)
console.log("🚀 ~ getFgStoreBySKU ~ searchSku:", searchSku)

  try {
    const response = await api.get(`/admin/fgstore/sku/${searchSku}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        page,
        pageSize,
      },
    });

    if (response?.status === 200) {
      return response.data?.data; // includes records, totalPages, currentPage, totalCount
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch FG Store by SKU");
  }
};

// ✅ Get FG Store entries by Job Card ID
export const getFgStoreByJobCard = async (jobCardId) => {
  try {
    const response = await api.get(`/admin/fgstore/jobcard/${jobCardId}`);
    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch FG Store by Job Card");
  }
};

// ✅ Get FG Defects by Work Order ID
export const getFgDefectsByWorkOrder = async (workorderId) => {
  try {
    const response = await api.get(`/admin/fgstore/defects/workorder/${workorderId}`);
    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch FG Defects by Work Order");
  }
};

// ✅ Get FG Defects by SKU Code with pagination
export const getFgDefectsBySKU = async (skuCode, page = 1, pageSize = 10) => {
  try {
    const response = await api.get(`/admin/fgstore/defects/sku/${skuCode}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        page,
        pageSize,
      },
    });

    if (response?.status === 200) {
      return response.data?.data; // includes records, totalPages, currentPage, totalCount
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch FG Defects by SKU");
  }
};

// ✅ Get FG Defects by Job Card ID
export const getFgDefectsByJobCard = async (jobCardId) => {
  try {
    const response = await api.get(`/admin/fgstore/defects/jobcard/${jobCardId}`);
    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch FG Defects by Job Card");
  }
};
