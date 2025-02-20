import axios from "axios";
import store from "../redux/store";
import { logoutUser, refreshAccessToken } from "../redux/userSlice/authActions";
import { BackendUrl } from "../redux/api/axios";
import { getRefreshToken, getToken, removeToken } from "../utils/handelCookie";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || `${BackendUrl}/api`,
  timeout: 10000,
});
// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.authorization = ` ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log(originalRequest);
    
    // If the error is a 401 and the request has not already been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          console.log("No refresh token available" , refreshToken);
          removeToken();
          localStorage.clear();
          // window.location.reload();
          return Promise.reject(new Error("No refresh token available"));
        }
        // Dispatch refresh token action
        const result = await store.dispatch(refreshAccessToken()).unwrap();
        console.log("result", result);
        
        if (result?.accessToken) {
          // Update the failed request's authorization header with new token
          originalRequest.headers.authorization = `Bearer ${result.accessToken}`;
          // Retry the original request with new token
          return axiosInstance(originalRequest);
        } else {
          throw new Error("Failed to refresh token");
        }
      } catch (err) {
        // If token refresh fails, clear everything and redirect to login
        console.log("err", err);
        
        removeToken();
        localStorage.clear();
        await store.dispatch(logoutUser())
        // window.location.reload();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
