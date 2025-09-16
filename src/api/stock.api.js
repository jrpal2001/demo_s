import { api } from "@/utils/axios";

// ✅ Get all Stock Inwards with pagination and search
export const getAllStocks = async (searchTerm = "", page = 1, pageSize = 5) => {
  try {
    const response = await api.get("/admin/stocks", {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        search: searchTerm,
        page,
        pageSize,
      },
    });
    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch stock inwards");
  }
};

export const checkStockAvailability = async (skuCode) => {
  try {
    const response = await api.get("/admin/stocks/check-availability", {
      params: { skuCode },
    });

    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to check stock availability");
  }
};

// ✅ Get Stock Inwards by Category with pagination and search
export const getStocksByCategory = async (category, searchTerm = "", page = 1, pageSize = 5) => {
  try {
    const response = await api.get("/admin/stocks/by-category", {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        category,
        search: searchTerm,
        page,
        pageSize,
      },
    });

    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch stock by category");
  }
};

// ✅ Get Stock Inwards by Subcategory with pagination and search
export const getStocksBySubcategory = async (subcategory, searchTerm = "", page = 1, pageSize = 5) => {
  try {
    const response = await api.get("/admin/stocks/by-subcategory", {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        subcategory,
        search: searchTerm,
        page,
        pageSize,
      },
    });

    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch stock by subcategory");
  }
};

export const getStocks = async ({ category = "", subcategory = "", searchTerm = "", page = 1, pageSize = 5 }) => {
  try {
    const response = await api.get("/admin/stocks/all", {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        category,
        subcategory,
        search: searchTerm,
        page,
        pageSize,
      },
    });

    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch stock");
  }
};

export const getStockDetailsBySkuCode = async (skuCode) => {
  try {
    const response = await api.get(`/admin/stocks/details/${skuCode}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch stock details");
  }
};

// ✅ NEW FUNCTIONS

// Create stock
export const createStock = async (payload) => {
  try {
    const response = await api.post("/admin/stocks", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response?.status === 201) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to create stock");
  }
};

// Get stock by ID
export const getStockById = async (id) => {
  try {
    const response = await api.get(`/admin/stocks/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch stock by ID");
  }
};

// Update stock
export const updateStock = async (id, payload) => {
  try {
    const response = await api.put(`/admin/stocks/${id}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to update stock");
  }
};

// Update stock level
export const updateStockLevel = async (id, payload) => {
  try {
    const response = await api.patch(`/admin/stocks/${id}/level`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to update stock level");
  }
};

// Update reorder levels
export const updateReorderLevels = async (id, payload) => {
  try {
    const response = await api.patch(`/admin/stocks/${id}/reorder-levels`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to update reorder levels");
  }
};

// Decrease stock lot quantity
export const decreaseStockLotQuantity = async (id, payload) => {
  try {
    const response = await api.patch(`/admin/stocks/${id}/decrease-lot`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to decrease stock lot quantity");
  }
};

// Delete stock
export const deleteStock = async (id) => {
  try {
    const response = await api.delete(`/admin/stocks/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response?.status === 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to delete stock");
  }
};
