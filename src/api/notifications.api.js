import { api } from "@/utils/axios";

// Save a notification (called from frontend)
export const saveNotification = async (data) => {
  console.log("🚀 ~ saveNotification ~ data:", data)
  try {
    const response = await api.post("/admin/notifications", data);
    if (response && response.status === 201) {
      return response.data;
    }
  } catch (error) {
    throw new Error(error?.response?.data?.error || "Failed to save notification");
  }
};

// Get notifications with pagination for a user (or all if no userId)
export const getLastNotifications = async (params = {}) => {
  try {
    const response = await api.get("/admin/notifications", { params });
    if (response && response.status === 200) {
      return response.data; // { notifications, pagination }
    }
  } catch (error) {
    throw new Error(error?.response?.data?.error || "Failed to fetch notifications");
  }
};

// Mark a notification as read
// export const markNotificationAsRead = async (id) => {
//   try {
//     const response = await api.patch(`/notifications/${id}/read`);
//     if (response && response.status === 200) {
//       return response.data;
//     }
//   } catch (error) {
//     throw new Error(error?.response?.data?.error || "Failed to mark notification as read");
//   }
// }; 