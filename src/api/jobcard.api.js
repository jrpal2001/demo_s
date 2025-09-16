import { api } from '../utils/axios';

// Mark a job card as completed
export const markJobCardCompleted = async (id, data = {}) => {
  const response = await api.patch(`/admin/jobcard/${id}/complete`, data);
  return response.data;
};

export const getNonCompletedJobCardsCount = async () => {
  const response = await api.get('/admin/jobcard/count/non-completed');
  return response.data;
};

export const getJobCardsStatusCounts = async () => {
  const response = await api.get('/admin/jobcard/count/status');
  console.log("🚀 ~ getJobCardsStatusCounts ~ response:", response)
  return response.data.data;
};

export const getJobCardsDashboardSummary = async () => {
  const response = await api.get('/admin/jobcard/dashboard/summary');
  return response.data;
};
