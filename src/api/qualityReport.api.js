import { api } from "@/utils/axios";

// Create a new quality report (with files)
export const createQualityReport = async (formData) => {
    try {
        const response = await api.post(`/admin/quality-reports/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Update a quality report (optionally with files)
export const updateQualityReport = async (id, formData) => {
    try {
        const response = await api.put(`/admin/quality-reports/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Fetch all quality reports (optionally with pagination)
export const fetchQualityReports = async (params = {}) => {
    try {
        const response = await api.get(`/admin/quality-reports/`, { params });
        if (response && response.status === 200) {
            return response.data;
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

// Fetch a quality report by ID
export const fetchQualityReportById = async (id) => {
    try {
        const response = await api.get(`/admin/quality-reports/${id}`);
        if (response) {
            return response.data;
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

// Delete a quality report
export const deleteQualityReport = async (id) => {
    try {
        const response = await api.delete(`/admin/quality-reports/${id}`);
        if (response) {
            return response.data;
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

// Get all quality reports by departments
export const fetchQualityReportsByDepartments = async (departments) => {
    try {
        const response = await api.post(`/admin/quality-reports/by-departments`, { departments });
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Resolve a quality report
export const resolveQualityReport = async (id, resolutionRemarks) => {
    try {
        const response = await api.post(`/admin/quality-reports/${id}/resolve`, { resolutionRemarks });
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Fetch quality reports dashboard summary
export const getQualityReportsDashboardSummary = async () => {
  try {
    const response = await api.get('/admin/quality-reports/dashboard/summary');
    if (response && response.status === 200) {
      return response.data;
    }
    throw new Error('Failed to fetch quality reports dashboard summary');
  } catch (error) {
    throw new Error(error);
  }
};
