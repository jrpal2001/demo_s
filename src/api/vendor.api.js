import { api } from "@/utils/axios";

export const storeVendorData = async (formData) => {
    console.log("🚀 ~ storeVendorData ~ formData:", formData)
    try {
        const response = await api.post(`/admin/vendor/create`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if(response) {
            return response?.data?.data;
        }
    } catch (error) {
        throw new Error(error);
    }
};

export const updateVendorData = async (id, formData) => {
    console.log("🚀 ~ updateVendorData ~ formData:", formData)
    try {
        const response = await api.put(`/admin/vendor/update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if(response && response.status == 200) {
            return response?.data?.message;
        }
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteVendorData = async (id) => {
    try {
        const response = await api.delete(`/admin/vendor/delete/${id}`);
        if(response) {
            return response?.data?.message;
        }
    } catch (error) {
        throw new Error(error);
    }
}

export const searchByVendorId = async (id) => {
    try {
        const response = await api.get(`/admin/vendor/search`, {
            params: {
                search: id,
                limit: 10
            }
        });
        if(response && response.status == 200) {
            return response?.data;
        }
    } catch (error) {
        throw new Error(error);
    }
}   