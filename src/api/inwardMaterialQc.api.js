import { api } from "@/utils/axios";

export const storeInwardMaterialQc = async (formData) => {
    console.log("🚀 ~ storeInwardMaterialQc ~ formData:", formData)
    try {
        const response = await api.post(`/admin/inwardmaterialqc/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }});
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const updateInwardMaterialQc = async (id,formData) => {
    console.log("🚀 ~ storeInwardMaterialQc ~ formData:", formData)
    try {
        const response = await api.put(`/admin/inwardmaterialqc/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }});
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const fetchMaterialInwardQcsData = async (page=0, limit=5) => {
    try {
        const response = await api.get(`/admin/inwardmaterialqc`, {
            params: {
                page: page,
                limit: limit
            }
        });
        if(response && response.status == 200) {
            return response.data;
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export const fetchMaterialInwardQcById = async (id) => {
    try {
        const response = await api.get(`/admin/inwardmaterialqc/${id}`);
        if(response) {
            return response.data;
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export const deleteMaterialInwardQc = async (id) => {
    try {
        const response = await api.delete(`/admin/inwardmaterialqc/delete/${id}`);
        if(response) {
            return response.data;
        }
    } catch (error) {
        throw new Error(error.message);
    }
}