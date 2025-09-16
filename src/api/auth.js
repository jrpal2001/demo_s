import { api } from '../utils/axios';

export const login = async (data) => {
  try {
    const response = await api.post('auth/login', data);
    if (response) {
      return response.data?.data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  let response;
  try {
    response = await api.post('auth/logout', data);
  } catch (error) {
    return error;
  }
  return response.data.data;
};
