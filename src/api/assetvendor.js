import { api } from '../utils/axios';

export const storeAssetVendorData = async (formData) => {
  console.log("🚀 ~ storeAssetVendorData ~ formData:", formData)

  // Log FormData contents for debugging
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value)
  }

  try {
    const response = await api.post(`/admin/assetvendor/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    if (response) {
      return response?.data?.data
    }
  } catch (error) {
    console.error("Store API Error:", error)
    throw error // Throw the original error instead of wrapping it
  }
}

export const updateAssetVendorData = async (id, formData) => {
  console.log("🚀 ~ updateAssetVendorData ~ formData:", formData)

  // Log FormData contents for debugging
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value)
  }

  try {
    const response = await api.put(`/admin/assetvendor/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    if (response && response.status == 200) {
      return response?.data?.message
    }
  } catch (error) {
    console.error("Update API Error:", error)
    throw error // Throw the original error instead of wrapping it
  }
}


export const deleteAssetVendorData = async (id) => {
  try {
    const response = await api.delete(`/admin/assetvendor/delete/${id}`);
    if (response) {
      return response?.data?.message;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const assetVendorSearch = async ( limit, search) => {
  try {
    const response = await api.get(`/admin/assetvendor/search`, {
      params: {
        search: search,
        limit: limit,
      },
    });
    if (response && response.status == 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const assetVendorView = async (page, limit) => {
  try {
    const response = await api.get(`/admin/assetvendor`, {
      params: {
        page: page,
        limit: limit,
      },
    });
    if (response && response.status == 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getAssetVendorById = async (id) => {
  try {
    const response = await api.get(`/admin/assetvendor/${id}`);
    if (response && response.status == 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getLastAssetVendorCode = async () => {
  try {
    const response = await api.get(`/admin/assetvendor/last-vendor`);
    if (response && response.status == 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllAssetVendorCodes = async (vendorCode) => {
  try {
    const response = await api.get(`/admin/assetvendor/all-vendor`, {
      params: {
        vendorCode: vendorCode,
      },
    });
    if (response && response.status == 200) {
      return response?.data?.data;
    }
  } catch (error) {
    throw new Error(error);
  }
};
