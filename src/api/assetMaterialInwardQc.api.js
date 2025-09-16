import { api } from "@/utils/axios";

export const storeAssetMaterialInwardQc = async (formData) => {
  try {
    const response = await api.post(`/admin/asset-material-inward-qc/create`, formData);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchAssetMaterialInwardQcsData = async (page = 0, limit = 5) => {
  try {
    const response = await api.get(`/admin/asset-material-inward-qc`, {
      params: { page, limit },
    });
    if (response && response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchAssetMaterialInwardQcById = async (id) => {
  try {
    const response = await api.get(`/admin/asset-material-inward-qc/${id}`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteAssetMaterialInwardQc = async (id) => {
  try {
    const response = await api.delete(`/admin/asset-material-inward-qc/delete/${id}`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateAssetMaterialInwardQc = async (id, formData) => {
  try {
    const response = await api.put(`/admin/asset-material-inward-qc/update/${id}`, formData);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
