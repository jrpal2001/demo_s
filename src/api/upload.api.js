
import { api } from "@/utils/axios";

// Upload a single file
export const uploadSingleFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/s3/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log("🚀 ~ uploadSingleFile ~ response:", response)

    return response.data.url;
  } catch (error) {
    throw error;
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (files) => {
  console.log("🚀 ~ uploadMultipleFiles ~ files:", files)
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const response = await api.post('/s3/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log("🚀 ~ uploadMultipleFiles ~ response:", response)

    return response.data.urls;
  } catch (error) {
    throw error;
  }
};
