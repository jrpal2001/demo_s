import { api } from "@/utils/axios";

// ✅ Get all Stock Inwards
export const getAllStockInwards = async () => {
  try {
    const response = await api.get("/admin/stockinward");
    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch stock inwards");
  }
};

// ✅ Create a new Stock Inward
export const createStockInward = async (data) => {
  try {
    const response = await api.post("/admin/stockinward/create", data);
    if (response?.status === 201) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to create stock inward");
  }
};

// ✅ Get a single Stock Inward by ID
export const getStockInwardById = async (id) => {
  try {
    const response = await api.get(`/admin/stockinward/${id}`);
    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch stock inward by ID");
  }
};

// ✅ Get Stock Inward records by SKU Code with pagination
export const getAllStockInwardsForSkuCode = async (skuCode, page = 1, pageSize = 5) => {
  if (!skuCode || skuCode.trim() === "") {
    throw new Error("SKU code is required");
  }

  try {
    const response = await api.get(`/admin/stockinward/sku/${skuCode}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        page,
        limit: pageSize,
      },
    });

    if (response?.status === 200) {
      return response.data?.data; // includes records, totalPages, currentPage, totalCount
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch stock inwards");
  }
};

export const getAllLotNoForSkuCode = async (skuCode, limit = 10, search = "") => {
  console.log("🚀 ~ getAllLotNoForSkuCode ~ search:", search)
  if (!skuCode || skuCode.trim() === "") {
    throw new Error("SKU code is required");
  }

  try {
    const response = await api.get(`/admin/stockinward/lot/${skuCode}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        limit,
        search,
      },
    });
    console.log("🚀 ~ getAllLotNoForSkuCode ~ response:", response)

    if (response?.status === 200) {
      return response.data; // { skuCode, lotNumbers, totalLots, limit }
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch lot numbers");
  }
};
