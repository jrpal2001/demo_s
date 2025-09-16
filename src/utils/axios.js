import { logout } from '@/api/auth';
import { resetAuth } from '@/store/auth/AuthSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_SERVER_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Handle unauthorized access and session expiry.
 * 
 * @param {Object} error - The error object from the failed request.
 * @param {Function} dispatch - Redux dispatch function.
 * @param {Function} navigate - Function to navigate to different routes.
 * @returns {Promise} - Rejects the promise with the error.
 */
const handleUnauthorizedError = (error, dispatch, navigate) => {
  console.log('unauthorized error');
  
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    dispatch(resetAuth()); // Reset authentication state
    logout(); // Perform logout
    navigate('/login'); // Redirect to login page

    const errorMessage = error?.response?.data?.message !== 'Invalid Password'
      ? 'Session expired, please log in again.'
      : 'Invalid password, please try again.';
    
    toast.error(errorMessage);
  }

  return Promise.reject(error);
};

/**
 * Handle network errors where no response is received.
 * 
 * @param {Object} error - The error object from the failed request.
 * @returns {Promise} - Rejects the promise with the network error.
 */
const handleNetworkError = (error) => {
  if (error?.message === 'Network Error') {
    toast.error('Network error, please try again later');
  }
  return Promise.reject(error);
};

/**
 * Handle authorization errors like 403 or other errors.
 * 
 * @param {Object} error - The error object from the failed request.
 * @returns {Promise} - Rejects the promise with the error details.
 */
const handleAuthorizationError = (error) => {
  if (error?.response?.status === 403) {
    if(error?.response?.data?.data) {
      error?.response?.data?.data.map(err => {
        toast.error(err)
      });
    } else {
      toast.error(error?.response?.data?.message);
    }
    
    toast.error('Validation failed');
  }
  return Promise.reject(error?.response?.data?.data);
};

/**
 * Handle other errors returned from the server.
 * 
 * @param {Object} error - The error object from the failed request.
 * @returns {Promise} - Rejects the promise with the error response data.
 */
const handleOtherErrors = (error) => {
  const errorMessage = error?.response?.data?.message || 'Something went wrong';
  toast.error(errorMessage);
  return Promise.reject(error?.response?.data);
};

/**
 * Set up interceptors to handle different types of errors and provide a unified error handling flow.
 * 
 * @param {Function} navigate - Function to navigate to different routes.
 * @param {Function} dispatch - Redux dispatch function.
 */
let interceptorsAttached = false;
const setupInterceptors = (navigate, dispatch) => {
  if (interceptorsAttached) return; // Prevent duplicate attachment
  interceptorsAttached = true;

  api.interceptors.response.use(
    (response) => response, // Return response for successful requests
    async (error) => {
      if (error?.response?.status === 401) {
        return handleUnauthorizedError(error, dispatch, navigate);
      }

      if (error?.message === 'Network Error') {
        return handleNetworkError(error);
      }

      if (error?.response?.status === 403) {
        return handleAuthorizationError(error);
      }

      // For any other errors, handle them generically
      return handleOtherErrors(error);
    },
  );

  // Attach token to every request if present in localStorage
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export { api, setupInterceptors };
