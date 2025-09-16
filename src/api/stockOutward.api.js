import { api } from "@/utils/axios";

// ✅ Get all Stock Outwards with pagination and search
export const getAllStockOutwards = async (searchTerm = "", page = 1, pageSize = 5) => {
  try {
    const response = await api.get("/admin/stockoutward", {
    headers: {
        'Content-Type': 'application/json',
    },
    params: {
    search: searchTerm, // Backend should handle this key
    page,
    pageSize,
    },
    });

    if (response?.status === 200) {
      return response.data?.data; // Should include records, totalPages, currentPage, totalCount
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch stock outwards");
  }
};


// ✅ Create a new Stock Outward
export const createStockOutward = async (data) => {
  try {
    const response = await api.post("/admin/stockoutward/create", data);
    if (response?.status === 201) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to create stock outward");
  }
};

// ✅ Get a single Stock Outward by ID
export const getStockOutwardById = async (id) => {
  try {
    const response = await api.get(`/admin/stockoutward/${id}`);
    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch stock outward by ID");
  }
};

// ✅ Get Stock Outward records by SKU Code with pagination
export const getAllStockOutwardsForSkuCode = async (skuCode, page = 1, pageSize = 5) => {
  if (!skuCode || skuCode.trim() === "") {
    throw new Error("SKU code is required");
  }

  try {
    const response = await api.get(`/admin/stockoutward/sku/${skuCode}`, {
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
    throw new Error(error?.response?.data?.message || "Failed to fetch stock outwards");
  }
};
